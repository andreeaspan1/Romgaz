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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/import-press-releases-listing.js
  var import_press_releases_listing_exports = {};
  __export(import_press_releases_listing_exports, {
    default: () => import_press_releases_listing_default
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
        ".contact-link",
        ".gva-quick-side",
        "#block-gavias-facdori-about",
        ".visually-hidden",
        "#footer"
      ]);
      WebImporter.DOMUtils.remove(element, ["script", "noscript", "iframe", "link", "style"]);
    }
  }

  // tools/importer/import-press-releases-listing.js
  var parsers = {
    "cards-press": parse
  };
  var PAGE_TEMPLATE = {
    name: "press-releases-listing",
    description: "Press releases listing page - chronological list of dated news items with title, summary, and PDF link. Includes a year filter dropdown and pagination.",
    urls: [
      "https://romgaz.ro/comunicate-de-presa"
    ],
    blocks: [
      {
        name: "cards-press",
        instances: [
          "#page-main-content .view-content-wrap"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Press releases listing",
        selector: ["#page-main-content"],
        style: "press-releases",
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
  function mergePaginatedItems(document) {
    return __async(this, null, function* () {
      const container = document.querySelector("#page-main-content .view-content-wrap");
      if (!container) return;
      let lastPage = 0;
      document.querySelectorAll('a[href*="page="]').forEach((a) => {
        const m = (a.getAttribute("href") || "").match(/[?&]page=(\d+)/);
        if (m) lastPage = Math.max(lastPage, parseInt(m[1], 10));
      });
      if (lastPage === 0) return;
      const base = `${window.location.origin}${window.location.pathname}`;
      for (let p = 1; p <= lastPage; p += 1) {
        try {
          const res = yield fetch(`${base}?page=${p}`, { credentials: "same-origin" });
          const text = yield res.text();
          const doc = new DOMParser().parseFromString(text, "text/html");
          const items = doc.querySelectorAll("#page-main-content .view-content-wrap > .item");
          items.forEach((item) => container.appendChild(document.importNode(item, true)));
        } catch (e) {
          console.error(`Failed to fetch listing page ${p}:`, e);
        }
      }
    });
  }
  var import_press_releases_listing_default = {
    transform: (payload) => __async(void 0, null, function* () {
      const { document, url, html, params } = payload;
      const main = document.body;
      yield mergePaginatedItems(document);
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
    })
  };
  return __toCommonJS(import_press_releases_listing_exports);
})();
