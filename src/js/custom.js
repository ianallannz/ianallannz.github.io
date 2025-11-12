// Work examples

const workImageData = [
    {
        image_url: '../images/work-pockit.jpg',
        related_how: 1
    },
    {
        image_url: '../images/work-pockit1.jpg',
        related_how: 1
    },
    {
        image_url: '../images/work-pockit3.jpg',
        related_how: 1
    },
    {
        image_url: '../images/work-saved.jpg',
        related_how: 2
    },
    {
        image_url: '../images/work-saved1.jpg',
        related_how: 2
    },
    {
        image_url: '../images/work-sinkashi.jpg',
        related_how: 3
    },
    {
        image_url: '../images/work-sinkashi1.jpg',
        related_how: 3
    },
    {
        image_url: '../images/work-teu.jpg',
        related_how: 4
    },
    {
        image_url: '../images/work-cdv.jpg',
        related_how: 5
    },
    {
        image_url: '../images/work-cdv1.jpg',
        related_how: 5
    },
    {
        image_url: '../images/work-yt6.jpg',
        related_how: 5
    },
    {
        image_url: '../images/work-yt5.jpg',
        related_how: 6
    },
    {
        image_url: '../images/work-yt1.jpg',
        related_how: 6
    },
    {
        image_url: '../images/work-yt4.jpg',
        related_how: 7
    },
    {
        image_url: '../images/work-pond1.jpg',
        related_how: 8
    },
    {
        image_url: '../images/work-tki.jpg',
        related_how: 8
    },
    {
        image_url: '../images/work-tki1.jpg',
        related_how: 8
    },
    {
        image_url: '../images/work-tki3.jpg',
        related_how: 8
    },
    {
        image_url: '../images/work-eit.jpg',
        related_how: 9
    },
    {
        image_url: '../images/work-eit1.jpg',
        related_how: 9
    }
];

const workHowData = [
    { id: 1, how_copy: "How do you respond to smartphone addiction with a meatspace brand?" },
    { id: 2, how_copy: "How do you turn doomed Windows 10 devices into a longterm business model?" },
    { id: 3, how_copy: "How do you get the stuck-in-their-ways to collect food scraps?" },
    { id: 4, how_copy: "How do you get public cut-through on the value of vocational education?" },
    { id: 5, how_copy: "How do you know what device West African small merchants would actually use?" },
    { id: 6, how_copy: "How do you present curent and future value to attract $XXm from a SE Asian conglomerate?" },
    { id: 7, how_copy: "How do you create an app for street merchants who take cash and have informal supply lines?" },
    { id: 8, how_copy: "How do you propose a reimagined social content platform for the MOE after you failed with the product you led?" },
    { id: 9, how_copy: "How do you wrap reliable group assessment around experiential learning?" }
];


document.addEventListener("DOMContentLoaded", () => {
    const dataroomSection = document.getElementById("dataroom-dt");
    const maxRetries = 20;

    function isOverlapping(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(
            x1 + w1 * 0.9 < x2 ||
            x1 > x2 + w2 * 0.9 ||
            y1 + h1 * 0.9 < y2 ||
            y1 > y2 + h2 * 0.9
        );
    }

    function renderImages() {
        const containerRect = dataroomSection.getBoundingClientRect();
        const placedImages = [];

        const oldImages = dataroomSection.querySelectorAll(".scattered-img");
        oldImages.forEach((img) => {
            img.style.opacity = "0";
            setTimeout(() => img.remove(), 500);
        });

        setTimeout(() => {
            workImageData.forEach((item) => {
                const img = new Image();
                img.src = item.image_url;
                img.alt = `Work image ${item.related_how}`;
                img.classList.add("scattered-img");
                img.style.opacity = "0";

                img.onload = () => {
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    let targetArea = Math.floor(Math.random() * 30000) + 30000;
                    let width = Math.round(Math.sqrt(targetArea * aspectRatio));
                    let height = Math.round(width / aspectRatio);


                    let tries = 0;
                    let top, left, overlap;

                    do {
                        top = Math.round(Math.random() * (containerRect.height - height));
                        left = Math.round(Math.random() * (containerRect.width - width));
                        overlap = placedImages.some((other) =>
                            isOverlapping(left, top, width, height, other.left, other.top, other.width, other.height)
                        );
                        tries++;
                    } while (overlap && tries < maxRetries);

                    if (overlap) {
                        width = Math.round(width * 0.8);
                        height = Math.round(height * 0.8);

                        top = Math.round(Math.random() * (containerRect.height - height));
                        left = Math.round(Math.random() * (containerRect.width - width));
                    }

                    img.style.width = `${width}px`;
                    img.style.height = `${height}px`;
                    img.style.position = "absolute";
                    img.style.top = `${top}px`;
                    img.style.left = `${left}px`;
                    // img.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

                    placedImages.push({ top, left, width, height });
                    dataroomSection.appendChild(img);

                    setTimeout(() => {
                        img.style.opacity = "1";
                    }, 50);
                };
            });
        }, 500);
    }

    function renderTextboxes() {
        const containerRect = dataroomSection.getBoundingClientRect();
        const placedTextboxes = [];

        const oldBoxes = dataroomSection.querySelectorAll(".how-textbox");
        oldBoxes.forEach((box) => {
            box.style.opacity = "0";
            setTimeout(() => box.remove(), 500);
        });

        setTimeout(() => {
            workHowData.forEach((item) => {
                const box = document.createElement("div");
                box.classList.add("how-textbox");
                box.textContent = item.how_copy;

                const width = Math.floor(Math.random() * 100) + 220;
                box.style.width = `${width}px`;
                box.style.position = "absolute";
                box.style.zIndex = 10;
                box.style.opacity = "0";

                box.style.visibility = "hidden";
                dataroomSection.appendChild(box);
                const height = box.offsetHeight;
                dataroomSection.removeChild(box);
                box.style.visibility = "visible";

                let tries = 0;
                let top, left, overlap;

                do {
                    top = Math.random() * (containerRect.height - height);
                    left = Math.random() * (containerRect.width - width);
                    overlap = placedTextboxes.some((other) =>
                        isOverlapping(left, top, width, height, other.left, other.top, other.width, other.height)
                    );
                    tries++;
                } while (overlap && tries < maxRetries);

                box.style.top = `${top}px`;
                box.style.left = `${left}px`;

                dataroomSection.appendChild(box);
                placedTextboxes.push({ top, left, width, height });

                const delay = 1000 + Math.random() * 500;
                setTimeout(() => {
                    box.style.opacity = "1";
                    box.style.transition = "opacity 0.8s ease";

                    // Trigger flicker animation manually
                    box.classList.add("flicker-text");
                }, delay);
            });
        }, 500);
    }

    function renderAll() {
        renderImages();
        renderTextboxes();
    }

    renderAll();
    setInterval(renderAll, 8000);
});





// Tooltip popup over work

document.addEventListener("DOMContentLoaded", () => {
    const tooltipTarget = document.querySelector(".work-tooltip");

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-popup";
    tooltip.textContent = tooltipTarget.dataset.tooltip;
    document.body.appendChild(tooltip);

    tooltipTarget.addEventListener("mousemove", (e) => {
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY + 12}px`;
        tooltip.style.opacity = "1";
    });

    tooltipTarget.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
    });

    tooltipTarget.addEventListener("click", (e) => {
        const trigger = document.getElementById("modal-trigger-contact");
        if (trigger) {
            trigger.click();
        }
    });

});











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
    toggleLink.addEventListener('click', function (e) {
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




