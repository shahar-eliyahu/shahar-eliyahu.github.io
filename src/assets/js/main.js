const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

const navbar = document.querySelector(".navbar");
const progressBar = document.querySelector(".scroll-progress");
const menuButton = document.querySelector(".menu-button");
const navLinksContainer = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const onHomepage = [...navLinks].some((link) => link.getAttribute("href").startsWith("#"));


// Mobile navigation
function setMenuOpen(isOpen) {
    navLinksContainer.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
}

menuButton.addEventListener("click", () => {
    setMenuOpen(!navLinksContainer.classList.contains("open"));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setMenuOpen(false);
    });
});


// Navbar state + scroll progress
let scrollTicking = false;

function updateScrollState() {
    const scrollTop = window.scrollY;
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    navbar.classList.toggle("scrolled", scrollTop > 20);

    // At the very bottom a short last section (Contact) may never reach the
    // observer's band on tall screens, so highlight its link explicitly.
    if (onHomepage && isAtBottom()) {
        const allSections = document.querySelectorAll("section[id]");
        setActiveLink(allSections[allSections.length - 1]?.id);
    }

    scrollTicking = false;
}

function isAtBottom() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 && window.scrollY >= maxScroll - 2;
}

function setActiveLink(id) {
    if (!id) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
}

window.addEventListener(
    "scroll",
    () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollState);
            scrollTicking = true;
        }
    },
    { passive: true }
);

updateScrollState();


// Staggered reveal delays. data-stagger="3" restarts the stagger every
// 3 items, so each row of a grid reveals left to right without long waits.
document.querySelectorAll("[data-stagger]").forEach((group) => {
    const cycle = Number(group.dataset.stagger) || Infinity;

    group.querySelectorAll(".reveal").forEach((element, index) => {
        element.style.setProperty("--delay", `${(index % cycle) * 0.12}s`);
    });
});


// Reveal content on scroll
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


// About basketball: draws itself once when it comes into view (CSS does the
// drawing and skips it for reduced motion). Hidden on phones, so never triggered there.
const aboutBall = document.querySelector("[data-about-ball]");

if (aboutBall) {
    const ballObserver = new IntersectionObserver(
        ([entry], observer) => {
            if (entry.isIntersecting) {
                aboutBall.classList.add("is-drawn");
                observer.disconnect();
            }
        },
        {
            threshold: 0.35,
        }
    );

    ballObserver.observe(aboutBall);
}


// Highlight active navigation section (homepage only: on other pages the nav
// links point back home and "Projects" is marked as current in the markup)
const sections = onHomepage ? document.querySelectorAll("section[id]") : [];

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            // At the bottom the last section stays active (see updateScrollState)
            if (entry.isIntersecting && !isAtBottom()) {
                setActiveLink(entry.target.id);
            }
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px",
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});


// Project pages: mark the section being read in "On this page". Everything comes
// from the links and sections on the page. A section counts once its top passes a
// line near the top of the window. Short sections at the very end may never reach
// that line, so it slides down over the last stretch of scrolling and meets the
// final section exactly at the end of the page.
const tocEntries = [...document.querySelectorAll('.project-toc a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((entry) => entry.section);

if (tocEntries.length) {
    const aside = document.querySelector(".project-aside");
    // The nav's own height changes as it shrinks, so the line uses the fixed token
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height"));
    let active = null;
    let clicked = null;
    let settledAt = null;
    let settleTimer = null;
    let lastMovedAt = 0;
    let frame = 0;

    const entryFor = (hash) => tocEntries.find((entry) => entry.link.hash === hash) || null;

    function setActive(entry) {
        if (entry === active) {
            return;
        }

        active?.link.removeAttribute("aria-current");
        entry.link.setAttribute("aria-current", "location");
        active = entry;

        // A column too tall for the window scrolls itself to keep the marker in view
        if (aside.scrollHeight > aside.clientHeight) {
            const link = entry.link.getBoundingClientRect();
            const box = aside.getBoundingClientRect();

            if (link.top < box.top) {
                aside.scrollTop -= box.top - link.top;
            } else if (link.bottom > box.bottom) {
                aside.scrollTop += link.bottom - box.bottom;
            }
        }
    }

    function sectionBeingRead() {
        const tops = tocEntries.map((entry) => entry.section.getBoundingClientRect().top);
        const remaining = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
        const baseLine = navHeight + window.innerHeight * 0.25;
        const lastTopAtEnd = tops[tops.length - 1] - remaining;
        const line = baseLine + Math.max(0, lastTopAtEnd - baseLine + 1 - remaining);

        let reading = tocEntries[0];

        tops.forEach((top, index) => {
            if (top <= line) {
                reading = tocEntries[index];
            }
        });

        return reading;
    }

    function updateActive() {
        frame = 0;

        // A chosen section stays marked until the visitor scrolls away from it
        if (clicked && settledAt !== null && Math.abs(window.scrollY - settledAt) > 4) {
            clicked = null;
        }

        setActive(clicked || sectionBeingRead());
    }

    function scheduleUpdate() {
        frame ||= requestAnimationFrame(updateActive);
    }

    // The jump to a chosen section has finished once scrolling pauses. The first
    // wait is longer, because a jump can take a moment to start.
    function waitForSettle(delay = 150) {
        lastMovedAt = window.scrollY;
        clearTimeout(settleTimer);

        settleTimer = setTimeout(() => {
            settledAt = window.scrollY;

            // Scrolled away during the jump: the section never arrived, so go back to tracking
            if (clicked) {
                const box = clicked.section.getBoundingClientRect();
                const atEnd = document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 2;

                if (!atEnd && (box.top > window.innerHeight / 2 || box.bottom < navHeight)) {
                    clicked = null;
                    scheduleUpdate();
                }
            }
        }, delay);
    }

    function follow(entry) {
        if (entry) {
            clicked = entry;
            settledAt = null;
            waitForSettle(400);
            setActive(entry);
        }
    }

    tocEntries.forEach((entry) => {
        entry.link.addEventListener("click", () => follow(entry));
    });

    window.addEventListener("hashchange", () => follow(entryFor(window.location.hash)));

    window.addEventListener(
        "scroll",
        () => {
            // A pixel or two of movement doesn't count as still scrolling
            if (clicked && settledAt === null && Math.abs(window.scrollY - lastMovedAt) > 4) {
                waitForSettle();
            }

            scheduleUpdate();
        },
        { passive: true }
    );

    window.addEventListener("resize", scheduleUpdate);

    if ("ResizeObserver" in window) {
        new ResizeObserver(scheduleUpdate).observe(document.querySelector(".project-main"));
    }

    follow(entryFor(window.location.hash));
    updateActive();
}


// Skills: "Show more" reveals the rest of a category's technologies in place.
// Each category toggles on its own; CSS hides the extras only while collapsed.
document.querySelectorAll("[data-skill-toggle]").forEach((button) => {
    const row = button.closest(".skill-row");
    const label = button.querySelector("[data-toggle-label]");
    const collapsedLabel = label.textContent;

    button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") !== "true";

        button.setAttribute("aria-expanded", String(expanded));
        row.classList.toggle("is-expanded", expanded);
        label.textContent = expanded ? "Show less" : collapsedLabel;
    });
});


// Pointer effects (desktop only)
if (canHover && !prefersReducedMotion) {

    // Hero spotlight follows the cursor
    const hero = document.querySelector(".hero");

    hero?.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        hero.style.setProperty("--hx", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--hy", `${event.clientY - rect.top}px`);
    });
}


// Contact mascot (partials/contact-mascot.njk). State lives in data
// attributes that CSS turns into poses and faces:
//   data-mood: idle · email (Email Me hovered / focused) · approve (Download
//              CV, GitHub or LinkedIn) · cheer (entrance)
//   data-entrance: pending → playing → done (once per page load)
// One-shot moves (entrance, nods, the entrance tap) are Web Animations that are
// cancelled whenever the state changes, so quick pointer moves can't stack up.
// Reduced motion: moods still change the face, but nothing moves.
const mascot = document.querySelector("[data-mascot]");

if (mascot) {
    const contact = mascot.closest(".contact");
    const email = mascot.closest(".contact-email-wrap").querySelector(".contact-email");
    const buttons = [...contact.querySelectorAll(".contact-buttons .button")];
    const body = mascot.querySelector(".mascot-body");
    const head = mascot.querySelector(".mascot-head");
    const hands = mascot.querySelector(".mascot-hands");
    const rightHand = mascot.querySelector(".mascot-hand.is-right");
    const eyes = mascot.querySelector(".mascot-eyes");
    const moves = !prefersReducedMotion && "animate" in Element.prototype;

    let hovered = null;
    let focused = null;
    let active = null;
    let encourageTimer = 0;
    let lookFrame = 0;
    let nod = null;
    let entrance = [];

    // Eyes: up to ~2.5px toward a point (full reach from ~120px away)
    const look = (x, y) => {
        mascot.style.setProperty("--look-x", x.toFixed(2));
        mascot.style.setProperty("--look-y", y.toFixed(2));
    };

    const lookAt = (x, y) => {
        if (!moves) return;

        const rect = eyes.getBoundingClientRect();
        const dx = x - (rect.left + rect.width / 2);
        const dy = y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = 2.5 * Math.min(1, distance / 120);

        look((dx / distance) * reach, (dy / distance) * reach * 0.8);
    };

    const centre = (element) => {
        const rect = element.getBoundingClientRect();
        return [rect.left + rect.width / 2, rect.top + rect.height / 2];
    };

    // Nods: a little dip of the head, twice for "yes, yes!", once to approve
    const NODS = {
        twice: [
            { transform: "none" },
            { transform: "translateY(3.5px) rotate(2deg)", offset: 0.2 },
            { transform: "translateY(-1px) rotate(0deg)", offset: 0.42 },
            { transform: "translateY(3px) rotate(-1.5deg)", offset: 0.64 },
            { transform: "translateY(-0.5px)", offset: 0.84 },
            { transform: "none" },
        ],
        once: [
            { transform: "none" },
            { transform: "translateY(2.5px) rotate(1.5deg)", offset: 0.4 },
            { transform: "translateY(-0.5px)", offset: 0.75 },
            { transform: "none" },
        ],
    };

    const playNod = (frames, duration) => {
        nod?.cancel();
        if (moves) nod = head.animate(frames, { duration, easing: "ease-in-out" });
    };

    const endEntrance = () => {
        entrance.forEach((animation) => animation.cancel());
        entrance = [];
        mascot.dataset.entrance = "done";
    };

    // Apply the reaction for whichever button is hovered (or keyboard-focused)
    const update = () => {
        const target = hovered || focused;
        if (target === active) return;

        // An interaction always wins over the entrance
        if (target && mascot.dataset.entrance === "playing") endEntrance();

        active = target;
        clearTimeout(encourageTimer);
        nod?.cancel();

        if (!target) {
            mascot.dataset.mood = "idle";
            delete mascot.dataset.point;
            look(0, 0);
            return;
        }

        lookAt(...centre(target));

        if (target === email) {
            mascot.dataset.mood = "email";
            delete mascot.dataset.point;

            // Still here after 2 seconds: an enthusiastic "yes, yes!"
            encourageTimer = setTimeout(() => playNod(NODS.twice, 760), 2000);
        } else {
            mascot.dataset.mood = "approve";
            mascot.dataset.point = centre(target)[0] < centre(eyes)[0] ? "left" : "right";
            playNod(NODS.once, 420);
        }
    };

    buttons.forEach((button) => {
        // Hover from a mouse or pen only; a tap goes straight to the link
        button.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "touch") return;
            hovered = button;
            update();
        });

        button.addEventListener("pointerleave", () => {
            if (hovered !== button) return;
            hovered = null;
            update();
        });

        // Keyboard focus only (a tap can focus a link too)
        button.addEventListener("focus", () => {
            if (!button.matches(":focus-visible")) return;
            focused = button;
            update();
        });

        button.addEventListener("blur", () => {
            if (focused !== button) return;
            focused = null;
            update();
        });
    });

    // Eyes follow the pointer around the contact band (mouse / trackpad only),
    // unless a button already has the mascot's attention
    if (canHover && moves) {
        contact.addEventListener("pointermove", (event) => {
            if (active) return;

            cancelAnimationFrame(lookFrame);
            lookFrame = requestAnimationFrame(() => lookAt(event.clientX, event.clientY));
        });

        contact.addEventListener("pointerleave", () => {
            cancelAnimationFrame(lookFrame);
            if (!active) look(0, 0);
        });
    }

    // Entrance, once, when the Email Me button comes into view: pop up from
    // behind it with a grin, tap the button, settle into the usual peek
    const playEntrance = () => {
        mascot.dataset.entrance = "playing";
        mascot.dataset.mood = "cheer";

        const timing = { duration: 1250, delay: 250, fill: "backwards" };

        entrance = [
            body.animate([
                { transform: "translateY(36px)" },
                { transform: "translateY(-9px) rotate(2deg)", offset: 0.28, easing: "ease-out" },
                { transform: "translateY(-6px) rotate(-4deg)", offset: 0.5 },
                { transform: "translateY(-6px) rotate(-4deg)", offset: 0.72, easing: "ease-in-out" },
                { transform: "none" },
            ], { ...timing, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" }),
            hands.animate([
                { opacity: 0, transform: "translateY(5px)" },
                { opacity: 1, transform: "none", offset: 0.3 },
                { opacity: 1, transform: "none" },
            ], timing),
            // the right hand points down at the button: two quick taps
            rightHand.animate([
                { transform: "none" },
                { transform: "none", offset: 0.4 },
                { transform: "translate(2px, -6px) rotate(20deg)", offset: 0.5 },
                { transform: "translateY(0.5px)", offset: 0.6 },
                { transform: "translate(2px, -4px) rotate(14deg)", offset: 0.68 },
                { transform: "none", offset: 0.8 },
                { transform: "none" },
            ], timing),
        ];

        entrance[0].finished.then(() => {
            endEntrance();
            if (!active) mascot.dataset.mood = "idle";
        }, () => {});
    };

    if (!moves || !("IntersectionObserver" in window)) {
        mascot.dataset.entrance = "done";
    } else {
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;

            observer.disconnect();
            if (active) endEntrance();
            else playEntrance();
        }, { threshold: 0.6 });

        observer.observe(email);
    }
}
