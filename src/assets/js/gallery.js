// Shared media gallery: thumbnails, prev/next, touch swipe, full-size image
// lightbox and in-page video (YouTube / Vimeo embeds or native files).
//
// Used by the homepage Project Explorer (projects.js calls
// ProjectGallery.create for each panel) and by project detail pages, where
// galleries outside the explorer are set up automatically below.
// Progressive enhancement: without JavaScript images link to the full-size
// file and videos link to their source.

(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    const animate = (element, keyframes, options) => {
        if (!reducedMotion.matches) {
            element.animate(keyframes, { easing: EASE, ...options });
        }
    };


    /* ---------------- Lightbox ---------------- */

    // One shared <dialog> per page (partials/project/lightbox.njk). Without it,
    // image links simply open the full-size file.
    const lightbox = document.querySelector("[data-lightbox]");
    const lbImage = lightbox?.querySelector("[data-lightbox-image]");
    const lbCaption = lightbox?.querySelector("[data-lightbox-caption]");
    const lbCount = lightbox?.querySelector("[data-lightbox-count]");
    const lbPrev = lightbox?.querySelector("[data-lightbox-prev]");
    const lbNext = lightbox?.querySelector("[data-lightbox-next]");
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

    lightbox?.addEventListener("close", () => {
        document.documentElement.style.overflow = "";
        lbImage.removeAttribute("src");
        lbReturnFocus?.focus();
    });

    lightbox?.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
    lbPrev?.addEventListener("click", () => showLightboxImage(lbIndex - 1));
    lbNext?.addEventListener("click", () => showLightboxImage(lbIndex + 1));

    // The image box fills the viewer (object-fit: contain); true when a click
    // lands in its empty margin rather than on the picture itself
    function outsidePicture(event) {
        const box = lbImage.getBoundingClientRect();
        const scale = Math.min(box.width / lbImage.naturalWidth, box.height / lbImage.naturalHeight);
        const marginX = (box.width - lbImage.naturalWidth * scale) / 2;
        const marginY = (box.height - lbImage.naturalHeight * scale) / 2;
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;

        return x < marginX || x > box.width - marginX || y < marginY || y > box.height - marginY;
    }

    // Click on the dimmed backdrop (outside the image) closes
    lightbox?.addEventListener("click", (event) => {
        if (
            event.target === lightbox ||
            event.target.classList.contains("lightbox-figure") ||
            (event.target === lbImage && lbImage.naturalWidth && outsidePicture(event))
        ) {
            lightbox.close();
        }
    });

    lightbox?.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showLightboxImage(lbIndex - 1);
        } else if (event.key === "ArrowRight") {
            showLightboxImage(lbIndex + 1);
        }
    });

    if (lightbox) {
        onSwipe(lightbox, (direction) => showLightboxImage(lbIndex + direction));
    }


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

    function createGallery(panel, { announce = () => {} } = {}) {
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

        // A strip shows every image at once: nothing to step through
        if (items.length > 1 && !panel.hasAttribute("data-gallery-strip")) {
            onSwipe(stage, (direction) => show(index + direction));
        }

        // Images open the lightbox (the link still works without JavaScript)
        items.forEach((item) => {
            const link = item.querySelector("[data-lightbox-open]");

            link?.addEventListener("click", (event) => {
                if (!lightbox) {
                    return; // no viewer on this page: open the file
                }

                event.preventDefault();
                openLightbox(images, images.findIndex((image) => image.item === item), link);
            });
        });

        // Video: play in place on request (never autoplays on its own)
        panel.querySelectorAll("[data-video]").forEach((video) => {
            const play = video.querySelector("[data-video-play]");

            play.addEventListener("click", (event) => {
                const provider = video.dataset.provider;

                if (
                    (provider !== "youtube" && provider !== "vimeo" && provider !== "file") ||
                    video.dataset.failed
                ) {
                    return; // external, or failed to play here: keep the normal link
                }

                event.preventDefault();
                playVideo(video, announce);
            });
        });

        return { stop };
    }

    function playVideo(container, announce) {
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
            // Created only on Play; nothing is fetched ahead of playback
            player.preload = "none";
            player.addEventListener("loadeddata", () => container.classList.remove("is-loading"), { once: true });
            player.addEventListener("error", () => showVideoError(container, announce), { once: true });
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

    function showVideoError(container, announce) {
        container.querySelector(".gallery-player")?.remove();
        container.classList.remove("is-playing", "is-loading");
        container.closest("[data-gallery-stage]").classList.remove("is-video-playing");

        // From now on Play opens the file itself (in a new tab)
        container.dataset.failed = "true";

        const message = document.createElement("p");
        message.className = "gallery-video-error";
        message.textContent = container.querySelector(".gallery-video-source")
            ? "This video can't be played here. Use the link below to open it."
            : "This video can't be played here. Press Play to open it in a new tab.";
        container.append(message);
        announce(message.textContent);
    }

    function resetVideo(container) {
        container.querySelector(".gallery-player")?.remove();
        container.classList.remove("is-playing", "is-loading");
        container.closest("[data-gallery-stage]").classList.remove("is-video-playing");
    }

    window.ProjectGallery = { create: createGallery };


    // Galleries outside the explorer (project detail pages) set themselves up
    const status = document.querySelector("[data-gallery-status]");
    const announce = (text) => {
        if (status) {
            status.textContent = text;
        }
    };

    document.querySelectorAll("[data-gallery]").forEach((gallery) => {
        if (!gallery.closest("[data-explorer]")) {
            createGallery(gallery, { announce });
        }
    });
})();
