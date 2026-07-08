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

  const sections = [...source.querySelectorAll(':scope > div')];
  // First two sections are content columns; the rest (copyright) sit below.
  const columns = document.createElement('div');
  columns.className = 'footer-columns';

  sections.forEach((section, i) => {
    if (i < sections.length - 1) {
      section.classList.add('footer-column');
      columns.append(section);
    } else {
      section.classList.add('footer-copyright');
      footer.append(columns);
      footer.append(section);
    }
  });

  block.append(footer);
}
