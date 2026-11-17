const PREFIX = 'currentheading.memberful.oauth.v1';
export const MEMBERFUL_SESSION_KEY = `${PREFIX}.session`;
const TRANSACTION_PREFIX = `${PREFIX}.transaction.`;
const TRANSACTION_TTL = 15 * 60_000;
const REFRESH_TTL = 365 * 24 * 60 * 60_000;

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function pkceChallenge(verifier, crypto) {
  return base64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
}
function returnPath(value, origin) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  const url = new URL(value, origin);
  if (url.origin !== origin || url.pathname.startsWith('/member/')) return '/';
  return `${url.pathname}${url.search}${url.hash}`;
}
class SessionError extends Error {
  constructor(message, status = 401) { super(message); this.status = status; }
}

// Only the public OAuth identifier belongs here. Admin API keys are never used.
export function createMemberfulAuth({ site, clientId, redirectUri, storage, crypto, fetch: fetcher, now = Date.now }) {
  const origin = new URL(redirectUri).origin;
  const sessionKey = `${MEMBERFUL_SESSION_KEY}.${clientId}`;
  const logoutKey = `${sessionKey}.logout`;
  let generation = 0;
  let restoring = null;
  const random = () => base64url(crypto.getRandomValues(new Uint8Array(32)));
  const read = (key) => { try { return JSON.parse(storage.getItem(key) ?? 'null'); } catch { return null; } };
  const write = (key, value) => storage.setItem(key, JSON.stringify(value));
  const current = () => {
    const saved = read(sessionKey);
    if (saved && typeof saved.accessToken === 'string' && typeof saved.refreshToken === 'string'
      && typeof saved.memberId === 'string' && Number.isFinite(saved.expiresAt)
      && Number.isFinite(saved.refreshExpiresAt) && saved.refreshExpiresAt > now()) return saved;
    storage.removeItem(sessionKey);
    return null;
  };
  async function request(url, options) {
    const response = await fetcher(url, { ...options, credentials: 'omit', signal: AbortSignal.timeout(15_000) });
    let body;
    try { body = await response.json(); } catch { throw new SessionError('Memberful could not complete this request. Please try again.', response.status || 502); }
    if (!response.ok || body.error) throw new SessionError('Your member session has expired. Please sign in again.', response.ok ? 400 : response.status);
    return body;
  }
  async function token(parameters, previous) {
    const body = await request(`${site}/oauth/token`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, ...parameters }).toString(),
    });
    const lifetime = Number(body.expires_in);
    const refreshToken = body.refresh_token || previous?.refreshToken;
    if (typeof body.access_token !== 'string' || typeof refreshToken !== 'string' || !Number.isFinite(lifetime) || lifetime <= 0) {
      throw new SessionError('Memberful returned an incomplete session. Please sign in again.');
    }
    return { accessToken: body.access_token, refreshToken, expiresAt: now() + lifetime * 1000,
      refreshExpiresAt: body.refresh_token && body.refresh_token !== previous?.refreshToken ? now() + REFRESH_TTL : (previous?.refreshExpiresAt ?? now() + REFRESH_TTL) };
  }
  async function member(accessToken) {
    const url = new URL(`${site}/api/graphql/member`);
    url.searchParams.set('query', '{ currentMember { id } }');
    const body = await request(url.href, { headers: { Authorization: `Bearer ${accessToken}` } });
    const id = body.data?.currentMember?.id;
    if (body.errors?.length || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new SessionError('We could not verify your member session. Please sign in again.');
    }
    return String(id);
  }
  async function restoreSession() {
    const saved = current();
    if (!saved) return false;
    const snapshot = storage.getItem(sessionKey);
    const started = generation;
    const unchanged = () => generation === started && storage.getItem(sessionKey) === snapshot;
    try {
      let tokens = saved;
      let refreshed = false;
      if (saved.expiresAt <= now() + 30_000) {
        tokens = await token({ grant_type: 'refresh_token', refresh_token: saved.refreshToken }, saved);
        refreshed = true;
      }
      let memberId;
      try { memberId = await member(tokens.accessToken); }
      catch (error) {
        if (refreshed || !(error instanceof SessionError) || error.status !== 401) throw error;
        tokens = await token({ grant_type: 'refresh_token', refresh_token: saved.refreshToken }, saved);
        memberId = await member(tokens.accessToken);
      }
      if (!unchanged()) return false;
      write(sessionKey, { ...tokens, memberId });
      return true;
    } catch (error) {
      if (unchanged() && error instanceof SessionError && [400, 401, 403].includes(error.status)) storage.removeItem(sessionKey);
      return false;
    }
  }
  return {
    sessionKey,
    logoutKey,
    async beginSignIn(destination = '/') {
      if (!clientId) throw new Error('Member sign-in is not configured yet.');
      const state = random();
      const verifier = random();
      const url = new URL(`${site}/oauth`);
      url.search = new URLSearchParams({ response_type: 'code', client_id: clientId,
        redirect_uri: redirectUri, state, code_challenge: await pkceChallenge(verifier, crypto), code_challenge_method: 'S256' }).toString();
      // Separate keys let sign-in flows in different tabs complete independently.
      write(`${TRANSACTION_PREFIX}${state}`, { verifier, returnTo: returnPath(destination, origin), createdAt: now(), clientId, logoutVersion: storage.getItem(logoutKey) });
      return url.href;
    },
    async completeSignIn(callbackUrl) {
      const url = new URL(callbackUrl);
      const state = url.searchParams.get('state');
      const key = `${TRANSACTION_PREFIX}${state}`;
      const pending = read(key);
      storage.removeItem(key); // One-time, including unsuccessful callback attempts.
      if (url.origin !== origin || url.pathname !== new URL(redirectUri).pathname || !state || !pending
        || pending.clientId !== clientId || typeof pending.verifier !== 'string' || pending.logoutVersion !== storage.getItem(logoutKey)) {
        throw new Error('We could not verify this sign-in request. Please start again.');
      }
      if (!Number.isFinite(pending.createdAt) || pending.createdAt > now() || now() - pending.createdAt > TRANSACTION_TTL) {
        throw new Error('This sign-in request has expired. Please start again.');
      }
      const code = url.searchParams.get('code');
      if (url.searchParams.has('error') || !code) throw new Error('Sign-in was not completed. Please start again.');
      const started = ++generation;
      const tokens = await token({ grant_type: 'authorization_code', code, code_verifier: pending.verifier, redirect_uri: redirectUri });
      const memberId = await member(tokens.accessToken);
      if (started !== generation || pending.logoutVersion !== storage.getItem(logoutKey)) throw new Error('This sign-in request is no longer active. Please start again.');
      write(sessionKey, { ...tokens, memberId });
      return returnPath(pending.returnTo, origin);
    },
    restore() {
      if (restoring) return restoring;
      const result = restoreSession();
      restoring = result;
      result.finally(() => { if (restoring === result) restoring = null; });
      return result;
    },
    invalidate() { generation++; restoring = null; },
    signOut() {
      generation++;
      storage.setItem(logoutKey, random());
      storage.removeItem(sessionKey);
      for (let i = storage.length - 1; i >= 0; i--) {
        const key = storage.key(i);
        if (key?.startsWith(TRANSACTION_PREFIX)) storage.removeItem(key);
      }
      const url = new URL(`${site}/auth/sign_out`);
      url.searchParams.set('return_to', `${origin}/`);
      return url.href;
    },
  };
}
