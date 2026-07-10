async function fetchFooter(footerPath) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tpl = document.createElement('div');
  tpl.innerHTML = html;
  return tpl;
}

export default async function decorate(block) {
  const source = await fetchFooter('/footer');
  block.textContent = '';
  if (!source) return;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // The source footer includes "Despre noi" / "Legaturi utile" columns that are
  // not part of the original site footer; keep only the last (copyright) section.
  const sections = [...source.querySelectorAll(':scope > div')];
  const copyright = sections[sections.length - 1];
  if (copyright) {
    copyright.classList.add('footer-copyright');
    footer.append(copyright);
  }

  block.append(footer);
}
