import assert from 'node:assert/strict';
import { test } from 'node:test';
import { webcrypto } from 'node:crypto';
import { createMemberfulAuth, pkceChallenge } from '../src/lib/memberful-auth.mjs';

const config = { site: 'https://currentheading.memberful.com', clientId: 'public-client-id', redirectUri: 'https://currentheading.com/member/callback/' };
class Storage {
  data = new Map();
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  get length() { return this.data.size; }
  key(index) { return [...this.data.keys()][index] ?? null; }
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
function setup(responder) {
  const storage = new Storage();
  const calls = [];
  let time = 1_000_000;
  const auth = createMemberfulAuth({ ...config, storage, crypto: webcrypto, now: () => time, fetch: async (url, options = {}) => {
    calls.push({ url: String(url), options });
    return responder(url, options);
  } });
  return { auth, storage, calls, advance: (ms) => { time += ms; } };
}
async function signIn(ctx, returnTo = '/') {
  const url = new URL(await ctx.auth.beginSignIn(returnTo));
  return ctx.auth.completeSignIn(`${config.redirectUri}?code=valid-code&state=${url.searchParams.get('state')}`);
}
const success = (url) => String(url).endsWith('/oauth/token')
  ? json({ access_token: 'member-access-token', refresh_token: 'member-refresh-token', expires_in: 900 })
  : json({ data: { currentMember: { id: 'member-123' } } });

test('PKCE uses the RFC 7636 SHA-256 challenge vector', async () => {
  assert.equal(await pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk', webcrypto), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
});
test('sign-in uses a unique state and S256 challenge without exposing the verifier', async () => {
  const ctx = setup(success);
  const a = new URL(await ctx.auth.beginSignIn('/#membership'));
  const b = new URL(await ctx.auth.beginSignIn('/'));
  assert.equal(a.origin + a.pathname, config.site + '/oauth');
  assert.equal(a.searchParams.get('response_type'), 'code');
  assert.equal(a.searchParams.get('client_id'), config.clientId);
  assert.equal(a.searchParams.get('code_challenge_method'), 'S256');
  assert.match(a.searchParams.get('state'), /^[A-Za-z0-9_-]{43}$/);
  assert.match(a.searchParams.get('code_challenge'), /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(a.searchParams.get('state'), b.searchParams.get('state'));
  assert.equal(a.searchParams.has('code_verifier'), false);
});
test('unknown callback state is rejected before any token request', async () => {
  const ctx = setup(success);
  await ctx.auth.beginSignIn('/');
  await assert.rejects(ctx.auth.completeSignIn(`${config.redirectUri}?code=valid-code&state=forged-state`), /sign-in request/i);
  assert.equal(ctx.calls.length, 0);
});
test('an expired callback cannot be redeemed', async () => {
  const ctx = setup(success);
  const url = new URL(await ctx.auth.beginSignIn('/'));
  ctx.advance(16 * 60_000);
  await assert.rejects(ctx.auth.completeSignIn(`${config.redirectUri}?code=valid-code&state=${url.searchParams.get('state')}`), /expired/i);
  assert.equal(ctx.calls.length, 0);
});
test('callback exchanges the verifier and confirms the member before persisting a session', async () => {
  const ctx = setup(success);
  assert.equal(await signIn(ctx, '/#membership'), '/#membership');
  assert.equal(ctx.calls.length, 2);
  const body = new URLSearchParams(ctx.calls[0].options.body);
  assert.equal(body.get('grant_type'), 'authorization_code');
  assert.equal(body.get('client_id'), config.clientId);
  assert.match(body.get('code_verifier'), /^[A-Za-z0-9_-]{43}$/);
  assert.equal(body.has('client_secret'), false);
  assert.equal(body.has('api_key'), false);
  assert.equal(ctx.calls[1].options.headers.Authorization, 'Bearer member-access-token');
  assert.equal(await ctx.auth.restore(), true);
});
test('a callback can only be consumed once', async () => {
  const ctx = setup(success);
  const url = new URL(await ctx.auth.beginSignIn('/'));
  const callback = `${config.redirectUri}?code=valid-code&state=${url.searchParams.get('state')}`;
  await ctx.auth.completeSignIn(callback);
  await assert.rejects(ctx.auth.completeSignIn(callback), /sign-in request/i);
});
test('GraphQL errors cannot create an authenticated session', async () => {
  const ctx = setup((url) => String(url).endsWith('/oauth/token') ? success(url) : json({ errors: [{ message: 'Invalid authentication token.' }] }));
  await assert.rejects(signIn(ctx), /verify|session/i);
  assert.equal(await ctx.auth.restore(), false);
});
test('expired access tokens are refreshed before checking member identity', async () => {
  const ctx = setup(success);
  await signIn(ctx);
  ctx.advance(16 * 60_000);
  assert.equal(await ctx.auth.restore(), true);
  const refresh = ctx.calls.find(call => new URLSearchParams(call.options.body).get('grant_type') === 'refresh_token');
  assert.ok(refresh);
  assert.equal(new URLSearchParams(refresh.options.body).get('refresh_token'), 'member-refresh-token');
});
test('logout clears the browser session and prevents a late refresh from restoring it', async () => {
  let completeRefresh;
  let blockRefresh = false;
  const ctx = setup((url, options) => {
    if (blockRefresh && new URLSearchParams(options.body).get('grant_type') === 'refresh_token') {
      return new Promise(resolve => { completeRefresh = () => resolve(success(url)); });
    }
    return success(url);
  });
  await signIn(ctx);
  ctx.advance(16 * 60_000);
  blockRefresh = true;
  const restore = ctx.auth.restore();
  while (!completeRefresh) await new Promise(resolve => setImmediate(resolve));
  const signOut = new URL(ctx.auth.signOut());
  assert.equal(signOut.origin + signOut.pathname, config.site + '/auth/sign_out');
  assert.equal(signOut.searchParams.get('return_to'), 'https://currentheading.com/');
  completeRefresh();
  assert.equal(await restore, false);
  assert.equal(await ctx.auth.restore(), false);
});
test('return destinations stay on the website and exclude auth flow routes', async () => {
  for (const destination of ['https://evil.example', '//evil.example', '/member/sign-in/', '/member/callback/?code=x', '/member/sign-out/']) {
    const ctx = setup(success);
    assert.equal(await signIn(ctx, destination), '/');
  }
});
test('rejected refresh tokens remove the expired session', async () => {
  let rejectRefresh = false;
  const ctx = setup((url, options) => rejectRefresh && new URLSearchParams(options.body).get('grant_type') === 'refresh_token'
    ? json({ error: 'invalid_grant' }, 400) : success(url));
  await signIn(ctx);
  ctx.advance(16 * 60_000);
  rejectRefresh = true;
  assert.equal(await ctx.auth.restore(), false);
  const count = ctx.calls.length;
  assert.equal(await ctx.auth.restore(), false);
  assert.equal(ctx.calls.length, count);
});

test('logout invalidates sign-in transactions that have not completed', async () => {
  const ctx = setup(success);
  const url = new URL(await ctx.auth.beginSignIn('/'));
  ctx.auth.signOut();
  await assert.rejects(ctx.auth.completeSignIn(`${config.redirectUri}?code=x&state=${url.searchParams.get('state')}`), /sign-in request/i);
  assert.equal(ctx.calls.length, 0);
});

test('logout in another tab cannot be undone by an in-flight callback', async () => {
  let finishMember;
  const ctx = setup((url) => String(url).endsWith('/oauth/token') ? success(url)
    : new Promise(resolve => { finishMember = () => resolve(json({ data: { currentMember: { id: 'member-123' } } })); }));
  const url = new URL(await ctx.auth.beginSignIn('/'));
  const completion = ctx.auth.completeSignIn(`${config.redirectUri}?code=x&state=${url.searchParams.get('state')}`);
  while (!finishMember) await new Promise(resolve => setImmediate(resolve));
  const otherTab = createMemberfulAuth({ ...config, storage: ctx.storage, crypto: webcrypto, fetch: success });
  otherTab.signOut();
  finishMember();
  await assert.rejects(completion, /no longer active/i);
  assert.equal(await ctx.auth.restore(), false);
});
