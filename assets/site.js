'use strict';
// Reattach photo fallback after the local editor restores the page.
function initializeSiteContent() {
  const portrait = document.querySelector('#portrait');
  if (portrait && !portrait.getAttribute('src').endsWith('portrait-placeholder.svg')) {
    portrait.alt = 'Portrait of Lin He';
    const caption = document.querySelector('.portrait figcaption span');
    if (caption && caption.textContent.includes('PHOTO FORTHCOMING')) caption.textContent = '';
    portrait.addEventListener('error', () => {
      portrait.src = 'assets/images/portrait-placeholder.svg';
      portrait.alt = 'Personal photograph to be added';
      if (caption) caption.textContent = 'PERSONAL PHOTO FORTHCOMING';
    }, { once: true });
  }
}
window.addEventListener('site-content-restored', initializeSiteContent);
initializeSiteContent();
