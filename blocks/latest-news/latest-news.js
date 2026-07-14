/**
 * "Descoperiţi Ultimele Noutăţi" section: a left column of stacked news cards
 * (each: title + "MAI MULTE" button) and a right highlight panel (AGEA notice
 * + featured link). Authored rows:
 *   row 1..n-1  -> left cards: [ title(+link) | more-link ]
 *   last row    -> right panel: free content (paragraphs, links, image)
 * A row is treated as the right panel if it has the single cell / is marked.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const layout = document.createElement('div');
  layout.className = 'latest-news-layout';

  const left = document.createElement('div');
  left.className = 'latest-news-cards';
  const right = document.createElement('div');
  right.className = 'latest-news-panel';

  rows.forEach((row) => {
    const cells = [...row.children];
    const isPanel = row.classList.contains('panel')
      || cells.length === 1
      || cells[0].textContent.trim().toLowerCase() === 'panel';

    if (isPanel) {
      // right highlight panel — move all authored content in
      const src = cells[cells.length - 1];
      while (src.firstChild) right.append(src.firstChild);
      return;
    }

    // left news card: first cell = title(+link), optional second = CTA link
    const card = document.createElement('div');
    card.className = 'latest-news-card';

    const titleCell = cells[0];
    const ctaCell = cells[1];
    const titleLink = titleCell.querySelector('a[href]');
    const title = document.createElement('h3');
    if (titleLink) {
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleLink.textContent.trim();
      title.append(a);
    } else {
      title.textContent = titleCell.textContent.trim();
    }
    card.append(title);

    const ctaLink = (ctaCell && ctaCell.querySelector('a[href]')) || titleLink;
    if (ctaLink) {
      const cta = document.createElement('a');
      cta.className = 'latest-news-more';
      cta.href = ctaLink.getAttribute('href');
      cta.textContent = 'MAI MULTE';
      card.append(cta);
    }
    left.append(card);
  });

  layout.append(left);
  if (right.childNodes.length) layout.append(right);

  block.textContent = '';
  block.append(layout);
}
