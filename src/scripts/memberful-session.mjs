import config from '../data/memberful.json';
import { createMemberfulAuth } from '../lib/memberful-auth.mjs';

function renderLinks(signedIn) {
  document.querySelectorAll('[data-member-visibility]').forEach((element) => {
    element.hidden = element.dataset.memberVisibility === 'in' ? !signedIn : signedIn;
  });
}

function showError(error) {
  const heading = document.querySelector('[data-member-heading]');
  const message = document.querySelector('[data-member-message]');
  const retry = document.querySelector('[data-member-retry]');
  if (heading) heading.textContent = 'Let’s try that again.';
  if (message) message.textContent = error instanceof Error ? error.message : 'We couldn’t complete sign-in. Please try again.';
  if (retry) retry.hidden = false;
}

export async function initializeMemberfulSession() {
  const flow = document.querySelector('[data-member-flow]')?.dataset.memberFlow;
  let auth;
  try {
    auth = createMemberfulAuth({ ...config, storage: window.localStorage,
      crypto: window.crypto, fetch: window.fetch.bind(window) });
  } catch {
    renderLinks(false);
    if (flow) showError(new Error('Allow website storage in your browser to sign in, then try again.'));
    return;
  }
  let checking = null;
  const update = () => {
    if (checking) return checking;
    checking = auth.restore().then(renderLinks).catch(() => renderLinks(false)).finally(() => { checking = null; });
    return checking;
  };
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key === auth.sessionKey || event.key === auth.logoutKey) {
      auth.invalidate();
      renderLinks(false);
      checking = null;
      if (!flow) void update();
    }
  });
  if (flow) {
    try {
      if (flow === 'sign-in') {
        const destination = new URL(window.location.href).searchParams.get('returnTo') || '/';
        window.location.replace(await auth.beginSignIn(destination));
      } else if (flow === 'callback') {
        const callbackUrl = window.location.href;
        // Strip the one-time authorization code before any following navigation.
        window.history.replaceState(null, '', window.location.pathname);
        window.location.replace(await auth.completeSignIn(callbackUrl));
      } else if (flow === 'sign-out') {
        renderLinks(false);
        window.location.replace(auth.signOut());
      }
    } catch (error) {
      showError(error instanceof TypeError ? new Error('We couldn’t reach Memberful. Please try again.') : error);
    }
    return;
  }
  await update();
  window.addEventListener('focus', () => { void update(); });
  window.addEventListener('pageshow', () => { void update(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void update(); });
  window.setInterval(() => { if (!document.hidden) void update(); }, 60_000);
}
