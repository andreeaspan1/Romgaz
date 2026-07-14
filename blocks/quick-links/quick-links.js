/**
 * Quick-links grid: renders a list of links as a responsive card grid.
 * Authored as a single cell containing a <ul> of links (or stacked links).
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  const grid = document.createElement('div');
  grid.className = 'quick-links-grid';

  links.forEach((a) => {
    const item = document.createElement('a');
    item.className = 'quick-links-item';
    item.href = a.getAttribute('href');
    item.textContent = a.textContent.trim();
    grid.append(item);
  });

  block.textContent = '';
  block.append(grid);
}
