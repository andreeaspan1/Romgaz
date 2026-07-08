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

  // tools/importer/import-news-events-hub.js
  var import_news_events_hub_exports = {};
  __export(import_news_events_hub_exports, {
    default: () => import_news_events_hub_default
  });

  // tools/importer/parsers/cards-press.js
  function parse(element, { document }) {
    const items = Array.from(element.querySelectorAll("div.item, li.view-list-item"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".item-image img, .event-image img, img");
      const bodyCell = [];
      const eventDate = item.querySelector(".event-date");
      const postCreated = item.querySelector(".post-created");
      if (eventDate) {
        const parts = Array.from(eventDate.querySelectorAll("span")).map((s) => s.textContent.trim()).filter((t) => t);
        if (parts.length) {
          const dateP = document.createElement("p");
          dateP.textContent = parts.join(" ");
          bodyCell.push(dateP);
        }
      } else if (postCreated && postCreated.textContent.trim()) {
        const dateP = document.createElement("p");
        dateP.textContent = postCreated.textContent.trim();
        bodyCell.push(dateP);
      }
      const titleLink = item.querySelector("h3.post-title a, .post-title a, .event-content h3 a");
      const fileLink = item.querySelector(".post-file a");
      if (titleLink) {
        const heading = document.createElement("h3");
        const a = document.createElement("a");
        a.setAttribute("href", titleLink.getAttribute("href"));
        a.textContent = titleLink.textContent.trim();
        heading.append(a);
        bodyCell.push(heading);
      } else if (fileLink) {
        const heading = document.createElement("h3");
        const a = document.createElement("a");
        a.setAttribute("href", fileLink.getAttribute("href"));
        a.textContent = fileLink.textContent.trim();
        heading.append(a);
        bodyCell.push(heading);
      }
      const description = item.querySelector(".event-description");
      if (description && description.textContent.trim()) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        bodyCell.push(descP);
      }
      if (fileLink && titleLink) {
        const ctaP = document.createElement("p");
        const ctaA = document.createElement("a");
        ctaA.setAttribute("href", fileLink.getAttribute("href"));
        const ctaText = (fileLink.getAttribute("title") || fileLink.textContent || "").trim();
        ctaA.textContent = ctaText || "Download PDF";
        ctaP.append(ctaA);
        bodyCell.push(ctaP);
      }
      if (bodyCell.length === 0 && !img) return;
      cells.push([img || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-press", cells });
    element.replaceWith(block);
  }

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
        "#footer"
      ]);
      WebImporter.DOMUtils.remove(element, ["script", "noscript", "iframe", "link", "style"]);
    }
  }

  // tools/importer/import-news-events-hub.js
  var parsers = {
    "cards-press": parse
  };
  var PAGE_TEMPLATE = {
    name: "news-events-hub",
    description: "News and events listing page - dynamic Drupal listing of dated documents (timestamp + linked PDF title), with a year filter dropdown.",
    urls: [
      "https://romgaz.ro/noutati-si-evenimente"
    ],
    blocks: [
      {
        name: "cards-press",
        instances: [
          "#page-main-content .view-content-wrap",
          "#page-main-content .item-list"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "News and events listing",
        selector: ["#page-main-content"],
        style: "news-events",
        blocks: ["cards-press"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_news_events_hub_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_news_events_hub_exports);
})();
