document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded ✅');

    // Add site-loaded class to body after DOM is fully loaded
    // This triggers the initial reveal animations.
    document.body.classList.add('site-loaded');

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            const nav = document.querySelector('.header .nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.header .nav');
    const header = document.querySelector('.header');

    if (menuToggle && nav && header) { // Ensure all elements exist
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Calculate header height dynamically for mobile nav positioning
            const headerHeight = header.offsetHeight;
            nav.style.setProperty('--header-height', `${headerHeight}px`);
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (event) => {
            if (nav.classList.contains('active') &&
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                nav.classList.remove('active');
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Apply saved theme or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '🌙';
        } else {
            themeToggle.innerHTML = '☀️';
        }

        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '🌙';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '☀️';
            }
        });
    }

    // Scroll Reveal Animations
    // Using IntersectionObserver for better performance and modern approach
    const revealItems = document.querySelectorAll('.reveal-item');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the item must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for project cards
                    if (entry.target.classList.contains('project-card')) {
                        const projectCardsInGrid = Array.from(document.querySelectorAll('.projects-grid .project-card'));
                        const cardIndex = projectCardsInGrid.indexOf(entry.target);
                        entry.target.style.setProperty('--delay', `${cardIndex * 0.1}s`); // 0.1s delay per card
                    }

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        revealItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        console.warn('IntersectionObserver not supported. All reveal items will be visible.');
        revealItems.forEach(item => {
            item.classList.add('is-visible');
        });
    }


    // Typewriter Effect for Hero Tagline
    const taglineElement = document.querySelector('.hero-tagline');
    if (taglineElement) {
        const taglineText = taglineElement.getAttribute('data-typed-text'); // Get text from data attribute
        taglineElement.textContent = ''; // Clear initial content

        let charIndex = 0;
        const typingSpeed = 50; // Speed of typing in ms

        function typeWriter() {
            if (charIndex < taglineText.length) {
                taglineElement.textContent += taglineText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                taglineElement.classList.remove('typing-active'); // Remove cursor
                taglineElement.style.borderRight = 'none'; // Ensure cursor is gone
            }
        }

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        taglineElement.classList.add('typing-active'); // Add cursor
                        setTimeout(typeWriter, 800); // Start typing after a small delay
                        observer.unobserve(entry.target); // Stop observing once typing starts
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.5 // Trigger when 50% of hero section is visible
            });

            heroObserver.observe(heroSection);
        } else {
            // Fallback: directly start typing if heroSection is not found or observer not supported
            taglineElement.classList.add('typing-active');
            typeWriter();
        }
    }
});