document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Animations skipped.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ==================================================
       1. MAGNETIC BUTTONS
       Buttons slightly pull towards the user's cursor
       ================================================== */
    const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta, .demo-btn, .scroll-btn');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, { 
                x: x * 0.3, 
                y: y * 0.3, 
                duration: 0.4, 
                ease: "power2.out" 
            });
        });

        btn.addEventListener('mouseleave', () => {
            // Snap back to center
            gsap.to(btn, { 
                x: 0, 
                y: 0, 
                duration: 0.7, 
                ease: "elastic.out(1, 0.3)" 
            });
        });
    });

    /* ==================================================
       2. 3D CARD TILT TRACKING
       Cards tilt physically based on mouse position
       ================================================== */
    const tiltCards = document.querySelectorAll('.card-item, .stack-card, .floating-card-hero, .demo-card-item');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.4
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                rotationX: 0, 
                rotationY: 0, 
                duration: 0.7, 
                ease: "elastic.out(1, 0.3)" 
            });
        });
    });

    /* ==================================================
       3. GSAP SCROLL REVEALS
       Elements assemble themselves beautifully on scroll
       ================================================== */
    
    // Staggered fade up for grid cards (How it works, Stats, Features)
    const staggerGrids = ['.how-grid', '.stats-grid', '.dashboard-grid', '.trust-grid'];
    
    staggerGrids.forEach(grid => {
        const element = document.querySelector(grid);
        if (element) {
            gsap.from(element.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.2)"
            });
        }
    });

    // Continuous Levitation for Hero Cards
    gsap.utils.toArray('.floating-card-hero').forEach((card, i) => {
        gsap.to(card, {
            y: "-=20",
            rotationZ: "+=2",
            duration: 2 + (i * 0.5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    });
});