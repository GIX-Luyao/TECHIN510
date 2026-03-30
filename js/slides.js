/* ======================================================
   TECHIN 510 – Shared Slide Navigation
   Keyboard, touch, dots, progress, edit mode
   ====================================================== */
(function () {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const progressBar = document.getElementById('progress');
  const navDotsContainer = document.getElementById('nav-dots');
  const editBtn = document.getElementById('editBtn');
  let currentSlide = 0;
  let isEditing = false;

  // --- Generate nav dots ---
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    navDotsContainer.appendChild(dot);
  });

  const navDots = document.querySelectorAll('.nav-dot');

  // --- Intersection Observer for animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const idx = Array.from(slides).indexOf(entry.target);
        currentSlide = idx;
        updateUI();
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(slide => observer.observe(slide));

  // --- Update progress & dots ---
  function updateUI() {
    const pct = ((currentSlide) / (totalSlides - 1)) * 100;
    progressBar.style.width = pct + '%';

    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // --- Navigation ---
  function goToSlide(idx) {
    if (idx < 0 || idx >= totalSlides) return;
    slides[idx].scrollIntoView({ behavior: 'smooth' });
  }

  // --- Keyboard nav ---
  document.addEventListener('keydown', (e) => {
    if (isEditing && e.key !== 'Escape') return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'e':
      case 'E':
        e.preventDefault();
        toggleEdit();
        break;
      case 'Escape':
        if (isEditing) toggleEdit();
        break;
    }
  });

  // --- Touch swipe ---
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isEditing) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      goToSlide(currentSlide + (diff > 0 ? 1 : -1));
    }
  }, { passive: true });

  // --- Edit mode ---
  function toggleEdit() {
    isEditing = !isEditing;
    document.body.classList.toggle('editing', isEditing);

    const editables = document.querySelectorAll('h1, h2, p, li, strong, span, code, .subtitle, .overline, .meta-line, .quote-attr');
    editables.forEach(el => {
      el.contentEditable = isEditing ? 'true' : 'false';
    });

    // Disable scroll-snap in edit mode
    document.documentElement.style.scrollSnapType = isEditing ? 'none' : 'y mandatory';
  }

  editBtn.addEventListener('click', toggleEdit);

  // --- Ctrl+S / Cmd+S to save edits ---
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (isEditing) {
        const html = document.documentElement.outerHTML;
        const blob = new Blob(['<!DOCTYPE html>\n' + html], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = location.pathname.split('/').pop() || 'slides.html';
        a.click();
        URL.revokeObjectURL(a.href);
      }
    }
  });

  // --- Init: make first slide visible ---
  slides[0].classList.add('visible');
  updateUI();
})();
