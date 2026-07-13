// Social icon SVGs keyed by the link text authored in nav.plain.html.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8.6v-6.97H10.3V13h2.3v-1.97c0-2.28 1.36-3.54 3.44-3.54 1 0 2.04.18 2.04.18v2.24h-1.15c-1.13 0-1.48.7-1.48 1.42V13h2.52l-.4 2.03h-2.12V22H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 4.9c-.8.36-1.66.6-2.56.7a4.48 4.48 0 0 0 1.96-2.47c-.86.51-1.82.88-2.83 1.08a4.46 4.46 0 0 0-7.6 4.07A12.66 12.66 0 0 1 2.79 3.6a4.46 4.46 0 0 0 1.38 5.95c-.72-.02-1.4-.22-2-.55v.06a4.46 4.46 0 0 0 3.58 4.37c-.65.18-1.34.2-2 .08a4.47 4.47 0 0 0 4.17 3.1A8.95 8.95 0 0 1 1 20.29a12.62 12.62 0 0 0 6.84 2c8.2 0 12.7-6.8 12.7-12.7 0-.2 0-.39-.02-.58A9 9 0 0 0 23 4.9Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 12s0-3.4-.4-5a2.9 2.9 0 0 0-2-2C18.7 4.5 12 4.5 12 4.5s-6.7 0-8.6.5a2.9 2.9 0 0 0-2 2C1 8.6 1 12 1 12s0 3.4.4 5a2.9 2.9 0 0 0 2 2c1.9.5 8.6.5 8.6.5s6.7 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.6.4-5 .4-5Zm-13 3.2V8.8l5.7 3.2-5.7 3.2Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 12s0 2.5.1 3.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.7s0-2.5-.1-3.7c-.1-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.2-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 3H3.6C3 3 2.5 3.5 2.5 4.1v15.8c0 .6.5 1.1 1.1 1.1h16.8c.6 0 1.1-.5 1.1-1.1V4.1c0-.6-.5-1.1-1.1-1.1ZM8.3 18.3H5.6V9.7h2.7v8.6ZM7 8.6a1.6 1.6 0 1 1 0-3.1 1.6 1.6 0 0 1 0 3.1Zm11.4 9.7h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H9.9V9.7h2.6v1.2h.1c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7Z"/></svg>',
};

const isDesktop = window.matchMedia('(min-width: 900px)');

// Known page slugs → display titles (with correct Romanian diacritics).
const PAGE_TITLES = {
  'comunicate-de-presa': 'Comunicate de presă',
  'noutati-si-evenimente': 'Noutăţi şi Evenimente',
};

/**
 * Resolve the current page's display title from metadata or the URL slug,
 * and write it into the banner title element. Empty on the homepage.
 */
function setBannerTitle(el) {
  const slug = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop();

  // Homepage: show the ROMGAZ wordmark on the banner instead of a page title.
  if (!slug || slug === 'index' || window.location.pathname === '/') {
    el.classList.add('nav-wave-logo');
    el.innerHTML = 'ROM<strong>GAZ</strong>';
    return;
  }

  const metaTitle = (document.title || '').split('|')[0].trim();
  let title = PAGE_TITLES[slug] || metaTitle;
  if (!title) {
    // fall back to a title-cased version of the slug
    title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  el.textContent = title;
}

async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tpl = document.createElement('div');
  tpl.innerHTML = html;
  return tpl;
}

function buildTopbar(sourceSection) {
  const topbar = document.createElement('div');
  topbar.className = 'nav-topbar';

  const lists = sourceSection.querySelectorAll('ul');
  // First ul = languages, second ul = social
  const langUl = lists[0];
  const socialUl = lists[1];

  if (langUl) {
    const langs = document.createElement('ul');
    langs.className = 'nav-languages';
    langUl.querySelectorAll('li').forEach((li) => langs.append(li.cloneNode(true)));
    topbar.append(langs);
  }

  if (socialUl) {
    const social = document.createElement('ul');
    social.className = 'nav-social';
    socialUl.querySelectorAll('li a').forEach((a) => {
      const key = a.textContent.trim().toLowerCase();
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.setAttribute('aria-label', key);
      link.rel = 'noopener';
      link.target = '_blank';
      link.innerHTML = SOCIAL_ICONS[key] || key;
      li.append(link);
      social.append(li);
    });
    topbar.append(social);
  }
  return topbar;
}

function markDropdowns(navSections) {
  navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
    if (li.querySelector('ul')) li.classList.add('nav-drop');
    // mark deeper groups too
    li.querySelectorAll(':scope ul > li').forEach((sub) => {
      if (sub.querySelector('ul')) sub.classList.add('nav-subgroup');
    });
  });
}

function closeAllDropdowns(navSections) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

export default async function decorate(block) {
  const navPath = '/nav';
  const source = await fetchNav(navPath);
  block.textContent = '';
  if (!source) return;

  const sections = source.querySelectorAll(':scope > div');
  const [topbarSrc, logoSrc, navSrc] = sections;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Row 0: topbar (language + social)
  if (topbarSrc) nav.append(buildTopbar(topbarSrc));

  // Row 1: main header — left nav group, centered logo, right nav group, tools
  const main = document.createElement('div');
  main.className = 'nav-main';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (logoSrc) {
    const logoLink = logoSrc.querySelector('a');
    if (logoLink) brand.append(logoLink.cloneNode(true));
  }

  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  if (navSrc) {
    const ul = navSrc.querySelector(':scope > ul');
    if (ul) navSections.append(ul.cloneNode(true));
  }
  markDropdowns(navSections);

  // Split top-level items around the "home" item (empty/"/" link, e.g. Acasă),
  // which is represented by the centered logo.
  const sourceUl = navSections.querySelector(':scope > ul');
  const topItems = sourceUl ? [...sourceUl.children].filter((li) => li.tagName === 'LI') : [];
  const homeIdx = topItems.findIndex((li) => {
    const href = li.querySelector(':scope > a')?.getAttribute('href');
    return href === '/' || (li.textContent || '').trim().toLowerCase().startsWith('acasă');
  });
  const splitAt = homeIdx >= 0 ? homeIdx : Math.ceil(topItems.length / 2);

  const leftGroup = document.createElement('div');
  leftGroup.className = 'nav-sections nav-sections-left';
  const rightGroup = document.createElement('div');
  rightGroup.className = 'nav-sections nav-sections-right';
  const leftUl = document.createElement('ul');
  const rightUl = document.createElement('ul');
  topItems.forEach((li, i) => {
    if (i === homeIdx) return; // becomes the centered logo
    (i < splitAt ? leftUl : rightUl).append(li);
  });
  leftGroup.append(leftUl);
  rightGroup.append(rightUl);

  // tools: search icon + menu toggle (desktop), hamburger (mobile)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  tools.innerHTML = `
    <button type="button" class="nav-search-toggle" aria-label="Search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>
    </button>
    <button type="button" class="nav-menu-toggle" aria-controls="nav" aria-label="Toggle menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;

  // Mobile drawer: a slide-in panel holding both nav groups + a close button.
  // On desktop the drawer uses `display: contents` so leftGroup/rightGroup
  // still flank the centered logo (order set in CSS).
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'nav-drawer-close';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = '&times;';
  drawer.append(closeBtn, leftGroup, rightGroup);

  main.append(drawer, brand, tools);
  nav.append(main);

  // backdrop overlay for the mobile drawer
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  nav.append(overlay);

  // Dropdown interaction across both nav groups. On desktop the top-level
  // dropdowns open on hover (see CSS), so a click only needs to prevent the
  // placeholder "#" links from jumping. On mobile, click toggles the panel.
  main.querySelectorAll('.nav-drop').forEach((li) => {
    const link = li.querySelector(':scope > a');
    if (link) {
      link.addEventListener('click', (e) => {
        if (isDesktop.matches) {
          if (link.getAttribute('href') === '#') e.preventDefault();
          return;
        }
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          const expanded = li.getAttribute('aria-expanded') === 'true';
          li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    }
  });

  // subgroup toggles (level 2 headings that expand level 3)
  main.querySelectorAll('.nav-subgroup > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#' || !isDesktop.matches) {
        e.preventDefault();
        const li = link.parentElement;
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      }
    });
  });

  const closeMenu = () => {
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  };

  const menuToggle = tools.querySelector('.nav-menu-toggle');
  menuToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded ? '' : 'hidden';
  });

  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) closeAllDropdowns(main);
  });

  // reset state when crossing the breakpoint
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    closeAllDropdowns(main);
  });

  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // decorative green-wave banner below the header, with the page title overlaid
  const banner = document.createElement('div');
  banner.className = 'nav-wave-banner';
  const bannerImg = document.createElement('img');
  bannerImg.src = '/img/romgaz-wave-banner.png';
  bannerImg.alt = '';
  bannerImg.setAttribute('aria-hidden', 'true');
  bannerImg.loading = 'lazy';
  banner.append(bannerImg);

  // page title overlaid on the banner — skipped on the homepage
  const titleEl = document.createElement('span');
  titleEl.className = 'nav-wave-title';
  banner.append(titleEl);
  block.append(banner);
  setBannerTitle(titleEl);
}
