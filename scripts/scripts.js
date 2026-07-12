import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
} from './aem.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Turns the Drupal "Selectaţi anul" year-filter paragraphs into a year-filter block.
 * @param {Element} main The container element
 */
function buildYearFilterAutoBlock(main) {
  const label = [...main.querySelectorAll('p')].find(
    (p) => /^Selecta[țţ]i anul/i.test(p.textContent.trim()),
  );
  if (!label) return;

  // the "Aplica" (apply) paragraph immediately follows the label
  const next = label.nextElementSibling;
  const apply = next && next.tagName === 'P' && /^Aplica$/i.test(next.textContent.trim())
    ? next : null;

  const block = buildBlock('year-filter', { elems: [] });
  label.replaceWith(block);
  if (apply) apply.remove();
}

// Correct absolute PDF URL for each press-release detail page. The published
// article content stores a slugified (broken) file path, so we can't recover
// the original filename from the href — map it by page slug instead.
const DETAIL_PDF_URLS = {
  'grupul-romgaz-publicat-raportul-anual-consolidat-preliminar-pentru-anul-2025': 'https://romgaz.ro/sites/default/files/2026-02/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2027%20februarie%202026.pdf',
  'progres-cadrul-neptun-deep-incep-lucrarile-de-instalare-conductei-de-gaze-marea-neagra': 'https://romgaz.ro/sites/default/files/2026-05/Progres%20in%20cadrul%20Neptun%20Deep%20-%20Incep%20lucrarile%20de%20instalare%20a%20conductei%20de%20gaze%20in%20Marea%20Neagra.pdf',
  'romgaz-continua-angajamentul-ferm-de-investitii-de-explorare-perimetrul-neptun-deep-din-marea': 'https://romgaz.ro/sites/default/files/2025-12/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2010%20decembrie%202025.pdf',
  'romgaz-face-precizari-fata-de-informarea-de-presa-azomures': 'https://romgaz.ro/sites/default/files/2026-01/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2013%20ianuarie%202026.pdf',
  'romgaz-incheie-un-parteneriat-strategic-cu-weatherford-pentru-digitalizarea-operatiunilor-de': 'https://romgaz.ro/sites/default/files/2025-09/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2022%20septembrie%202025.pdf',
  'romgaz-listeaza-cea-de-doua-emisiune-de-obligatiuni-la-bursa-de-valori-bucuresti-valoare-de-500': 'https://romgaz.ro/sites/default/files/2025-12/Comunicat%20de%20presa_ROMGAZ%20listeaza%20a%20doua%20emisiune%20de%20obligatiuni%20la%20BVB_22.12.2025_22.12.2025.pdf',
  'romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-30': 'https://romgaz.ro/sites/default/files/2025-11/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2014%20noiembrie%202025.pdf',
  'romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-31': 'https://romgaz.ro/sites/default/files/2026-05/Comunicat%20de%20pres%C4%83%20ROMGAZ%20-%2015%20mai%202026_0.pdf',
};

/**
 * Removes leftover Drupal listing chrome that leaked into the press listing
 * body: the pagination list and the trailing "Despre noi" / "Legaturi utile"
 * block (which duplicates the site footer).
 * @param {Element} main The container element
 */
function cleanupPressListing(main) {
  // "skip to main content" link Drupal injects at the top. On the published
  // site DA rewrites its href (from #main-content to /), so match by text.
  main.querySelectorAll('a').forEach((a) => {
    if (/^mergi la con[țţ]inutul principal$/i.test(a.textContent.trim())) {
      (a.closest('p') || a).remove();
    }
  });

  // Relative Drupal file links (/sites/default/files/...) 404 on the migrated
  // site. Point them at the original romgaz.ro origin and open in a new tab.
  // Applies to article detail pages as well as the listing cards.
  main.querySelectorAll('a[href^="/sites/default/files/"]').forEach((a) => {
    a.href = `https://romgaz.ro${a.getAttribute('href')}`;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  // On press-release detail pages the published PDF href is slugified/broken;
  // replace it with the known-good absolute URL for this page.
  const slug = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop();
  const pdfUrl = DETAIL_PDF_URLS[slug];
  if (pdfUrl && !main.querySelector('.cards-press')) {
    const link = main.querySelector('a[href*="/sites/default/files/"], a[href*="/files/"]');
    if (link) {
      link.href = pdfUrl;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    }
  }

  if (!main.querySelector('.cards-press')) return;

  // pagination: a <ul> of "Pagina N" / "Ultima" links. DA rewrites the hrefs
  // (from ?page= to /), so detect the list by its link text instead.
  main.querySelectorAll('ul').forEach((ul) => {
    const links = [...ul.querySelectorAll('a')];
    const isPager = links.length > 0
      && links.every((a) => /^(pagina\b|…|\.\.\.|ultima|inainte|înainte|prima)/i.test(a.textContent.trim()));
    if (isPager) ul.remove();
  });

  // trailing about/links duplication: remove each matching heading and every
  // following sibling (paragraph, list, further headings) up to the end.
  main.querySelectorAll('h2').forEach((h2) => {
    if (/^(Despre noi|Legaturi utile)$/i.test(h2.textContent.trim())) {
      let node = h2.nextElementSibling;
      while (node && !(node.tagName === 'H2'
        && /^(Despre noi|Legaturi utile)$/i.test(node.textContent.trim()))) {
        const toRemove = node;
        node = node.nextElementSibling;
        toRemove.remove();
      }
      h2.remove();
    }
  });
}

/**
 * Wraps a press-release detail page (H1 + summary + PDF link) into a
 * press-article block so it gets the two-column layout with contact sidebar.
 * @param {Element} main The container element
 */
function buildPressArticleAutoBlock(main) {
  const slug = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop();
  if (!DETAIL_PDF_URLS[slug] || main.querySelector('.cards-press')) return;

  const contentDiv = [...main.children].find((d) => d.querySelector('h1'));
  if (!contentDiv) return;

  const elems = [...contentDiv.children];
  const block = buildBlock('press-article', [[{ elems }]]);
  contentDiv.append(block);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    cleanupPressListing(main);
    buildYearFilterAutoBlock(main);
    buildPressArticleAutoBlock(main);
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
