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

    scrollTicking = false;
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


// Staggered reveal delays
document.querySelectorAll("[data-stagger]").forEach((group) => {
    group.querySelectorAll(".reveal").forEach((element, index) => {
        element.style.setProperty("--delay", `${index * 0.12}s`);
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


// Highlight active navigation section
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px",
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});


// Hero detection box: count confidence up
const confidence = document.querySelector(".confidence");

if (confidence && !prefersReducedMotion) {
    const target = parseFloat(confidence.textContent);
    const duration = 900;
    const startDelay = 1800;

    confidence.textContent = "0.00";

    setTimeout(() => {
        const start = performance.now();

        function step(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);

            confidence.textContent = (target * eased).toFixed(2);

            if (t < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }, startDelay);
}


// Pointer effects (desktop only)
if (canHover && !prefersReducedMotion) {

    // Hero spotlight follows the cursor
    const hero = document.querySelector(".hero");

    hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        hero.style.setProperty("--hx", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--hy", `${event.clientY - rect.top}px`);
    });


    // 3D tilt + glare on project visuals
    document.querySelectorAll(".project-visual").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
            card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
            card.style.setProperty("--mx", `${x * 100}%`);
            card.style.setProperty("--my", `${y * 100}%`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
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
