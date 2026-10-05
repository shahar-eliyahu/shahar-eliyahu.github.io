const menuButton = document.querySelector(".menu-button");
const navLinksContainer = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");


// Mobile navigation
menuButton.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
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
const sections = document.querySelectorAll(
    "section[id]"
);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.remove("active");

                if (
                    link.getAttribute("href")
                    === `#${entry.target.id}`
                ) {
                    link.classList.add("active");
                }
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
