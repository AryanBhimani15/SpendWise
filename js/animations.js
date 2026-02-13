// GSAP animations and scroll triggers

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: 'nav' }
    });

    // Hero animations
    gsap.to('.trust-badge', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
    gsap.to('.hero h1', { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
    gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6, delay: 0.6 });
    gsap.to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, delay: 0.8 });
    gsap.to('.hero-cta-group', { opacity: 1, y: 0, duration: 0.6, delay: 1 });
    gsap.to('.hero-visual', { opacity: 1, scale: 1, duration: 1, delay: 0.6 });

    // Stats section
    gsap.utils.toArray('.stat-item-large').forEach((stat, i) => {
        gsap.to(stat, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // How it works cards
    gsap.utils.toArray('.how-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}