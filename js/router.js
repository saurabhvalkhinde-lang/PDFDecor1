/**
 * router.js — Client-side SPA router (simplified, no pricing/admin)
 */

const ROUTES = {
  'home':                  renderHomePage,
  'invoice':               () => renderEditorPage('invoice'),
  'receipt':               () => renderEditorPage('receipt'),
  'bill':                  () => renderEditorPage('bill'),
  'certificate':           () => renderEditorPage('certificate'),
  'quotation':             () => renderEditorPage('quotation'),
  'estimate':              () => renderEditorPage('estimate'),
  'offer-letter':          () => renderEditorPage('offer-letter'),
  'appointment-letter':    () => renderEditorPage('appointment-letter'),
  'id-card':               () => renderEditorPage('id-card'),
  'event-pass':            () => renderEditorPage('event-pass'),
  'login':                 renderLoginPage,
  'dashboard':             renderDashboardPage,
  'history':               renderHistoryPage,
  'profile':               renderProfilePage,
  'bulk':                  renderBulkPage,
  'about':                 renderAboutPage,
  'help':                  renderHelpPage,
  'privacy':               renderPrivacyPage,
  'terms':                 renderTermsPage,
};

let _currentRoute = 'home';

function navigate(route) {
  if (!ROUTES[route]) route = 'home';
  _currentRoute = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mobile-menu')?.classList.add('hidden');
  ROUTES[route]();
  history.pushState(null, '', route !== 'home' ? `#${route}` : window.location.pathname);
  // GA4: track page navigation
  try { trackEvent('page_view', { page: route }); } catch(e) {}
}

window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1);
  const route = hash && ROUTES[hash] ? hash : 'home';
  ROUTES[route]();
  _currentRoute = route;
});

function handleInitialRoute() {
  const hash = window.location.hash.slice(1);
  if (hash && ROUTES[hash]) {
    _currentRoute = hash;
    ROUTES[hash]();
  } else {
    renderHomePage();
  }
}
