import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = {
  jan: 'Jan',
  ian: 'Jan',
  feb: 'Feb',
  mar: 'Mar',
  apr: 'Apr',
  may: 'May',
  mai: 'May',
  jun: 'Jun',
  iun: 'Jun',
  jul: 'Jul',
  iul: 'Jul',
  aug: 'Aug',
  sep: 'Sep',
  oct: 'Oct',
  nov: 'Nov',
  noi: 'Nov',
  dec: 'Dec',
};

/**
 * Split a date string like "15 May 2026" into a day number and a "MON YYYY" label.
 */
function parseDate(text) {
  const t = (text || '').trim();
  const m = t.match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);
  if (!m) return null;
  const [, day, monthRaw, year] = m;
  const key = monthRaw.slice(0, 3).toLowerCase();
  const month = (MONTHS[key] || monthRaw.slice(0, 3)).toUpperCase();
  return { day, label: `${month} ${year}` };
}

const ISO_TS = /^\d{4}-\d{2}-\d{2}/;

/**
 * Fix a Drupal file link so it resolves on the migrated site and opens safely.
 */
function fixPdfLink(link) {
  const href = link.getAttribute('href');
  if (href && href.startsWith('/')) link.href = `https://romgaz.ro${href}`;
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener');
}

/**
 * Builds the static "Secretariat / Investor relations" contact sidebar shown
 * alongside the news/events listing on the source site.
 */
function buildContactSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'cards-press-sidebar';
  aside.innerHTML = `
    <div class="cards-press-sidebar-group">
      <h3>Secretariat Şi Comunicare</h3>
      <p>551130, Mediaş, P-ţa C.I. Motaş, nr. 4</p>
      <p>Tel: +4-0374-401020</p>
      <p>Fax: +4-0269-846901</p>
      <p><a href="mailto:secretariat@romgaz.ro">secretariat@romgaz.ro</a></p>
      <p><a href="mailto:comunicare@romgaz.ro">comunicare@romgaz.ro</a></p>
    </div>
    <div class="cards-press-sidebar-group">
      <h3>Relaţia cu investitorii / Dividende şi Piaţa de Capital</h3>
      <p>+40 374 406 929 (între orele 8 – 16)</p>
      <p>+40 374 401819 (între orele 8 – 16)</p>
      <p><a href="mailto:investor.relations@romgaz.ro">investor.relations@romgaz.ro</a></p>
    </div>
    <div class="cards-press-sidebar-group">
      <h3>Furnizare gaze naturale în regim de ultimă instanță</h3>
      <p><a href="mailto:fui@romgaz.ro">E-mail: fui@romgaz.ro</a></p>
      <p>+40 0374 402 540 (între orele 8 – 16)</p>
      <p>+40 0374 402 541 (între orele 8 – 16)</p>
      <p>+40 0748 700 004 (între orele 8 – 16)</p>
      <p>Fax: 0269846901</p>
    </div>
    <a class="cards-press-sidebar-btn" href="https://romgaz.ro/contact" target="_blank" rel="noopener">Contactati-ne</a>`;
  return aside;
}

/**
 * News/events "documents list" variant: each row is a timestamp + a
 * PDF-linked title, rendered as a compact single line.
 */
function decorateDocsList(block, rows) {
  block.classList.add('cards-press-docs');
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const bodyCell = [...row.children].find((d) => d.querySelector('h3'));
    if (!bodyCell) return;
    const dateP = bodyCell.querySelector(':scope > p');
    const link = bodyCell.querySelector('h3 a[href]');
    if (!link) return;

    const li = document.createElement('li');

    if (dateP) {
      const date = document.createElement('span');
      date.className = 'cards-press-doc-date';
      date.textContent = dateP.textContent.trim();
      li.append(date);
    }

    fixPdfLink(link);
    link.classList.add('cards-press-doc-link');
    li.append(link);

    ul.append(li);
  });

  const layout = document.createElement('div');
  layout.className = 'cards-press-docs-layout';
  const listWrap = document.createElement('div');
  listWrap.className = 'cards-press-docs-list';
  listWrap.append(ul);
  layout.append(listWrap, buildContactSidebar());

  block.textContent = '';
  block.append(layout);
}

const PAGE_SIZE = 8;

/**
 * Client-side pagination for the press-release cards. Shows PAGE_SIZE cards
 * per page and renders a numbered pager (matching the source Drupal listing).
 * Operates on the cards the year-filter leaves eligible: a card is eligible
 * unless it carries the `data-year-hidden` flag. Re-runnable via the
 * `cards-press:repaginate` event so the year filter can reset to page 1.
 */
function paginate(block, ul) {
  const pager = document.createElement('nav');
  pager.className = 'cards-press-pager';
  pager.setAttribute('aria-label', 'Paginare');
  ul.after(pager);

  let current = 1;

  const render = () => {
    const eligible = [...ul.children].filter((li) => li.dataset.yearHidden !== 'true');
    const pages = Math.max(1, Math.ceil(eligible.length / PAGE_SIZE));
    if (current > pages) current = pages;

    // show only the current page's slice of the eligible cards
    [...ul.children].forEach((li) => { li.style.display = 'none'; });
    const start = (current - 1) * PAGE_SIZE;
    eligible.slice(start, start + PAGE_SIZE).forEach((li) => { li.style.display = ''; });

    // build the numbered pager (hidden when everything fits on one page)
    pager.textContent = '';
    if (pages <= 1) return;

    const addBtn = (label, page, opts = {}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cards-press-page';
      if (opts.active) btn.setAttribute('aria-current', 'page');
      if (opts.disabled) btn.disabled = true;
      btn.textContent = label;
      if (!opts.disabled && !opts.active) {
        btn.addEventListener('click', () => {
          current = page;
          render();
          block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      pager.append(btn);
    };

    // Sliding window of up to 9 consecutive page numbers (matches the source),
    // then an ellipsis if more pages remain, then the next/last controls.
    const WINDOW = 9;
    const winEnd = Math.min(pages, Math.max(1, current - Math.floor(WINDOW / 2)) + WINDOW - 1);
    const winStart = Math.max(1, winEnd - WINDOW + 1);

    for (let n = winStart; n <= winEnd; n += 1) {
      addBtn(String(n), n, { active: n === current });
    }

    if (winEnd < pages) {
      const gap = document.createElement('span');
      gap.className = 'cards-press-page-gap';
      gap.textContent = '…';
      pager.append(gap);
    }

    addBtn('Înainte ›', current + 1, { disabled: current >= pages });
    addBtn('Ultima »', pages, { disabled: current >= pages });
  };

  // reset to page 1 and re-render when the year filter changes the set
  block.addEventListener('cards-press:repaginate', () => { current = 1; render(); });

  render();
}

export default function decorate(block) {
  // Detect the news/events variant: rows whose first paragraph is an ISO
  // timestamp (e.g. "2026-07-06 - 14:23"). Render those as a compact list.
  const rows = [...block.children];
  const isDocsList = rows.length > 0 && rows.every((row) => {
    const bodyCell = [...row.children].find((d) => d.querySelector('h3'));
    const firstP = bodyCell && bodyCell.querySelector(':scope > p');
    return firstP && ISO_TS.test(firstP.textContent.trim());
  });
  if (isDocsList) {
    decorateDocsList(block, rows);
    return;
  }

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    const cells = [...row.children];
    // image cell contains a picture or img; body cell is the other one (has a heading)
    const imageCell = cells.find((d) => d.querySelector('picture, img') && !d.querySelector('h3'));
    const bodyCell = cells.find((d) => d !== imageCell && d.querySelector('h3'))
      || cells.find((d) => d !== imageCell);

    // image — use the item's own image, falling back to the generic news icon
    // when the source image is missing or broken (e.g. unpublished pictograms).
    const img = imageCell && imageCell.querySelector('img');
    const src = img && img.getAttribute('src');
    const valid = src && !src.startsWith('about:') && src.trim() !== '';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'cards-press-card-image';
    const useFallback = () => {
      const fallback = document.createElement('img');
      fallback.src = '/img/cards-press-icon.jpg';
      fallback.alt = '';
      fallback.loading = 'lazy';
      imageWrap.textContent = '';
      imageWrap.append(fallback);
    };
    if (valid) {
      let origin = '';
      try { origin = new URL(img.src, window.location.href).origin; } catch { /* noop */ }
      if (origin === window.location.origin) {
        // same-origin: safe to use EDS image optimization
        imageWrap.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
      } else {
        // external image (e.g. romgaz.ro photos): plain <img>, EDS optimizer
        // params don't apply cross-origin. Swap to the icon if it fails to load.
        const ext = document.createElement('img');
        ext.src = img.src;
        ext.alt = img.alt || '';
        ext.loading = 'lazy';
        ext.addEventListener('error', useFallback, { once: true });
        imageWrap.append(ext);
      }
    } else {
      useFallback();
    }
    li.append(imageWrap);

    // date badge — first paragraph in the body holds the date
    if (bodyCell) {
      const firstP = bodyCell.querySelector(':scope > p');
      const parsed = firstP ? parseDate(firstP.textContent) : null;
      if (parsed) {
        firstP.remove();
        const date = document.createElement('div');
        date.className = 'cards-press-card-date';
        date.innerHTML = `<span class="cards-press-day">${parsed.day}</span><span class="cards-press-month">${parsed.label}</span>`;
        li.append(date);
      }

      const body = document.createElement('div');
      body.className = 'cards-press-card-body';
      while (bodyCell.firstElementChild) body.append(bodyCell.firstElementChild);
      li.append(body);

      // PDF link (last paragraph): label it with the article title and fix its
      // target. Relative Drupal file paths (/sites/default/files/...) 404 on the
      // migrated site, so resolve them against the original romgaz.ro origin.
      const title = body.querySelector('h3');
      const pdfLink = body.querySelector('p:last-child a[href]');
      if (pdfLink) {
        if (title) pdfLink.textContent = `Comunicat de presă - ${title.textContent.trim()}`;
        fixPdfLink(pdfLink);
      }
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
  paginate(block, ul);
}
