// script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript loaded ✅');

  document.body.classList.add('site-loaded');

  // Smooth Scrolling
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      const nav = document.querySelector('.header .nav');
      if (nav.classList.contains('active')) nav.classList.remove('active');
    });
  });

  // Mobile Nav Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header .nav');
  const header = document.querySelector('.header');

  if (menuToggle && nav && header) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      nav.style.setProperty('--header-height', `${header.offsetHeight}px`);
    });

    document.addEventListener('click', e => {
      if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
      }
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '🌙';
    } else {
      themeToggle.innerHTML = '☀️';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      themeToggle.innerHTML = mode === 'dark' ? '🌙' : '☀️';
    });
  }

  // Reveal Animation
  const revealItems = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('project-card')) {
            const index = Array.from(document.querySelectorAll('.projects-grid .project-card')).indexOf(entry.target);
            entry.target.style.setProperty('--delay', `${index * 0.1}s`);
          }
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Typewriter Effect
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const text = tagline.getAttribute('data-typed-text');
    tagline.textContent = '';
    let i = 0;
    const speed = 50;

    function typeWriter() {
      if (i < text.length) {
        tagline.textContent += text.charAt(i++);
        setTimeout(typeWriter, speed);
      } else {
        tagline.classList.remove('typing-active');
        tagline.style.borderRight = 'none';
      }
    }

    const hero = document.getElementById('hero');
    if (hero) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tagline.classList.add('typing-active');
            setTimeout(typeWriter, 800);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(hero);
    } else {
      tagline.classList.add('typing-active');
      typeWriter();
    }
  }
});
