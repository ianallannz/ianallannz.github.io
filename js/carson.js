// carson.js

// 🎛️ Parameters for Carson Mode
const carsonPresets = {
    mild: {
        fontVariation: 0.3,
        lineHeightChaos: 0.2,
        indentChaos: 0.1,
        overlapChaos: 0.1
    },
    expressive: {
        fontVariation: 0.7,
        lineHeightChaos: 0.5,
        indentChaos: 0.4,
        overlapChaos: 0.3
    },
    fullChaos: {
        fontVariation: 1.0,
        lineHeightChaos: 0.8,
        indentChaos: 0.7,
        overlapChaos: 0.6
    },
    brutalistOverdrive: {
        fontVariation: 1.2,
        lineHeightChaos: 1.0,
        indentChaos: 1.0,
        overlapChaos: 0.9
    }
};


function extractFragments() {
    const section = document.querySelector('.blog-post');
    const elements = section.querySelectorAll('article > *');
    const fragments = [];

    elements.forEach(el => {
        const tag = el.tagName.toLowerCase();

        if (['p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const parts = node.textContent.trim().split(/(?<=[.?!])\s+/);
                    parts.forEach(part => {
                        if (part.trim()) fragments.push({ type: tag, content: part });
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const subtype = node.tagName.toLowerCase();
                    const content = node.textContent.trim();

                    if (['strong', 'em', 'a', 'span'].includes(subtype) && content) {
                        fragments.push({
                            type: subtype,
                            content,
                            href: subtype === 'a' ? node.getAttribute('href') : null
                        });
                    }

                    // 🖼️ NEW: extract <img> inside <p>
                    if (subtype === 'img') {
                        fragments.push({
                            type: 'img',
                            src: node.getAttribute('src'),
                            alt: node.getAttribute('alt') || ''
                        });
                    }

                    // 🖼️ NEW: extract <a><img></a> inside <p>
                    if (subtype === 'a') {
                        const img = node.querySelector('img');
                        if (img) {
                            fragments.push({
                                type: 'img',
                                src: img.getAttribute('src'),
                                alt: img.getAttribute('alt') || '',
                                href: node.getAttribute('href')
                            });
                        }
                    }
                }
            });

        } else if (['ul', 'ol'].includes(tag)) {
            el.querySelectorAll('li').forEach(li =>
                fragments.push({ type: 'li', content: li.textContent.trim() })
            );
        } else if (tag === 'img') {
            fragments.push({ type: 'img', src: el.src, alt: el.alt });
        } else if (tag === 'div') {
            const iframe = el.querySelector('iframe');
            if (iframe && iframe.src.includes('youtube.com/embed')) {
                fragments.push({
                    type: 'youtube',
                    src: iframe.src
                });
            }
        } else if (tag === 'iframe' && el.src.includes('youtube')) {
            fragments.push({ type: 'youtube', src: el.src });
        }
    });

    return fragments;
}

// 🎨 Apply random styles to a fragment
function styleFragment(el, frag, params) {
    el.className = `carson-frag carson-${frag.type}`;

    // 🎞️ YouTube iframe (possibly from a div wrapper)
    if (frag.type === 'youtube') {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.paddingBottom = '56.25%';
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.width = '100%';

        const iframe = document.createElement('iframe');
        iframe.src = frag.src;
        iframe.allowFullscreen = true;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        wrapper.appendChild(iframe);
        el.appendChild(wrapper);
    }

    // 🖼️ Image (possibly wrapped in a link)
    else if (frag.type === 'img') {
        const img = document.createElement('img');
        img.src = frag.src;
        img.alt = frag.alt || '';
        img.style.width = '100%';
        img.style.maxWidth = '400px';
        img.style.marginTop = `${(Math.random() - 0.5) * 100}px`;
        img.style.marginLeft = `${(Math.random() - 0.5) * 100}px`;
        img.style.opacity = '0.7';
        img.style.mixBlendMode = 'multiply';
        img.style.position = 'relative';
        img.style.zIndex = '1';

        if (frag.href) {
            const link = document.createElement('a');
            link.href = frag.href;
            link.target = '_blank';
            link.appendChild(img);
            el.appendChild(link);
        } else {
            el.appendChild(img);
        }
    }

    // 🔗 Anchor text
    else if (frag.type === 'a') {
        const link = document.createElement('a');
        link.href = frag.href || '#';
        link.textContent = frag.content;
        link.target = '_blank';
        link.style.fontVariationSettings = `'wght' ${500 + Math.random() * 300}`;
        link.style.textDecoration = Math.random() < 0.5 ? 'underline' : 'none';
        link.style.mixBlendMode = 'difference';
        link.style.color = 'teal';
        link.style.fontWeight = '600';
        el.appendChild(link);
    }

    // ✍️ Span
    else if (frag.type === 'span') {
        el.textContent = frag.content;
        el.style.fontStyle = 'italic';
        el.style.opacity = 0.8;
    }

    // 🧾 All other text-based fragments
    else {
        el.textContent = frag.content || '';
    }

    // ✒️ Typography chaos
    const weight = 400 + Math.random() * 600 * params.fontVariation;
    const width = 75 + Math.random() * 25;
    const spacing = (Math.random() - 0.5) * 0.2 + 'em';

    el.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}`;
    el.style.letterSpacing = spacing;
    el.style.lineHeight = `${1 + (Math.random() - 0.5) * params.lineHeightChaos}`;
    el.style.marginLeft = `${(Math.random() - 0.5) * 100 * params.indentChaos}px`;
    el.style.position = 'relative';
    el.style.zIndex = Math.floor(Math.random() * 10);

    if (Math.random() < params.overlapChaos) {
        el.style.marginTop = `-${Math.random() * 40}px`;
    }

    // 🎨 Emphasis styling
    if (frag.type === 'strong') {
        el.style.fontWeight = '900';
        el.style.textTransform = 'uppercase';
        el.style.color = 'crimson';
    }

    if (frag.type === 'em') {
        el.style.fontStyle = 'italic';
        el.style.color = 'darkslateblue';
    }

    // 🧱 Heading styling
    if (frag.type.startsWith('h')) {
        el.style.fontFamily = `'Libre Baskerville', serif`;
        el.style.fontSize = `${1.5 + Math.random()}rem`;
        el.style.fontWeight = '700';
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '0.05em';
        el.style.borderBottom = '2px solid currentColor';
        el.style.marginBottom = '0.5rem';
    }

    // 📐 Layout chaos
    el.style.flexBasis = `${30 + Math.random() * 40}%`;
    el.style.alignSelf = Math.random() < 0.5 ? 'flex-start' : 'flex-end';
}


// 🧱 Render Carson layout
function renderCarsonLayout(fragments, params) {
    const container = document.createElement('div');
    container.className = 'carson-render';

    fragments.forEach(frag => {
        const el = document.createElement('div');
        styleFragment(el, frag, params);
        container.appendChild(el);
    });

    const article = document.querySelector('.blog-post article');
    article.style.display = 'none';
    document.querySelector('.blog-post').appendChild(container);
}

// 🔁 Toggle Carson Mode
function toggleCarsonMode() {
    let active = false;
    let currentPreset = 'fullChaos'; // default

    const btn = document.createElement('button');
    btn.textContent = 'Carsonify v0.1';
    btn.className = 'carson-toggle';
    document.body.prepend(btn);

    btn.addEventListener('click', () => {
        const article = document.querySelector('.blog-post article');
        const related = document.querySelector('.related-posts');

        if (!active) {
            const fragments = extractFragments();
            renderCarsonLayout(fragments, carsonPresets[currentPreset]);

            // Hide original layout elements
            if (article) {
                article.style.visibility = 'hidden';
                article.style.position = 'absolute';
                article.style.left = '-9999px';
            }

            // Float related-posts below Carson layout
            if (related) {
                related.style.visibility = '';
                related.style.position = '';
                related.style.left = '';
                related.style.display = '';
                document.querySelector('.carson-render')?.after(related);
            }

            btn.textContent = `Normal`;
        } else {
            // Restore original layout
            document.querySelector('.carson-render')?.remove();

            if (article) {
                article.style.visibility = '';
                article.style.position = '';
                article.style.left = '';
                article.style.display = '';
            }

            if (related) {
                related.style.visibility = '';
                related.style.position = '';
                related.style.left = '';
                related.style.display = '';
            }

            btn.textContent = `Carsonify v0.1`;
        }

        active = !active;
    });

    // Optional: cycle presets on right-click
    btn.addEventListener('contextmenu', e => {
        e.preventDefault();
        const keys = Object.keys(carsonPresets);
        const index = keys.indexOf(currentPreset);
        currentPreset = keys[(index + 1) % keys.length];
        if (!active) {
            btn.textContent = `Carson Mode: ${capitalize(currentPreset)}`;
        }
    });
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🚀 Initialize on DOM ready
document.addEventListener('DOMContentLoaded', toggleCarsonMode);
