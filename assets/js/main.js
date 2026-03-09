document.addEventListener("DOMContentLoaded", () => {
    const siteHeader = document.getElementById("site-header");
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const copyStatus = document.getElementById("copy-status");
    const yearTarget = document.getElementById("year");

    const closeNav = () => {
        if (!siteNav || !navToggle) {
            return;
        }

        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    };

    if (yearTarget) {
        yearTarget.textContent = String(new Date().getFullYear());
    }

    if (siteHeader) {
        const onScroll = () => {
            siteHeader.classList.toggle("is-scrolled", window.scrollY > 16);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNav);
        });
    }

    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.16
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            const value = button.getAttribute("data-copy");

            if (!value) {
                return;
            }

            try {
                await navigator.clipboard.writeText(value);
                if (copyStatus) {
                    copyStatus.textContent = `${value} copied to clipboard.`;
                }
            } catch (error) {
                if (copyStatus) {
                    copyStatus.textContent = "Clipboard access failed. You can still copy the text manually.";
                }
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!siteNav || !navToggle) {
            return;
        }

        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }

        if (!siteNav.contains(target) && !navToggle.contains(target)) {
            closeNav();
        }
    });
});
