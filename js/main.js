/* CoastSlide global helpers */

document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage || a.getAttribute('href').includes(currentPage)) {
      a.classList.add('active');
    }
  });

  const revealEls = document.querySelectorAll('.svc-card, .review-card, .step-card, .why-point, .faq-item, .pr-cell, .service-detail-card, .region-card, .blog-card');
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .55s ease ${(i % 4) * 0.08}s, transform .55s ease ${(i % 4) * 0.08}s`;
      io.observe(el);
    });
  }

  window.showReg = function (id) {
    document.querySelectorAll('.rpanel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
    const panel = document.getElementById('rp-' + id);
    if (panel) panel.classList.add('active');
    const map = ['miami', 'broward', 'palm'];
    const tabs = document.querySelectorAll('.rtab');
    const index = map.indexOf(id);
    if (index >= 0 && tabs[index]) tabs[index].classList.add('active');
  };

  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function () {
      const answer = this.querySelector('.faq-a');
      const isOpen = this.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-a');
        if (a) { a.style.maxHeight = '0'; a.style.paddingTop = '0'; }
      });
      if (!isOpen && answer) {
        this.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingTop = '12px';
      }
    });
    const a = item.querySelector('.faq-a');
    if (a) { a.style.maxHeight = '0'; a.style.overflow = 'hidden'; a.style.transition = 'max-height .3s ease, padding-top .3s ease'; }
  });

  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burger.textContent = mobileMenu.classList.contains('open') ? 'X' : '\u2630';
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
