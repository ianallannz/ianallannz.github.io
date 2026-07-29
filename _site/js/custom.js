// Style switcher: Ian (custom.css) <-> Pro Ian (pro.css)
//
// The initial state is applied by the inline script in the layout <head> so
// there is no flash of the wrong design. This block only handles clicks and
// keeps aria-checked in sync. Kept first in the file, and self-contained, so a
// failure further down can't stop the switch from working.

(function () {
    const STORAGE_KEY = 'site-style';

    // Both stylesheets are already linked in the document head — switching is a
    // matter of enabling one and disabling the other, which is instant and
    // needs no network round trip. See the note in the layout <head>.
    const sheets = {
        og: document.getElementById('style-og'),
        pro: document.getElementById('style-pro'),
    };
    const switches = document.querySelectorAll('.style-switch');
    if (!sheets.og || !sheets.pro || !switches.length) return;

    const current = () =>
        document.documentElement.getAttribute('data-site-style') === 'pro' ? 'pro' : 'og';

    function apply(style) {
        const pro = style === 'pro';
        document.documentElement.setAttribute('data-site-style', style);
        sheets.og.disabled = pro;
        sheets.pro.disabled = !pro;
        switches.forEach(el => el.setAttribute('aria-checked', String(pro)));
        try {
            localStorage.setItem(STORAGE_KEY, style);
        } catch (e) {
            // Private browsing / storage disabled: the switch still works for this page view.
        }
    }

    // Sync the control with whatever the head script already decided.
    switches.forEach(el => {
        el.setAttribute('aria-checked', String(current() === 'pro'));
        el.addEventListener('click', () => apply(current() === 'pro' ? 'og' : 'pro'));
    });
})();



(function () {
    const root = document.documentElement;
    const DOCK_AT = 24;
    let queued = false;

    function update() {
        queued = false;
        root.toggleAttribute('data-scrolled', window.scrollY > DOCK_AT);
    }

    function onScroll() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
})();


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
        image_url: '../images/work-pockit2.jpg',
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
        image_url: '../images/work-saved2.jpg',
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
    },
    {
        image_url: '../images/work-occam-site.jpg',
        related_how: 10
    },
    {
        image_url: '../images/work-occam-ui.jpg',
        related_how: 10
    },
    {
        image_url: '../images/work-loadrite01.jpg',
        related_how: 11
    },
    {
        image_url: '../images/work-loadrite02.jpg',
        related_how: 11
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
    { id: 9, how_copy: "How do you wrap reliable group assessment around experiential learning?" },
    { id: 10, how_copy: "How do you make a 20-year old software platform that's still bleeding-edge look bleeding-edge?" },
    { id: 11, how_copy: "How do you make a fun game on your company stand the talk of the trade show while collecting contacts?" },
    { id: 12, how_copy: "What question do you need answered?" }
];


// The scatter is laid out in three passes rather than placed image-by-image:
//
//   1. buildCluster()   — each related_how group gets its own little canvas and
//                         its images are scattered inside it. Coordinates here
//                         are local to the cluster.
//   2. layoutClusters() — clusters are dealt into rows, and within a row they're
//                         laid left to right separated by randomly sized gaps.
//                         Rows don't overlap vertically and siblings don't
//                         overlap horizontally, so no two clusters can ever
//                         collide — but every position inside those bounds is
//                         random, so it still reads as scattered rather than
//                         gridded.
//   3. placeQuestions() — each question is seated in free space near its own
//                         cluster, clear of every cluster and every other
//                         question.
//   4. paint()          — offsets are summed and written to the DOM, and a
//                         connector is drawn from each question to the middle of
//                         the group it belongs to.
//
// The old code positioned each image inside its own onload handler, so sizes
// weren't known until they arrived and the order was whatever the network gave
// us. Grouping needs every aspect ratio up front, hence the ratio cache below.

document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("work")) return;
    const dataroomSection = document.getElementById("dataroom-dt");
    if (!dataroomSection) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const maxRetries = 20;
    // How much slack a cluster's canvas gets over the combined area of its
    // contents. Higher = airier groups.
    const clusterLooseness = 1.7;
    // Smallest gap left between two clusters, in both axes.
    const clusterGap = 28;
    // Clearance held around a question, against images and other questions.
    const questionPad = 12;

    // image_url -> naturalWidth / naturalHeight. Filled once, reused by every
    // re-render, so the 15s cycle costs nothing after the first pass.
    const ratioCache = new Map();

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Kept as-is from the original: the 0.9 factors let images graze each other
    // by ~10%, which is the density the scatter was tuned around.
    function isOverlapping(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(
            x1 + w1 * 0.9 < x2 ||
            x1 > x2 + w2 * 0.9 ||
            y1 + h1 * 0.9 < y2 ||
            y1 > y2 + h2 * 0.9
        );
    }

    function overlapArea(a, b) {
        const dx = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
        const dy = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
        return dx > 0 && dy > 0 ? dx * dy : 0;
    }

    // A rotated rect covers more ground than its own width/height. Images are
    // rotated in the OG design (Pro forces transform: none), so the question's
    // gap test uses this inflated box and stays clear either way.
    function rotatedBox(width, height, deg) {
        const rad = Math.abs(deg * Math.PI / 180);
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        return {
            width: width * cos + height * sin,
            height: width * sin + height * cos
        };
    }

    function ensureRatios() {
        return Promise.all(workImageData.map((item) => {
            if (ratioCache.has(item.image_url)) return Promise.resolve();
            return new Promise((resolve) => {
                const probe = new Image();
                probe.onload = () => {
                    ratioCache.set(item.image_url, probe.naturalWidth / probe.naturalHeight || 1);
                    resolve();
                };
                // A missing file shouldn't strand the whole layout.
                probe.onerror = () => {
                    ratioCache.set(item.image_url, 1);
                    resolve();
                };
                probe.src = item.image_url;
            });
        }));
    }

    // Questions wrap, so their height can only be had by measuring one.
    function measureQuestion(copy, width) {
        const probe = document.createElement("div");
        probe.classList.add("how-textbox");
        probe.textContent = copy;
        probe.style.position = "absolute";
        probe.style.left = "-9999px";
        probe.style.width = `${width}px`;
        probe.style.visibility = "hidden";
        dataroomSection.appendChild(probe);
        const height = probe.offsetHeight;
        dataroomSection.removeChild(probe);
        return height;
    }

    // Pass 1. One group -> one cluster of images, in coordinates local to that
    // cluster. maxWidth is the widest a cluster may be: nothing may be laid out
    // wider than its column, or rows couldn't guarantee no overlap.
    function buildCluster(group, maxWidth) {
        const items = group.images.map((entry) => {
            const ratio = ratioCache.get(entry.image_url) || 1;
            const targetArea = Math.floor(Math.random() * 30000) + 30000;
            let width = Math.round(Math.sqrt(targetArea * ratio));
            let height = Math.round(width / ratio);

            // Cap against the column before anything else is derived from it.
            const cap = maxWidth * 0.72;
            if (width > cap) {
                height = Math.round(height * (cap / width));
                width = Math.round(cap);
            }

            return {
                url: entry.image_url,
                how: group.how,
                width,
                height,
                rotation: rand(-10, 10)
            };
        });

        const questionWidth = Math.min(
            Math.floor(Math.random() * 100) + 220,
            Math.round(maxWidth * 0.95)
        );
        const question = {
            copy: group.copy,
            width: questionWidth,
            height: measureQuestion(group.copy, questionWidth)
        };

        // A question with no images of its own (id 12) isn't a group at all. It
        // reserves a slot the size of the question itself, sits in it directly,
        // and gets no connector — there's nothing to connect it to.
        if (!items.length) {
            return {
                items: [],
                question,
                solo: true,
                width: question.width,
                height: question.height
            };
        }

        // Size the cluster's canvas from what has to go in it.
        const contentArea = items.reduce((sum, item) => sum + item.width * item.height, 0);
        const spread = contentArea * clusterLooseness;
        const shape = rand(0.75, 1.5);
        let clusterWidth = Math.min(Math.round(Math.sqrt(spread * shape)), Math.round(maxWidth));
        let clusterHeight = Math.round(spread / Math.max(clusterWidth, 1));

        // ...but never smaller than its largest single item.
        items.forEach((item) => {
            clusterWidth = Math.max(clusterWidth, item.width);
            clusterHeight = Math.max(clusterHeight, item.height);
        });

        const placed = [];
        items.forEach((item) => {
            let tries = 0;
            let top, left, overlap;

            do {
                left = Math.round(Math.random() * (clusterWidth - item.width));
                top = Math.round(Math.random() * (clusterHeight - item.height));
                overlap = placed.some((other) =>
                    isOverlapping(left, top, item.width, item.height, other.left, other.top, other.width, other.height)
                );
                tries++;
            } while (overlap && tries < maxRetries);

            // Same fallback as before: shrink and take what we can get.
            if (overlap) {
                item.width = Math.round(item.width * 0.8);
                item.height = Math.round(item.height * 0.8);
                left = Math.round(Math.random() * (clusterWidth - item.width));
                top = Math.round(Math.random() * (clusterHeight - item.height));
            }

            item.left = left;
            item.top = top;
            placed.push(item);
        });

        // Measure the cluster by each image's *rotated* footprint rather than
        // its raw box. A rotated rect sticks out past its own width and height,
        // and the gaps between clusters are only honest if the bounds say so.
        // (Pro forces transform: none, so there this is merely generous.)
        const spans = placed.map((item) => {
            const box = rotatedBox(item.width, item.height, item.rotation);
            return {
                left: item.left + (item.width - box.width) / 2,
                top: item.top + (item.height - box.height) / 2,
                right: item.left + (item.width + box.width) / 2,
                bottom: item.top + (item.height + box.height) / 2
            };
        });

        // Trim to what was actually used, so the cluster's box is tight and the
        // gaps between clusters are real gaps rather than padding.
        const minLeft = Math.min(...spans.map((span) => span.left));
        const minTop = Math.min(...spans.map((span) => span.top));
        placed.forEach((item) => {
            item.left -= minLeft;
            item.top -= minTop;
        });

        return {
            items: placed,
            question,
            solo: false,
            width: Math.ceil(Math.max(...spans.map((span) => span.right)) - minLeft),
            height: Math.ceil(Math.max(...spans.map((span) => span.bottom)) - minTop)
        };
    }

    function shuffle(list) {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }

    // Pass 2. Clusters are dealt into rows of `columns`, and each row is laid out
    // left to right with randomly sized gaps between its members. Because rows
    // occupy disjoint horizontal bands and siblings are laid end to end, no two
    // clusters can overlap — but every gap and every vertical offset is random,
    // so the result doesn't read as a grid.
    //
    // Returns the canvas height the layout needs, which may exceed the height
    // the stylesheet gave us: with overlaps banned, the content dictates how
    // much room it takes.
    function layoutClusters(clusters, containerWidth, containerHeight, columns) {
        const rows = [];
        const order = shuffle(clusters);
        for (let i = 0; i < order.length; i += columns) {
            rows.push(order.slice(i, i + columns));
        }

        // Each row is tall enough for its tallest cluster, plus a reserved slot
        // for that row's tallest question, plus slack to jitter within.
        const heights = rows.map((row) => {
            const tallest = Math.max(...row.map((cluster) => cluster.height));
            const slot = Math.max(...row.map((cluster) => cluster.question.height)) + questionPad * 2;
            return tallest + slot + clusterGap * 2 + rand(30, 110);
        });

        // If the stylesheet's canvas is taller than the content needs, hand the
        // surplus back to the rows so the scatter spreads over the whole thing
        // instead of bunching at the top.
        const natural = heights.reduce((sum, height) => sum + height, 0);
        if (containerHeight > natural) {
            const surplus = containerHeight - natural;
            const weights = heights.map(() => Math.random());
            const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;
            weights.forEach((weight, index) => {
                heights[index] += (weight / total) * surplus;
            });
        }

        let y = 0;
        rows.forEach((row, rowIndex) => {
            const rowHeight = heights[rowIndex];

            // Split the row's leftover width into gaps — one before each cluster
            // and one after the last. Every gap keeps clusterGap for itself and
            // the rest is divided at random, so neighbours are never flush even
            // when the random split hands a gap almost nothing.
            const used = row.reduce((sum, cluster) => sum + cluster.width, 0);
            const gaps = row.length + 1;
            const floor = Math.min(clusterGap, Math.max(0, containerWidth - used) / gaps);
            const slack = Math.max(0, containerWidth - used - floor * gaps);
            const weights = row.map(() => Math.random()).concat([Math.random()]);
            const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;

            let x = 0;
            row.forEach((cluster, index) => {
                x += floor + (weights[index] / total) * slack;
                cluster.left = Math.round(x);
                x += cluster.width;

                // Reserve the question's slot directly above or below the
                // cluster, inside the row. Doing it here rather than hunting for
                // a gap afterwards is what makes a clear spot guaranteed instead
                // of merely likely — the row was sized to hold both.
                const slot = cluster.question.height + questionPad * 2;
                const room = Math.max(0, rowHeight - clusterGap * 2 - slot - cluster.height);
                const jitter = Math.random() * room;

                if (Math.random() < 0.5) {
                    cluster.slotTop = y + clusterGap + jitter;
                    cluster.top = Math.round(cluster.slotTop + slot);
                } else {
                    cluster.top = Math.round(y + clusterGap + jitter);
                    cluster.slotTop = cluster.top + cluster.height;
                }

                cluster.slotHeight = slot;
                cluster.band = { top: y, height: rowHeight };
            });

            y += rowHeight;
        });

        return Math.round(y);
    }

    // Pass 3. Seat each question in the slot layoutClusters() reserved for it,
    // directly above or below its own group. Because the slot sits inside the
    // cluster's own row and, where the question is no wider than its group, is
    // horizontally inside the group's own span, it cannot collide with another
    // cluster or another question — rows are disjoint vertically and siblings
    // are disjoint horizontally. Only a question wider than its group can spill
    // into a neighbour's territory, so that's the one case that has to search.
    function placeQuestions(clusters, containerWidth) {
        const obstacles = clusters.map((cluster) => ({
            left: cluster.left,
            top: cluster.top,
            width: cluster.width,
            height: cluster.height
        }));

        const seated = [];

        clusters.forEach((cluster) => {
            const question = cluster.question;
            question.top = Math.round(cluster.slotTop + questionPad);

            const slack = cluster.width - question.width;

            if (slack >= 0) {
                // Fits within its group's own span: anywhere along it is safe.
                question.left = Math.round(cluster.left + Math.random() * slack);
            } else {
                // Wider than its group. Centre it, then nudge along the row
                // until it's clear of everything, keeping the least-bad offset
                // as a floor so it always ends up somewhere sensible.
                let best = null;
                let bestCost = Infinity;

                for (let tries = 0; tries < maxRetries * 3 && !best; tries++) {
                    const drift = tries === 0 ? 0.5 : Math.random();
                    const left = Math.round(
                        Math.min(
                            Math.max(cluster.left + slack * drift, 0),
                            containerWidth - question.width
                        )
                    );
                    const candidate = { left, top: question.top, width: question.width, height: question.height };
                    const padded = {
                        left: left - questionPad,
                        top: question.top - questionPad,
                        width: question.width + questionPad * 2,
                        height: question.height + questionPad * 2
                    };
                    const cost = obstacles.concat(seated)
                        .reduce((sum, spot) => sum + overlapArea(padded, spot), 0);

                    if (cost === 0) {
                        best = candidate;
                    } else if (cost < bestCost) {
                        bestCost = cost;
                        best = candidate;
                    }
                }

                question.left = best.left;
            }

            seated.push({
                left: question.left,
                top: question.top,
                width: question.width,
                height: question.height
            });
        });
    }

    // Where the line from a question towards (targetX, targetY) crosses the
    // question's own edge — so the connector starts at the box, not under it.
    function edgePoint(box, targetX, targetY) {
        const centreX = box.left + box.width / 2;
        const centreY = box.top + box.height / 2;
        const dx = targetX - centreX;
        const dy = targetY - centreY;
        if (!dx && !dy) return { x: centreX, y: centreY };

        const scaleX = Math.abs(dx) > 0.001 ? (box.width / 2) / Math.abs(dx) : Infinity;
        const scaleY = Math.abs(dy) > 0.001 ? (box.height / 2) / Math.abs(dy) : Infinity;
        const scale = Math.min(scaleX, scaleY);
        return { x: centreX + dx * scale, y: centreY + dy * scale };
    }

    // Pass 4. Write the layout to the DOM.
    function paint(clusters, containerWidth, containerHeight) {
        const lines = document.createElementNS(svgNS, "svg");
        lines.classList.add("how-line-layer");
        lines.setAttribute("width", containerWidth);
        lines.setAttribute("height", containerHeight);
        lines.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        lines.style.opacity = "0";
        dataroomSection.appendChild(lines);

        clusters.forEach((cluster) => {
            cluster.items.forEach((item) => {
                const img = new Image();
                img.src = item.url;
                img.alt = `Work image ${item.how}`;
                img.classList.add("scattered-img");
                img.style.opacity = "0";
                img.style.position = "absolute";
                img.style.width = `${item.width}px`;
                img.style.height = `${item.height}px`;
                img.style.left = `${cluster.left + item.left}px`;
                img.style.top = `${cluster.top + item.top}px`;
                img.style.transform = `rotate(${item.rotation}deg)`;

                dataroomSection.appendChild(img);
                setTimeout(() => {
                    img.style.opacity = "1";
                }, 50);
            });

            const question = cluster.question;
            const box = document.createElement("div");
            box.classList.add("how-textbox");
            box.textContent = question.copy;
            box.style.position = "absolute";
            box.style.zIndex = 10;
            box.style.opacity = "0";
            box.style.width = `${question.width}px`;
            box.style.left = `${question.left}px`;
            box.style.top = `${question.top}px`;
            dataroomSection.appendChild(box);

            if (!cluster.solo) {
                // Aim at the middle of whichever image in the group sits closest
                // to the question, rather than the middle of the group as a
                // whole: the group's centre is often empty space, or behind an
                // image on the far side of it.
                const questionX = question.left + question.width / 2;
                const questionY = question.top + question.height / 2;

                let targetX = cluster.left + cluster.width / 2;
                let targetY = cluster.top + cluster.height / 2;
                let nearest = Infinity;

                cluster.items.forEach((item) => {
                    const x = cluster.left + item.left + item.width / 2;
                    const y = cluster.top + item.top + item.height / 2;
                    const dx = x - questionX;
                    const dy = y - questionY;
                    const distance = dx * dx + dy * dy;

                    if (distance < nearest) {
                        nearest = distance;
                        targetX = x;
                        targetY = y;
                    }
                });

                const start = edgePoint(question, targetX, targetY);

                const line = document.createElementNS(svgNS, "line");
                line.classList.add("how-line");
                line.setAttribute("x1", start.x);
                line.setAttribute("y1", start.y);
                line.setAttribute("x2", targetX);
                line.setAttribute("y2", targetY);
                lines.appendChild(line);
            }

            const delay = 1000 + Math.random() * 500;
            setTimeout(() => {
                box.style.opacity = "1";
                box.style.transition = "opacity 0.8s ease";

                // Trigger flicker animation manually
                box.classList.add("flicker-text");
            }, delay);
        });

        setTimeout(() => {
            lines.style.transition = "opacity 0.8s ease";
            lines.style.opacity = "1";
        }, 1000);
    }

    // related_how ties the two data sets together. A question with no images of
    // its own still gets an entry — just an empty one.
    function collectGroups() {
        return workHowData.map((how) => ({
            how: how.id,
            copy: how.how_copy,
            images: workImageData.filter((item) => item.related_how === how.id)
        }));
    }

    function renderAll() {
        const containerRect = dataroomSection.getBoundingClientRect();
        if (!containerRect.width || !containerRect.height) return;

        dataroomSection
            .querySelectorAll(".scattered-img, .how-textbox, .how-line-layer")
            .forEach((el) => {
                el.style.opacity = "0";
                setTimeout(() => el.remove(), 500);
            });

        ensureRatios().then(() => {
            setTimeout(() => {
                // One column per ~420px of width, so clusters stay a sane size
                // and rows have room for the gaps that keep them from gridding.
                const columns = Math.max(1, Math.min(3, Math.round(containerRect.width / 420)));
                const columnWidth = containerRect.width / columns;

                const clusters = collectGroups()
                    .map((group) => buildCluster(group, columnWidth * 0.86));

                const height = layoutClusters(
                    clusters,
                    containerRect.width,
                    containerRect.height,
                    columns
                );

                // With overlaps banned the content decides how tall the canvas
                // has to be; the stylesheet's height is only a floor.
                dataroomSection.style.minHeight = `${height}px`;

                placeQuestions(clusters, containerRect.width);
                paint(clusters, containerRect.width, height);
            }, 500);
        });
    }

    renderAll();
    // setInterval(renderAll, 15000);
});





// Tooltip popup over work

document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("work")) return;
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
    document.documentElement.toggleAttribute('data-nav-open', isOpen);
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

const modalTriggers = new Map();

document.querySelectorAll('.popup, .locked').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const modal = document.querySelector(targetId);
    const content = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.close');

    // Store the triggering element
    modalTriggers.set(modal, link);

    // Set transform origin
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    content.style.transformOrigin = `${x}% ${y}%`;

    // Show modal
    modal.removeAttribute('inert');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      content.classList.remove('animate-in');
      void content.offsetWidth;
      content.classList.add('animate-in');
    });

    closeButton.focus();
  });
});

document.querySelectorAll('.modal .close').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    const content = modal.querySelector('.modal-content');

    modal.setAttribute('inert', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    content.classList.remove('animate-in');

    // Restore focus
    const trigger = modalTriggers.get(modal);
    if (trigger) trigger.focus();
  });
});


// Show hide blog topics

const toggleLink = document.querySelector('.toggle-link');
if (toggleLink) {
    toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        const list = document.querySelector('.topics-list');
        list.classList.toggle('visible-topics');

        const label = this.querySelector('.toggle-label') || this;
        label.textContent = list.classList.contains('visible-topics')
            ? 'Hide topics⇡'
            : 'Show topics⇣';
    });
}


// Obfuscate contact

document.getElementById("mp-link").setAttribute("href", "tel:+64210473399");
document.getElementById("e-link").setAttribute("href", "mailto:ian.allan.nz@gmail.com");




