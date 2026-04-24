/**
 * app.js — PDFDecor main bootstrap
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize auth & update nav
  updateNavAuth();

  // Handle initial URL hash route
  handleInitialRoute();

  // Keyboard: ESC closes interstitial modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('interstitial-modal');
      if (modal && !modal.classList.contains('hidden')) {
        closeInterstitialAndDownload();
      }
    }
  });

  // Handle browser back/forward navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ROUTES[hash]) {
      ROUTES[hash]();
      _currentRoute = hash;
    }
  });

  console.log('[PDFDecor] App initialized ✓ — Free edition, all templates unlocked');
});
