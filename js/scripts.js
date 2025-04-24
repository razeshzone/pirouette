
    
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const maxDisplacement = 50; // Maximum displacement range for mouse movement (can adjust this)

      document.querySelectorAll('.content-section').forEach(section => {
        // Loop through each section
        section.querySelectorAll('.parallax-container').forEach(container => {
          const shape = container.querySelector('.parallax-shape');
          const scrollSpeed = parseFloat(container.dataset.scrollSpeed) || 0.5;
          const mouseSpeed = parseFloat(container.dataset.mouseSpeed) || 0.1;

          // Scroll animation on the container
          gsap.to(container, {
            yPercent: scrollSpeed * 100,
            rotation: scrollSpeed * 360,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: section, // Attach to the current section
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true
            }
          });

          // Mouse movement on the shape (with unique mouseSpeed for each shape)
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

          section.addEventListener('mousemove', (e) => {
            // Each shape has its own movement based on mouseSpeed
            mouseX = (e.clientX / window.innerWidth - 0.5) * maxDisplacement;
            mouseY = (e.clientY / window.innerHeight - 0.5) * maxDisplacement;
          });
        });
      });
    }