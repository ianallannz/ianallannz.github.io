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
    fullon: {
        fontVariation: 1.0,
        lineHeightChaos: 0.8,
        indentChaos: 0.7,
        overlapChaos: 0.6
    },
    brutalist: {
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

    // Handle blockquotes with nested elements
    if (tag === 'blockquote') {
      el.querySelectorAll('p, span, em, strong, a').forEach(nested => {
        const content = nested.textContent.trim();
        if (content) {
          fragments.push({
            type: 'blockquote',
            content,
            href: nested.tagName.toLowerCase() === 'a' ? nested.getAttribute('href') : null
          });
        }
      });
    }

    // Handle standard text elements
    else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
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

          if (subtype === 'img') {
            fragments.push({
              type: 'img',
              src: node.getAttribute('src'),
              alt: node.getAttribute('alt') || ''
            });
          }

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
    }

    // Lists
    else if (['ul', 'ol'].includes(tag)) {
      el.querySelectorAll('li').forEach(li =>
        fragments.push({ type: 'li', content: li.textContent.trim() })
      );
    }

    // Standalone images
    else if (tag === 'img') {
      fragments.push({ type: 'img', src: el.src, alt: el.alt });
    }

    // YouTube embeds
    else if (tag === 'div') {
      const iframe = el.querySelector('iframe');
      if (iframe && iframe.src.includes('youtube.com/embed')) {
        fragments.push({ type: 'youtube', src: iframe.src });
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
    const weight = 200 + Math.random() * 400 * params.fontVariation;
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
        el.style.fontFamily = `'Baskervville', serif`;
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


document.addEventListener('DOMContentLoaded', () => {
  const blogPost = document.querySelector('.blog-post');
  const article = blogPost?.querySelector('article');
  const related = document.querySelector('.related-posts');
  const classList = blogPost?.classList || [];
  let active = false;

  // Extract preset from class
  const presetClass = Array.from(classList).find(cls => cls.startsWith('carsonify-'));
  let currentPreset = presetClass?.replace('carsonify-', '') || 'off';

  // Create select dropdown
  const select = document.createElement('select');
  select.className = 'carson-toggle';
  ['off', 'mild', 'expressive', 'fullon', 'brutalist'].forEach(preset => {
    const option = document.createElement('option');
    option.value = preset;
    option.textContent = `The 90's: ${preset}`;
    if (preset === currentPreset) option.selected = true;
    select.appendChild(option);
  });

  // Wrap the select in a container
  const wrapper = document.createElement('div');
  wrapper.className = 'carson-toggle-wrapper';
  wrapper.appendChild(select);

  // Insert toggle into article initially
  if (article) {
    article.prepend(wrapper);
  }

  // Apply preset on load if not 'off'
  if (currentPreset !== 'off') {
    applyCarsonPreset(currentPreset);
    active = true;
  }

  // Handle preset change
  select.addEventListener('change', () => {
    const newPreset = select.value;
    removeCarsonLayout();

    if (newPreset !== 'off') {
      applyCarsonPreset(newPreset);
      active = true;
    } else {
      // Reinsert toggle into article when returning to readable mode
      if (article && !article.contains(wrapper)) {
        document.querySelectorAll('.carson-toggle-wrapper').forEach(el => el.remove());
        article.prepend(wrapper);
      }
      active = false;
    }

    currentPreset = newPreset;
  });

  function applyCarsonPreset(presetName) {
    const fragments = extractFragments();
    renderCarsonLayout(fragments, carsonPresets[presetName]);

    // Hide original article
    if (article) {
      article.style.visibility = 'hidden';
      article.style.position = 'absolute';
      article.style.left = '-9999px';
    }

    // Show related posts
    if (related) {
      related.style.visibility = '';
      related.style.position = '';
      related.style.left = '';
      related.style.display = '';
    }

    // Move toggle into .carson-render
    const container = document.querySelector('.carson-render');
    if (container && !container.contains(wrapper)) {
      document.querySelectorAll('.carson-toggle-wrapper').forEach(el => el.remove());
      container.prepend(wrapper);
    }

    // Reattach related posts below Carson layout
    container?.after(related);
  }

  function removeCarsonLayout() {
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
  }
});


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🚀 Initialize on DOM ready
// document.addEventListener('DOMContentLoaded', toggleCarsonMode);
