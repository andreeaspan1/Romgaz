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

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    const cells = [...row.children];
    const imageCell = cells.find((d) => d.querySelector('picture'));
    const bodyCell = cells.find((d) => d !== imageCell);

    // image
    if (imageCell) {
      const img = imageCell.querySelector('img');
      const imageWrap = document.createElement('div');
      imageWrap.className = 'cards-press-card-image';
      if (img) {
        const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
        imageWrap.append(pic);
      }
      li.append(imageWrap);
    }

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
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
