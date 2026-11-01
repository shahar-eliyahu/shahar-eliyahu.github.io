// Project explorer: category filters and project picker (ARIA tabs). Each
// panel's media gallery, the lightbox and the in-page video come from the
// shared assets/js/gallery.js (also used by the project detail pages).
//
// Progressive enhancement: without JavaScript the picker items are anchor
// links, every project panel is shown, images link to the full-size file and
// videos link to their source. Nothing here names a project or category.

(() => {
    const root = document.querySelector("[data-explorer]");

    if (!root || !window.ProjectGallery) {
        return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    // Desktop list: as tall as the selected preview, showing the complete entries
    // that fit plus a sliver of the next one as a hint that there are more. An
    // unusually tall preview can't stretch it past this many window heights.
    const LIST_PEEK = 0.35;
    const LIST_MAX_WINDOWS = 1.25;

    const status = root.querySelector("[data-explorer-status]");
    const filterRow = root.querySelector("[data-project-filters]");
    const filterButtons = [...root.querySelectorAll("[data-filter]")];
    const list = root.querySelector("[data-explorer-list]");
    const listItems = [...list.children];
    const tabs = listItems.map((item) => item.querySelector(".explorer-tab"));
    const panels = [...root.querySelectorAll("[data-panel]")];
    const panelArea = root.querySelector(".explorer-panels");

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
    desktop.addEventListener("change", () => {
        setOrientation();
        fitList();
        revealTab(tabFor(current), false);
    });

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

    // Scroll a swipeable row (phones) so an item is in view, without moving
    // the page vertically. Does nothing if the row doesn't scroll, the item is
    // already clear of the faded edges (12px left, 28px right), or the row is
    // already at that end (the first and last items rest in the fade there).
    function revealIn(row, item) {
        if (!row || !item || row.scrollWidth <= row.clientWidth) {
            return;
        }

        const rowBox = row.getBoundingClientRect();
        const itemBox = item.getBoundingClientRect();
        const atStart = row.scrollLeft <= 0;
        const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 1;

        if ((itemBox.left < rowBox.left + 12 && !atStart) || (itemBox.right > rowBox.right - 28 && !atEnd)) {
            row.scrollBy({
                left: itemBox.left - rowBox.left - 16,
                behavior: reducedMotion.matches ? "auto" : "smooth",
            });
        }
    }

    // Desktop: the selected preview sets the room available. If all the visible
    // entries fit they simply end; otherwise the list stops at the last entry that
    // fits (plus the hint) and scrolls. Only the list changes, never the preview, so
    // this can't feed back into its own measurement. Returns true if the height changed.
    function fitList() {
        const visible = listItems.filter((item) => !item.hidden);
        const panel = panelFor(current);

        if (!desktop.matches || !panel || !visible.length) {
            list.classList.remove("is-capped");
            return false;
        }

        list.style.setProperty("--explorer-list-gutter", `${list.offsetWidth - list.clientWidth}px`);

        const room = Math.min(panel.getBoundingClientRect().height, window.innerHeight * LIST_MAX_WINDOWS);
        const first = visible[0].offsetTop;
        const last = visible[visible.length - 1];
        const capped = last.offsetTop + last.offsetHeight - first > room;
        const before = list.classList.contains("is-capped") ? list.style.getPropertyValue("--explorer-list-max") : "";
        let after = "";

        if (capped) {
            let height = 0;

            visible.slice(1).forEach((item) => {
                const candidate = item.offsetTop - first + item.offsetHeight * LIST_PEEK;

                if (!height || candidate <= room) {
                    height = candidate;
                }
            });

            after = `${height}px`;
            list.style.setProperty("--explorer-list-max", after);
        }

        list.classList.toggle("is-capped", capped);

        return before !== after;
    }

    // Scroll the capped list (never the page) so an entry is fully in view. Measured
    // from the rendered boxes and rounded outward, because entry heights are fractional
    // and whole-pixel measurements (offsetTop) left entries clipped by up to a pixel.
    function revealInList(tab, smooth) {
        const box = list.getBoundingClientRect();
        const entry = tab.getBoundingClientRect();
        const above = entry.top - box.top;
        const below = entry.bottom - box.bottom;
        const target = above < 0 ? Math.floor(list.scrollTop + above) : below > 0 ? Math.ceil(list.scrollTop + below) : null;

        if (target !== null) {
            list.scrollTo({ top: target, behavior: smooth && !reducedMotion.matches ? "smooth" : "auto" });
        }
    }

    // Keep the selection visible: the capped list (desktop) or the strip (phones/tablets)
    function revealTab(tab, smooth = true) {
        if (desktop.matches) {
            revealInList(tab, smooth);
        } else {
            revealIn(list, tab);
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

        // The new preview may have a different height
        fitList();
        revealTab(tab, motion);

        if (focus) {
            tab.focus({ preventScroll: desktop.matches });
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
        // The chosen chip, whether tapped or restored from the URL (phones)
        revealIn(filterRow, filterButtons.find((b) => b.dataset.filter === f));
        listItems.forEach((item) => (item.hidden = !matches(item, f)));

        // Number projects within the visible list (01, 02, …), keeping the order
        listItems.filter((item) => !item.hidden).forEach((item, i) => {
            item.querySelector(".explorer-tab-index").textContent = String(i + 1).padStart(2, "0");
        });

        fitList();

        // Always keep a valid selection: the first visible project if the
        // current one was filtered out
        const visible = visibleTabs();

        if (!visible.some((tab) => tab.dataset.project === current)) {
            select(visible[0].dataset.project, { updateUrl: false });
        }

        // A new list starts from the top, with the selection still in view
        if (desktop.matches) {
            list.scrollTop = 0;
            revealInList(tabFor(current), false);
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


    /* ---------------- Media galleries (shared: assets/js/gallery.js) ---------------- */

    const galleries = new Map(panels.map((panel) => [panel, window.ProjectGallery.create(panel, { announce })]));


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

    // The preview's height can change after selection (images, fonts, width), and
    // entry heights with the width. Keep the selection in view if the list changes.
    function refitList() {
        if (fitList()) {
            revealTab(tabFor(current), false);
        }
    }

    window.addEventListener("resize", refitList);
    document.fonts?.ready.then(refitList);

    if ("ResizeObserver" in window) {
        new ResizeObserver(refitList).observe(panelArea);
    }
})();
