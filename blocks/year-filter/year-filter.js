/**
 * Year filter: a centered "Selectaţi Anul" label above a year <select>.
 * Options are derived from the dated press cards present on the page, plus an
 * "Oricare" (all) option. Selecting a year filters the visible cards client-side.
 */
export default function decorate(block) {
  const label = document.createElement('span');
  label.className = 'year-filter-label';
  label.textContent = 'Selectaţi Anul';

  const select = document.createElement('select');
  select.className = 'year-filter-select';
  select.setAttribute('aria-label', 'Selectaţi anul');

  const all = document.createElement('option');
  all.value = '';
  all.textContent = 'Oricare';
  select.append(all);

  // Collect years from the press cards. The cards-press block may not be
  // decorated yet, so scan the whole block text (works before and after).
  const pressBlock = document.querySelector('.cards-press');
  const years = new Set();
  if (pressBlock) {
    const matches = pressBlock.textContent.match(/\b(20\d{2})\b/g) || [];
    matches.forEach((y) => years.add(y));
  }

  [...years].sort((a, b) => b - a).forEach((year) => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    select.append(opt);
  });

  const cardYear = (li) => {
    const month = li.querySelector('.cards-press-month');
    return month && (month.textContent.match(/(\d{4})/) || [])[1];
  };

  select.addEventListener('change', () => {
    const { value } = select;
    [...document.querySelectorAll('.cards-press li')].forEach((li) => {
      li.style.display = !value || cardYear(li) === value ? '' : 'none';
    });
  });

  block.textContent = '';
  block.append(label, select);
}
