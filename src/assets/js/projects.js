// Project explorer: category filters, project picker (ARIA tabs), media
// gallery (thumbnails, prev/next, swipe), image lightbox and in-page video.
//
// Progressive enhancement: without JavaScript the picker items are anchor
// links, every project panel is shown, images link to the full-size file and
// videos link to their source. Nothing here names a project or category.

(() => {
    const root = document.querySelector("[data-explorer]");

    if (!root) {
        return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    const status = root.querySelector("[data-explorer-status]");
    const filterButtons = [...root.querySelectorAll("[data-filter]")];
    const list = root.querySelector("[data-explorer-list]");
    const listItems = [...list.children];
    const tabs = listItems.map((item) => item.querySelector(".explorer-tab"));
    const panels = [...root.querySelectorAll("[data-panel]")];

    const panelFor = (slug) => panels.find((panel) => panel.dataset.project === slug);
    const tabFor = (slug) => tabs.find((tab) => tab.dataset.project === slug);
    const isVisible = (tab) => !tab.closest("li").hidden;
    const visibleTabs = () => tabs.filter(isVisible);

    let current = null;
    let filter = "all";

    const announce = (text) => {
        status.textContent = text;
    };

    const animate = (element, keyframes, options) => {
        if (!reducedMotion.matches) {
            element.animate(keyframes, { easing: EASE, ...options });
        }
    };


    /* ---------------- URL state: ?category=…&project=… ---------------- */

    function syncUrl() {
        const url = new URL(window.location.href);

        // Always write category before project, for consistent URLs
        url.searchParams.delete("category");
        url.searchParams.delete("project");

        if (filter !== "all") {
            url.searchParams.set("category", filter);
        }

        url.searchParams.set("project", current);
        history.replaceState(null, "", url);
    }


    /* ---------------- Project picker (ARIA tabs) ---------------- */

    list.setAttribute("role", "tablist");

    const setOrientation = () =>
        list.setAttribute("aria-orientation", desktop.matches ? "vertical" : "horizontal");

    setOrientation();
    desktop.addEventListener("change", setOrientation);

    listItems.forEach((item) => item.setAttribute("role", "presentation"));

    tabs.forEach((tab) => {
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", `project-${tab.dataset.project}`);
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
    });

    panels.forEach((panel) => {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", `tab-${panel.dataset.project}`);
        panel.tabIndex = -1;
    });

    // Scroll the strip (phones/tablets) so the selected tab is in view,
    // without moving the page vertically.
    function revealTab(tab) {
        if (desktop.matches || list.scrollWidth <= list.clientWidth) {
            return;
        }

        const listBox = list.getBoundingClientRect();
        const tabBox = tab.getBoundingClientRect();

        // Keep clear of the faded edges (12px left, 28px right)
        if (tabBox.left < listBox.left + 12 || tabBox.right > listBox.right - 28) {
            list.scrollBy({
                left: tabBox.left - listBox.left - 16,
                behavior: reducedMotion.matches ? "auto" : "smooth",
            });
        }
    }

    function select(slug, { focus = false, motion = true, updateUrl = true } = {}) {
        const panel = panelFor(slug);
        const tab = tabFor(slug);

        if (!panel || !tab) {
            return;
        }

        if (slug !== current) {
            if (current) {
                galleries.get(panelFor(current))?.stop();
            }

            tabs.forEach((t) => {
                const selected = t === tab;
                t.setAttribute("aria-selected", String(selected));
                t.tabIndex = selected ? 0 : -1;
            });

            panels.forEach((p) => {
                const selected = p === panel;
                p.classList.toggle("is-selected", selected);
                p.hidden = !selected;
            });

            if (motion) {
                animate(panel, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 280 });
            }

            current = slug;
        }

        revealTab(tab);

        if (focus) {
            tab.focus();
        }

        if (updateUrl) {
            syncUrl();
        }
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();
            select(tab.dataset.project);
        });

        // Arrow keys move between visible projects (both orientations)
        tab.addEventListener("keydown", (event) => {
            const visible = visibleTabs();
            const index = visible.indexOf(tab);
            const target = {
                ArrowDown: visible[(index + 1) % visible.length],
                ArrowRight: visible[(index + 1) % visible.length],
                ArrowUp: visible[(index - 1 + visible.length) % visible.length],
                ArrowLeft: visible[(index - 1 + visible.length) % visible.length],
                Home: visible[0],
                End: visible[visible.length - 1],
            }[event.key];

            if (target) {
                event.preventDefault();
                select(target.dataset.project, { focus: true });
            }
        });
    });


    /* ---------------- Category filters ---------------- */

    const matches = (element, f) =>
        f === "all" || element.dataset.categories.split(" ").includes(f);

    const filterLabel = (f) =>
        filterButtons.find((b) => b.dataset.filter === f)?.firstChild.textContent.trim();

    function applyFilter(f, { silent = false, updateUrl = true } = {}) {
        if (!filterButtons.some((b) => b.dataset.filter === f)) {
            f = "all";
        }

        filter = f;

        filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === f)));
        listItems.forEach((item) => (item.hidden = !matches(item, f)));

        // Number projects within the visible list (01, 02, …), keeping the order
        listItems.filter((item) => !item.hidden).forEach((item, i) => {
            item.querySelector(".explorer-tab-index").textContent = String(i + 1).padStart(2, "0");
        });

        // Always keep a valid selection: the first visible project if the
        // current one was filtered out
        const visible = visibleTabs();

        if (!visible.some((tab) => tab.dataset.project === current)) {
            select(visible[0].dataset.project, { updateUrl: false });
        }

        listItems.filter((item) => !item.hidden).forEach((item, i) => {
            animate(item, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, delay: i * 30, fill: "backwards" });
        });

        if (!silent) {
            const count = visible.length;
            const noun = count === 1 ? "project" : "projects";
            const name = tabFor(current).querySelector(".explorer-tab-name").textContent;
            announce(f === "all"
                ? `Showing all ${count} ${noun}. Selected: ${name}`
                : `Showing ${count} ${noun} in ${filterLabel(f)}. Selected: ${name}`);
        }

        if (updateUrl) {
            syncUrl();
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.getAttribute("aria-pressed") !== "true") {
                applyFilter(button.dataset.filter);
            }
        });
    });


    /* ---------------- Lightbox ---------------- */

    const lightbox = root.querySelector("[data-lightbox]");
    const lbImage = lightbox.querySelector("[data-lightbox-image]");
    const lbCaption = lightbox.querySelector("[data-lightbox-caption]");
    const lbCount = lightbox.querySelector("[data-lightbox-count]");
    const lbPrev = lightbox.querySelector("[data-lightbox-prev]");
    const lbNext = lightbox.querySelector("[data-lightbox-next]");
    let lbImages = [];
    let lbIndex = 0;
    let lbReturnFocus = null;

    function showLightboxImage(index) {
        lbIndex = (index + lbImages.length) % lbImages.length;
        const image = lbImages[lbIndex];

        lbImage.src = image.src;
        lbImage.alt = image.alt;
        lbCaption.textContent = image.caption || image.alt;
        lbCount.textContent = `Image ${lbIndex + 1} of ${lbImages.length}`;
        lbPrev.hidden = lbNext.hidden = lbImages.length < 2;
    }

    function openLightbox(images, index, trigger) {
        lbImages = images;
        lbReturnFocus = trigger;
        showLightboxImage(index);
        document.documentElement.style.overflow = "hidden";
        lightbox.showModal();
        lightbox.querySelector("[data-lightbox-close]").focus();
    }

    lightbox.addEventListener("close", () => {
        document.documentElement.style.overflow = "";
        lbImage.removeAttribute("src");
        lbReturnFocus?.focus();
    });

    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
    lbPrev.addEventListener("click", () => showLightboxImage(lbIndex - 1));
    lbNext.addEventListener("click", () => showLightboxImage(lbIndex + 1));

    // Click on the dimmed backdrop (outside the image) closes
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox || event.target.classList.contains("lightbox-figure")) {
            lightbox.close();
        }
    });

    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showLightboxImage(lbIndex - 1);
        } else if (event.key === "ArrowRight") {
            showLightboxImage(lbIndex + 1);
        }
    });

    onSwipe(lightbox, (direction) => showLightboxImage(lbIndex + direction));


    /* ---------------- Gallery ---------------- */

    function onSwipe(element, callback) {
        let startX = null;
        let startY = null;
        let swiped = false;

        element.addEventListener("pointerdown", (event) => {
            swiped = false;

            if (event.pointerType !== "mouse") {
                startX = event.clientX;
                startY = event.clientY;
            }
        });

        element.addEventListener("pointerup", (event) => {
            if (startX === null) {
                return;
            }

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            startX = null;

            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped = true;
                callback(dx < 0 ? 1 : -1);
            }
        });

        element.addEventListener("pointercancel", () => {
            startX = null;
        });

        // A swipe must not also count as a tap on the image link
        element.addEventListener("click", (event) => {
            if (swiped) {
                swiped = false;
                event.preventDefault();
                event.stopPropagation();
            }
        }, true);
    }

    function createGallery(panel) {
        const items = [...panel.querySelectorAll("[data-gallery-item]")];
        const thumbs = [...panel.querySelectorAll("[data-gallery-thumb]")];
        const indexLabel = panel.querySelector("[data-gallery-index]");
        const stage = panel.querySelector("[data-gallery-stage]");
        const images = items
            .filter((item) => item.dataset.kind === "image")
            .map((item) => ({ item, src: item.dataset.src, alt: item.dataset.alt, caption: item.dataset.caption }));
        let index = 0;

        function stop() {
            panel.querySelectorAll("[data-video].is-playing").forEach(resetVideo);
        }

        function show(next) {
            if (items.length < 2) {
                return;
            }

            const target = (next + items.length) % items.length;

            if (target === index) {
                return;
            }

            stop();
            items[index].hidden = true;
            items[target].hidden = false;
            animate(items[target], [{ opacity: 0 }, { opacity: 1 }], { duration: 220 });

            thumbs.forEach((thumb, i) => {
                if (i === target) {
                    thumb.setAttribute("aria-current", "true");
                } else {
                    thumb.removeAttribute("aria-current");
                }
            });

            index = target;
            indexLabel.textContent = String(index + 1);
            announce(thumbs[index]?.getAttribute("aria-label") || "");
        }

        thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => show(i)));
        panel.querySelector("[data-gallery-prev]")?.addEventListener("click", () => show(index - 1));
        panel.querySelector("[data-gallery-next]")?.addEventListener("click", () => show(index + 1));

        if (items.length > 1) {
            onSwipe(stage, (direction) => show(index + direction));
        }

        // Images open the lightbox (the link still works without JavaScript)
        items.forEach((item) => {
            const link = item.querySelector("[data-lightbox-open]");

            link?.addEventListener("click", (event) => {
                event.preventDefault();
                openLightbox(images, images.findIndex((image) => image.item === item), link);
            });
        });

        // Video: play in place on request (never autoplays on its own)
        panel.querySelectorAll("[data-video]").forEach((video) => {
            const play = video.querySelector("[data-video-play]");

            play.addEventListener("click", (event) => {
                const provider = video.dataset.provider;

                if (provider !== "youtube" && provider !== "vimeo" && provider !== "file") {
                    return; // external: keep the normal link
                }

                event.preventDefault();
                playVideo(video);
            });
        });

        return { stop };
    }

    function playVideo(container) {
        const provider = container.dataset.provider;
        const title = container.dataset.title;
        let player;

        container.classList.add("is-playing", "is-loading");
        container.closest("[data-gallery-stage]").classList.add("is-video-playing");
        container.querySelector(".gallery-video-error")?.remove();

        if (provider === "file") {
            player = document.createElement("video");
            player.src = container.dataset.src;
            player.controls = true;
            player.playsInline = true;
            player.preload = "metadata";
            player.addEventListener("loadeddata", () => container.classList.remove("is-loading"), { once: true });
            player.addEventListener("error", () => showVideoError(container), { once: true });
            player.play?.().catch(() => {}); // user-initiated; ignore if the browser declines
        } else {
            player = document.createElement("iframe");
            player.src = container.dataset.embed;
            player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
            player.allowFullscreen = true;
            player.referrerPolicy = "strict-origin-when-cross-origin";
            player.addEventListener("load", () => container.classList.remove("is-loading"), { once: true });
        }

        player.className = "gallery-player";
        player.title = title;
        container.prepend(player);
        player.focus();
    }

    function showVideoError(container) {
        container.querySelector(".gallery-player")?.remove();
        container.classList.remove("is-playing", "is-loading");
        container.closest("[data-gallery-stage]").classList.remove("is-video-playing");

        const message = document.createElement("p");
        message.className = "gallery-video-error";
        message.textContent = "This video can't be played here. Use the link below to open it.";
        container.append(message);
        announce(message.textContent);
    }

    function resetVideo(container) {
        container.querySelector(".gallery-player")?.remove();
        container.classList.remove("is-playing", "is-loading");
        container.closest("[data-gallery-stage]").classList.remove("is-video-playing");
    }

    const galleries = new Map(panels.map((panel) => [panel, createGallery(panel)]));


    /* ---------------- Initial state from the URL ---------------- */

    const params = new URLSearchParams(window.location.search);
    const requestedFilter = params.get("category") || "all";
    const requestedProject = params.get("project");

    current = null;
    select(tabs[0].dataset.project, { motion: false, updateUrl: false });
    applyFilter(requestedFilter, { silent: true, updateUrl: false });

    if (requestedProject && tabFor(requestedProject) && isVisible(tabFor(requestedProject))) {
        select(requestedProject, { motion: false, updateUrl: false });
    }
})();
