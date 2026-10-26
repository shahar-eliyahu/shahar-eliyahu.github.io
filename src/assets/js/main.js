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


// Pointer effects (desktop only)
if (canHover && !prefersReducedMotion) {

    // Hero spotlight follows the cursor
    const hero = document.querySelector(".hero");

    hero?.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        hero.style.setProperty("--hx", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--hy", `${event.clientY - rect.top}px`);
    });


    // Spotlight on skill cards
    document.querySelectorAll(".skill-category").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();

            card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
            card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        });
    });
}
