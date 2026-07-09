/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: romgaz site-wide cleanup.
 *
 * Removes all non-authorable site chrome so the import contains only the
 * page-level content authors would create/edit. On these Drupal listing pages
 * the authorable content lives inside `#page-main-content`; everything else is
 * global shell (header, top bar, breadcrumbs, contact sidebar, overlay, footer)
 * that is being migrated in dedicated workflows and MUST NOT appear here.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - <header id="header" class="header-default">        (line 8; contains .topbar)
 *   - <div class="breadcrumbs">                          (line 491)
 *   - <div id="block-gavias-facdori-breadcrumbs" ...>    (line 495)
 *   - <div ... class="... sidebar sidebar-right ...">    (line 10187; contact info)
 *   - <div id="gva-overlay"> / <footer id="footer">      (present in captured DOM)
 *   - content to KEEP: <div id="page-main-content" ...>  (line 555)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Off-canvas overlay can wrap/obscure content; remove before block parsing.
    // Found in captured DOM: <div id="gva-overlay">
    WebImporter.DOMUtils.remove(element, ['#gva-overlay']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome — header/top bar, breadcrumbs, right sidebar
    // (contact info), and footer. Header and footer are migrated separately.
    WebImporter.DOMUtils.remove(element, [
      '#header',
      '.breadcrumbs',
      '#block-gavias-facdori-breadcrumbs',
      '.sidebar.sidebar-right',
      '.contact-link',
      '.gva-quick-side',
      '#block-gavias-facdori-about',
      '.visually-hidden',
      '#footer',
    ]);

    // Safe leftover/non-content element removal.
    WebImporter.DOMUtils.remove(element, ['script', 'noscript', 'iframe', 'link', 'style']);
  }
}
