/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsPressParser from './parsers/cards-press.js';

// TRANSFORMER IMPORTS
import romgazCleanupTransformer from './transformers/romgaz-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'cards-press': cardsPressParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'press-releases-listing',
  description: 'Press releases listing page - chronological list of dated news items with title, summary, and PDF link. Includes a year filter dropdown and pagination.',
  urls: [
    'https://romgaz.ro/comunicate-de-presa',
  ],
  blocks: [
    {
      name: 'cards-press',
      instances: [
        '#page-main-content .view-content-wrap',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Press releases listing',
      selector: ['#page-main-content'],
      style: 'press-releases',
      blocks: ['cards-press'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  romgazCleanupTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// The listing is paginated (?page=0..N). Fetch every subsequent page and merge
// their items into the base page's .view-content-wrap so the single imported
// document contains ALL press releases, matching the original site.
async function mergePaginatedItems(document) {
  const container = document.querySelector('#page-main-content .view-content-wrap');
  if (!container) return;

  // Discover the last page number from the pager (?page=N links).
  let lastPage = 0;
  document.querySelectorAll('a[href*="page="]').forEach((a) => {
    const m = (a.getAttribute('href') || '').match(/[?&]page=(\d+)/);
    if (m) lastPage = Math.max(lastPage, parseInt(m[1], 10));
  });
  if (lastPage === 0) return;

  const base = `${window.location.origin}${window.location.pathname}`;
  for (let p = 1; p <= lastPage; p += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(`${base}?page=${p}`, { credentials: 'same-origin' });
      // eslint-disable-next-line no-await-in-loop
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const items = doc.querySelectorAll('#page-main-content .view-content-wrap > .item');
      items.forEach((item) => container.appendChild(document.importNode(item, true)));
    } catch (e) {
      console.error(`Failed to fetch listing page ${p}:`, e);
    }
  }
}

export default {
  transform: async (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 0. Merge all paginated listing pages into the base page.
    await mergePaginatedItems(document);

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
