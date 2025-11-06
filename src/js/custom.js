// Remove hash from URL when scrolled to top

let hashClearTimeout;
const resetThreshold = 200; // pixels from top

window.addEventListener('scroll', () => {
    clearTimeout(hashClearTimeout);

    hashClearTimeout = setTimeout(() => {
        if (window.scrollY < resetThreshold && window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, 150); // delay in ms
});


// Hamburger menu toggle

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});



// Fading background for sections

const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
                el.classList.add('visible-bg');
            } else {
                el.classList.remove('visible-bg');
            }
        });
    },
    {
        threshold: 0,
        rootMargin: '0px 0px -40% 0px'
    }
);

sections.forEach(el => observer.observe(el));


// Modal functionality

document.querySelectorAll('.popup, .locked').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const modal = document.querySelector(targetId);
        const content = modal.querySelector('.modal-content');

        // Set transform origin based on click
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;
        content.style.transformOrigin = `${x}% ${y}%`;

        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            content.classList.remove('animate-in');
            void content.offsetWidth;
            content.classList.add('animate-in');
        });
    });
});

document.querySelectorAll('.modal .close').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        const content = modal.querySelector('.modal-content');

        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Reset animation class
        content.classList.remove('animate-in');
    });
});


// Show hide blog topics

const toggleLink = document.querySelector('.toggle-link');
if (toggleLink) {
  toggleLink.addEventListener('click', function(e) {
    e.preventDefault();
    const list = document.querySelector('.topics-list');
    list.classList.toggle('visible-topics');

    this.textContent = list.classList.contains('visible-topics')
      ? '[Hide topics⇡]'
      : '[Show topics⇣]';
  });
}


// Obfuscate contact

document.getElementById("mp-link").setAttribute("href", "tel:+64210473399");
document.getElementById("e-link").setAttribute("href", "mailto:ian.allan.nz@gmail.com");

