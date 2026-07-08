/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-press. Base: cards.
 * Sources:
 *   - https://romgaz.ro/comunicate-de-presa (press releases: .view-content-wrap > div.item)
 *   - https://romgaz.ro/noutati-si-evenimente (news/events: .item-list > li.view-list-item)
 * Generated for a 2-column Cards block: [image cell, body cell] per row.
 *
 * Handles two source item structures gracefully:
 *   1. Press-release item (div.item): pictogram image + stacked date + linked title (h3.post-title>a)
 *      + summary (.event-description) + PDF CTA (.post-file a).
 *   2. News/event item (li.view-list-item): timestamp (.post-created) + linked PDF title (.post-file a),
 *      no image and no separate summary.
 */
export default function parse(element, { document }) {
  // Collect items from either page structure. div.item = press releases, li.view-list-item = news/events.
  const items = Array.from(element.querySelectorAll('div.item, li.view-list-item'));

  const cells = [];

  items.forEach((item) => {
    // --- Image cell (mandatory per Cards block; padded with '' when absent) ---
    const img = item.querySelector('.item-image img, .event-image img, img');

    // --- Body cell contents ---
    const bodyCell = [];

    // Date: press releases use stacked spans in .event-date; news/events use .post-created timestamp.
    const eventDate = item.querySelector('.event-date');
    const postCreated = item.querySelector('.post-created');
    if (eventDate) {
      const parts = Array.from(eventDate.querySelectorAll('span'))
        .map((s) => s.textContent.trim())
        .filter((t) => t);
      if (parts.length) {
        const dateP = document.createElement('p');
        dateP.textContent = parts.join(' ');
        bodyCell.push(dateP);
      }
    } else if (postCreated && postCreated.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.textContent = postCreated.textContent.trim();
      bodyCell.push(dateP);
    }

    // Title heading: press releases have an explicit h3.post-title > a.
    const titleLink = item.querySelector('h3.post-title a, .post-title a, .event-content h3 a');
    // PDF CTA link.
    const fileLink = item.querySelector('.post-file a');

    if (titleLink) {
      // Rebuild a clean heading with the linked title.
      const heading = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', titleLink.getAttribute('href'));
      a.textContent = titleLink.textContent.trim();
      heading.append(a);
      bodyCell.push(heading);
    } else if (fileLink) {
      // News/events: no explicit title heading — promote the PDF link text to the heading.
      const heading = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', fileLink.getAttribute('href'));
      a.textContent = fileLink.textContent.trim();
      heading.append(a);
      bodyCell.push(heading);
    }

    // Summary paragraph (press releases only).
    const description = item.querySelector('.event-description');
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      bodyCell.push(descP);
    }

    // PDF CTA: add as a link at the bottom of the body cell.
    // For press releases the title already links to the article, so keep the PDF as a distinct CTA.
    // For news/events the heading already IS the PDF link, so skip the duplicate.
    if (fileLink && titleLink) {
      const ctaP = document.createElement('p');
      const ctaA = document.createElement('a');
      ctaA.setAttribute('href', fileLink.getAttribute('href'));
      const ctaText = (fileLink.getAttribute('title') || fileLink.textContent || '').trim();
      ctaA.textContent = ctaText || 'Download PDF';
      ctaP.append(ctaA);
      bodyCell.push(ctaP);
    }

    // Skip empty items entirely.
    if (bodyCell.length === 0 && !img) return;

    // Row is 2 columns: image cell + body cell. Pad image cell with '' when no image.
    cells.push([img || '', bodyCell]);
  });

  // Empty-block guard: if nothing extracted, unwrap the element.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-press', cells });
  element.replaceWith(block);
}
