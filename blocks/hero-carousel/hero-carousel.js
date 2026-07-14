/**
 * Hero carousel: rotating featured items. Each authored row is one slide:
 *   [ image | heading + optional link ]
 * Slides auto-advance; dots and prev/next controls allow manual navigation.
 */

function showSlide(block, slides, dots, index) {
  const i = (index + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle('active', n === i));
  dots.forEach((d, n) => d.setAttribute('aria-current', n === i ? 'true' : 'false'));
  block.dataset.current = String(i);
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('div');
  track.className = 'hero-carousel-track';

  const slides = rows.map((row) => {
    const cells = [...row.children];
    const img = cells.find((c) => c.querySelector('picture, img'));
    const body = cells.find((c) => c !== img) || cells[cells.length - 1];

    const slide = document.createElement('div');
    slide.className = 'hero-carousel-slide';

    const media = document.createElement('div');
    media.className = 'hero-carousel-media';
    const picture = img && img.querySelector('picture, img');
    if (picture) media.append(picture);
    slide.append(media);

    const caption = document.createElement('div');
    caption.className = 'hero-carousel-caption';
    if (body) {
      const link = body.querySelector('a[href]');
      const heading = body.querySelector('h1, h2, h3') || body;
      const text = (heading.textContent || '').trim();
      if (link) {
        link.textContent = text;
        link.classList.add('hero-carousel-title');
        caption.append(link);
      } else {
        const span = document.createElement('span');
        span.className = 'hero-carousel-title';
        span.textContent = text;
        caption.append(span);
      }
    }
    slide.append(caption);
    return slide;
  });

  slides.forEach((s) => track.append(s));
  block.textContent = '';
  block.append(track);

  if (slides.length <= 1) {
    if (slides[0]) slides[0].classList.add('active');
    return;
  }

  // dots
  const dots = document.createElement('div');
  dots.className = 'hero-carousel-dots';
  const dotBtns = slides.map((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hero-carousel-dot';
    b.setAttribute('aria-label', `Slide ${n + 1}`);
    b.addEventListener('click', () => showSlide(block, slides, dotBtns, n));
    dots.append(b);
    return b;
  });

  // prev / next
  const nav = (dir, label, cls) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `hero-carousel-nav ${cls}`;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      showSlide(block, slides, dotBtns, Number(block.dataset.current || 0) + dir);
    });
    return b;
  };
  block.append(nav(-1, 'Anterior', 'hero-carousel-prev'));
  block.append(nav(1, 'Următor', 'hero-carousel-next'));
  block.append(dots);

  showSlide(block, slides, dotBtns, 0);

  // auto-advance every 6s, paused on hover
  let timer = setInterval(() => {
    showSlide(block, slides, dotBtns, Number(block.dataset.current || 0) + 1);
  }, 6000);
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => {
      showSlide(block, slides, dotBtns, Number(block.dataset.current || 0) + 1);
    }, 6000);
  });
}
