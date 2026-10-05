// Sticky navbar shadow
const navbar = document.querySelector(".navbar");

function updateNavbar() {
    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateNavbar);

updateNavbar();


// Reveal elements while scrolling
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


// Highlight current navbar section
const sections = document.querySelectorAll(
    "header[id], section[id]"
);

const navLinks = document.querySelectorAll(
    ".nav-links a"
);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.remove("active");

                const target = link.getAttribute("href");

                if (target === `#${entry.target.id}`) {
                    link.classList.add("active");
                }
            });
        });
    },
    {
        rootMargin: "-30% 0px -60% 0px",
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});
