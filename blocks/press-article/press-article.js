/**
 * Press-release detail layout: a grey bar with a calendar icon, the article
 * title, body, and PDF link on the left; a dark contact sidebar on the right.
 */

const CALENDAR_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 6v11H5V8h14Z"/></svg>';

function buildContactSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'press-article-sidebar';
  aside.innerHTML = `
    <div class="press-article-sidebar-group">
      <h3>Secretariat Şi Comunicare</h3>
      <p>551130, Mediaş, P-ţa C.I. Motaş, nr. 4</p>
      <p>Tel: +4-0374-401020</p>
      <p>Fax: +4-0269-846901</p>
      <p><a href="mailto:secretariat@romgaz.ro">secretariat@romgaz.ro</a></p>
      <p><a href="mailto:comunicare@romgaz.ro">comunicare@romgaz.ro</a></p>
    </div>
    <div class="press-article-sidebar-group">
      <h3>Relaţia cu investitorii / Dividende şi Piaţa de Capital</h3>
      <p>+40 374 406 929 (între orele 8 – 16)</p>
      <p>+40 374 401819 (între orele 8 – 16)</p>
      <p><a href="mailto:investor.relations@romgaz.ro">investor.relations@romgaz.ro</a></p>
    </div>
    <div class="press-article-sidebar-group">
      <h3>Furnizare gaze naturale în regim de ultimă instanță</h3>
      <p><a href="mailto:fui@romgaz.ro">E-mail: fui@romgaz.ro</a></p>
      <p>+40 0374 402 540 (între orele 8 – 16)</p>
      <p>+40 0374 402 541 (între orele 8 – 16)</p>
      <p>+40 0748 700 004 (între orele 8 – 16)</p>
      <p>Fax: 0269846901</p>
    </div>
    <a class="press-article-sidebar-btn" href="https://romgaz.ro/contact" target="_blank" rel="noopener">Contactati-ne</a>`;
  return aside;
}

export default function decorate(block) {
  const source = block.querySelector(':scope > div > div') || block;
  const nodes = [...source.children];

  const article = document.createElement('div');
  article.className = 'press-article-body';

  // grey bar with a calendar icon, above the title
  const bar = document.createElement('div');
  bar.className = 'press-article-bar';
  bar.innerHTML = CALENDAR_ICON;
  article.append(bar);

  nodes.forEach((node) => article.append(node));

  const layout = document.createElement('div');
  layout.className = 'press-article-layout';
  layout.append(article, buildContactSidebar());

  block.textContent = '';
  block.append(layout);
}
