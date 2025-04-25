
//matchHeight js
$(function() {
  $('.matchHeight').matchHeight();
});

//animations
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const maxDisplacement = 50;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Animate parallax shape entrance
  const animateShapeEntrance = () => {
    gsap.utils.toArray(".parallax-shape").forEach((shape, i) => {
      gsap.to(shape, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: "power2.out"
      });
    });
  };

  // Animate parallax scroll & mouse
  const applyParallaxEffect = () => {
    document.querySelectorAll('.parallax-container').forEach(container => {
      const shape = container.querySelector('.parallax-shape');
      const scrollSpeed = parseFloat(container.dataset.scrollSpeed) || 0.5;
      const mouseSpeed = parseFloat(container.dataset.mouseSpeed) || 0.1;

      shape.style.transformOrigin = "center center";

      // Scroll-based movement (disabled rotation)
      gsap.to(container, {
        yPercent: scrollSpeed * 100,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: container.closest('.content-section'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // Mouse movement animation (only on desktop)
      if (!isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        const updatePosition = () => {
          currentX += (mouseX - currentX) * mouseSpeed;
          currentY += (mouseY - currentY) * mouseSpeed;

          gsap.set(shape, {
            x: currentX,
            y: currentY
          });

          requestAnimationFrame(updatePosition);
        };
        updatePosition();

        let lastMove = 0;
        const throttle = 20;

        document.addEventListener('mousemove', (e) => {
          const now = Date.now();
          if (now - lastMove < throttle) return;
          lastMove = now;

          mouseX = (e.clientX / window.innerWidth - 0.5) * maxDisplacement;
          mouseY = (e.clientY / window.innerHeight - 0.5) * maxDisplacement;
        });
      }
    });
  };

  animateShapeEntrance();
  applyParallaxEffect();
}

// ✅ Feature Box Animation (Intro)
// Run only on tablet & desktop
if (window.innerWidth >= 768) {

  // ✅ Feature Box Animation (Intro)
  gsap.utils.toArray(".feature-box").forEach((box, i) => {
    const icon = box.querySelector(".icon-inside");
    const inner = box.querySelector(".inner");

    // Icon scale-in animation
    if (icon) {
      gsap.set(icon, { opacity: 1, scale: 5 });

      gsap.to(icon, {
        scale: 1,
        opacity: 1,
        duration: 1,
        delay: i * 0.2,
        ease: "power3.out"
      });
    }

    // Inner content fade-in
    if (inner) {
      const items = inner.children;

      gsap.from(items, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        delay: i * 0.2 + 0.9,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(items, { clearProps: "all" });
        }
      });
    }
  });

  // ✅ Hover Effects (Only for non-touch screens)
  document.querySelectorAll('.feature-box').forEach((box) => {
    const innerItems = box.querySelectorAll('.inner > *');
    const hoverTl = gsap.timeline({ paused: true });

    hoverTl.to(box, {
      y: -10,
      boxShadow: '0px 12px 24px rgba(0,0,0,0.15)',
      duration: 0.3,
      ease: 'power2.out'
    });

    hoverTl.to(innerItems, {
      y: -5,
      duration: 0.2,
      stagger: 0.05,
      ease: 'power1.out'
    }, "<");

    box.addEventListener('mouseenter', () => hoverTl.play());
    box.addEventListener('mouseleave', () => hoverTl.reverse());
  });
}

