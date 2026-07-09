/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import romgazCleanupTransformer from './transformers/romgaz-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'press-release-article',
  description: 'Press-release detail/article page - H1 title, body paragraphs, and a PDF link.',
  urls: [
    'https://romgaz.ro/romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-31',
    'https://romgaz.ro/progres-cadrul-neptun-deep-incep-lucrarile-de-instalare-conductei-de-gaze-marea-neagra',
    'https://romgaz.ro/grupul-romgaz-publicat-raportul-anual-consolidat-preliminar-pentru-anul-2025',
    'https://romgaz.ro/romgaz-face-precizari-fata-de-informarea-de-presa-azomures',
    'https://romgaz.ro/romgaz-listeaza-cea-de-doua-emisiune-de-obligatiuni-la-bursa-de-valori-bucuresti-valoare-de-500',
    'https://romgaz.ro/romgaz-continua-angajamentul-ferm-de-investitii-de-explorare-perimetrul-neptun-deep-din-marea',
    'https://romgaz.ro/romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-30',
    'https://romgaz.ro/romgaz-incheie-un-parteneriat-strategic-cu-weatherford-pentru-digitalizarea-operatiunilor-de',
  ],
  blocks: [],
};

const transformers = [romgazCleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. afterTransform (strip header/footer/breadcrumb/sidebar/contact)
    executeTransformers('afterTransform', main, payload);

    // 3. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 4. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name },
    }];
  },
};
