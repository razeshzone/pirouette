if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const maxDisplacement = 50;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Helper: Animate parallax shape appearance
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

  // Helper: Animate each container's scroll & mouse effect
  const applyParallaxEffect = () => {
    document.querySelectorAll('.parallax-container').forEach(container => {
      const shape = container.querySelector('.parallax-shape');
      const scrollSpeed = parseFloat(container.dataset.scrollSpeed) || 0.5;
      const mouseSpeed = parseFloat(container.dataset.mouseSpeed) || 0.1;

      // Ensuring transform-origin for the shape (set to the center)
      shape.style.transformOrigin = "center center";

      // Apply rotation only to the parallax container
      gsap.to(container, {
        yPercent: scrollSpeed * 100,
        // rotation: scrollSpeed * 360,  // Apply rotation to the container
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: container.closest('.content-section'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // Prevent rotation on the parallax-shape itself
      gsap.set(shape, {
        rotation: 0,      // Explicitly reset rotation on the shape
        transform: 'none' // Ensure no inherited transform is affecting the shape
      });

      // Mouse movement animation (applied to the shape, but no rotation)
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
        const throttle = 20; // milliseconds

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

// Icons
gsap.from(".icon-inside", {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: "back.out(1.7)",
  stagger: 0.15,
  delay: 0.2
});

// Feature Boxes
gsap.from(".feature-box", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  stagger: 0.2,
  delay: 0.4
});

gsap.from(".featured-section h2", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.2
});

// Hover effect
document.querySelectorAll('.feature-box').forEach((box) => {
  const innerContent = box.querySelectorAll('.inner');
  const hoverTl = gsap.timeline({ paused: true });

  hoverTl.to(box, {
    y: -10,
    boxShadow: '0px 12px 24px rgba(0,0,0,0.1)',
    duration: 0.3,
    ease: 'power2.out'
  });

  if (innerContent.length > 0) {
    hoverTl.from(innerContent, {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.2,
      ease: 'power2.out'
    }, '<');
  }

  box.addEventListener('mouseenter', () => hoverTl.play());
  box.addEventListener('mouseleave', () => hoverTl.reverse());
});
