let currentSlide = 0;
let autoAdvanceTimer = null;
let keydownHandler = null;
const AUTO_ADVANCE_DELAY = 6000;

const initHeroCarousel = () => {
  const carousel = document.querySelector('.hero-carousel');
  const dots = document.querySelectorAll('.hero-nav-dot');

  // Dot navigation with focus retention
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      goToSlide(slideIndex);
      resetAutoAdvance();
      dot.focus();
    });
  });

  // Scoped keyboard navigation - only when carousel has focus
  keydownHandler = (e) => {
    if (!carousel.contains(document.activeElement) && !isCarouselInView()) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextSlide();
      resetAutoAdvance();
      focusActiveDot();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
      resetAutoAdvance();
      focusActiveDot();
    }
  };
  document.addEventListener('keydown', keydownHandler);

  // Pause auto-advance on hover/focus
  if (carousel) {
    carousel.addEventListener('mouseenter', pauseAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
    carousel.addEventListener('focusin', pauseAutoAdvance);
    carousel.addEventListener('focusout', startAutoAdvance);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  // Initialize
  goToSlide(0);
  startAutoAdvance();
};

const cleanup = () => {
  pauseAutoAdvance();
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
  }
};

const isCarouselInView = () => {
  const hero = document.getElementById('hero');
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

const goToSlide = (index) => {
  const track = document.querySelector('.hero-carousel-track');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-nav-dot');
  const totalSlides = slides.length;

  if (index < 0 || index >= totalSlides || !track) return;

  currentSlide = index;

  // Slide the track
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  dots.forEach((dot, i) => {
    const isActive = i === currentSlide;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive);
    dot.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update aria-hidden on slides
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== currentSlide);
  });

  announceSlide();
};

const nextSlide = () => {
  const slides = document.querySelectorAll('.hero-slide');
  const nextIndex = (currentSlide + 1) % slides.length;
  goToSlide(nextIndex);
};

const prevSlide = () => {
  const slides = document.querySelectorAll('.hero-slide');
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(prevIndex);
};

const focusActiveDot = () => {
  const activeDot = document.querySelector('.hero-nav-dot.active');
  if (activeDot) {
    activeDot.focus();
  }
};

const announceSlide = () => {
  const liveRegion = document.getElementById('carousel-live');
  if (liveRegion) {
    const slides = document.querySelectorAll('.hero-slide');
    // Clear first, then set after brief delay for reliable screen reader announcements
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
    }, 50);
  }
};

const startAutoAdvance = () => {
  pauseAutoAdvance();
  autoAdvanceTimer = setInterval(nextSlide, AUTO_ADVANCE_DELAY);
};

const pauseAutoAdvance = () => {
  if (autoAdvanceTimer) {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
};

const resetAutoAdvance = () => {
  pauseAutoAdvance();
  startAutoAdvance();
};

export default initHeroCarousel;
