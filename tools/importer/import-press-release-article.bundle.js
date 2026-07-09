/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-press-release-article.js
  var import_press_release_article_exports = {};
  __export(import_press_release_article_exports, {
    default: () => import_press_release_article_default
  });

  // tools/importer/transformers/romgaz-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#gva-overlay"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#header",
        ".breadcrumbs",
        "#block-gavias-facdori-breadcrumbs",
        ".sidebar.sidebar-right",
        ".contact-link",
        ".gva-quick-side",
        "#block-gavias-facdori-about",
        ".visually-hidden",
        "#footer"
      ]);
      WebImporter.DOMUtils.remove(element, ["script", "noscript", "iframe", "link", "style"]);
    }
  }

  // tools/importer/import-press-release-article.js
  var PAGE_TEMPLATE = {
    name: "press-release-article",
    description: "Press-release detail/article page - H1 title, body paragraphs, and a PDF link.",
    urls: [
      "https://romgaz.ro/romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-31",
      "https://romgaz.ro/progres-cadrul-neptun-deep-incep-lucrarile-de-instalare-conductei-de-gaze-marea-neagra",
      "https://romgaz.ro/grupul-romgaz-publicat-raportul-anual-consolidat-preliminar-pentru-anul-2025",
      "https://romgaz.ro/romgaz-face-precizari-fata-de-informarea-de-presa-azomures",
      "https://romgaz.ro/romgaz-listeaza-cea-de-doua-emisiune-de-obligatiuni-la-bursa-de-valori-bucuresti-valoare-de-500",
      "https://romgaz.ro/romgaz-continua-angajamentul-ferm-de-investitii-de-explorare-perimetrul-neptun-deep-din-marea",
      "https://romgaz.ro/romgaz-publicat-raportul-trimestrial-privind-activitatea-economico-financiara-grupului-romgaz-la-30",
      "https://romgaz.ro/romgaz-incheie-un-parteneriat-strategic-cu-weatherford-pentru-digitalizarea-operatiunilor-de"
    ],
    blocks: []
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_press_release_article_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name }
      }];
    }
  };
  return __toCommonJS(import_press_release_article_exports);
})();
