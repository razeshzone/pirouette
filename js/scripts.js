
//matchHeight js
$(document).ready(function() {
  // hamburger
  $(".hamburger").click(function(){
    $(this).toggleClass("is-active");
});
// Initialize matchHeight once the DOM is ready
  const initMatchHeight = () => {
    // Apply matchHeight to all elements you want to synchronize
    $('.matchHeight').matchHeight();
    // Re-initialize matchHeight when the window is resized
    $(window).on('resize', function() {
      $('.matchHeight').matchHeight();
    });
  };
  // Call the initialization function
  initMatchHeight();

  // Handle logout click
$('.logout').on('click', function (e) {
  e.preventDefault();

  const $dropdownMenu = $(this).closest('.dropdown-menu');
  const $form = $('#login-form');
  const $links = $('.loggedin-link');

  // Measure current and target widths
  const currentWidth = $dropdownMenu.outerWidth();
  $links.hide();
  $form.css({ display: 'block', opacity: 0 });
  const targetWidth = $dropdownMenu.outerWidth();

  // Revert back temporarily to measure
  $form.hide();
  $links.show();

  // Animate width change
  gsap.to($dropdownMenu, {
    width: targetWidth,
    duration: 0.3,
    ease: "power2.inOut"
  });

  // Animate logout links fade out
  gsap.to($links, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      $links.hide();
      $form.show();
      gsap.fromTo($form, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  });
});

});

//Dropdown animation
// Function to check if the device supports touch
function isTouchDevice() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

// Function to animate the dropdown menu
function animateDropdown($menu, show = true) {
  if (show) {
    gsap.fromTo($menu,
      {opacity: 0, y: 10, scale: 0.98},
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
        clearProps: "opacity,transform"
      }
    );
  } else {
    gsap.to($menu, {
      opacity: 0,
      y: 10,
      scale: 0.98,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        $menu.removeClass('show'); // Bootstrap cleanup
      }
    });
  }
}

// Bootstrap click triggers for regular dropdown items
$('.dropdown').not(':last-child').on('show.bs.dropdown', function () {
  const $menu = $(this).find('.dropdown-menu').first();
  $menu.addClass('show'); // Important: force Bootstrap to position it correctly
  animateDropdown($menu, true);
});

$('.dropdown').not(':last-child').on('hide.bs.dropdown', function () {
  const $menu = $(this).find('.dropdown-menu').first();
  animateDropdown($menu, false);
});

// Handle the last dropdown (login form) - show only on click
$('.dropdown:last-child').on('show.bs.dropdown', function () {
  const $menu = $(this).find('.dropdown-menu').first();
  $menu.addClass('show'); // Important: force Bootstrap to position it correctly
  animateDropdown($menu, true);
});

$('.dropdown:last-child').on('hide.bs.dropdown', function () {
  const $menu = $(this).find('.dropdown-menu').first();
  animateDropdown($menu, false);
});

// Hover support for non-touch devices for all dropdowns except the last one
if (!isTouchDevice()) {
  $('.dropdown').not(':last-child').each(function () {
    const $dropdown = $(this);
    const $menu = $dropdown.find('.dropdown-menu').first();

    $dropdown.hover(
      function () {
        $dropdown.addClass('show');
        $menu.addClass('show');
        animateDropdown($menu, true);
      },
      function () {
        animateDropdown($menu, false);
        setTimeout(() => {
          $dropdown.removeClass('show');
        }, 200);
      }
    );
  });
}

//keep dropdown login form visible
$(document).ready(function () {
  const $dropdownMenu = $('.dropdown-menu');
  const $form = $('#login-form');
  const $links = $('.loggedin-link');

  // Show login form on clicking "Login"
  $('.dropdown-item').click(function (e) {
    if ($(this).text().trim().toLowerCase() === 'login') {
      e.preventDefault();
      $form.show().css({ opacity: 1 });
      $links.hide();
      $dropdownMenu.scrollTop($dropdownMenu[0].scrollHeight);
    }
  });

  // Prevent dropdown from closing on click inside
  $dropdownMenu.on('click', function (e) {
    e.stopPropagation();
  });

  // Handle login form submit
  $form.on('submit', function (e) {
    e.preventDefault();

    // Animate transition to logged-in view
    gsap.to($form, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        $form.hide();
        $links.css({ display: 'flex', opacity: 0 });
        gsap.to($links, { opacity: 1, duration: 0.3 });

        // Auto-close dropdown after 10 seconds
        setTimeout(() => {
          $('.dropdown').removeClass('show');
          $dropdownMenu.removeClass('show');
        }, 10000);
      }
    });
  });

  // Handle logout click
  $(document).on('click', '.logout', function (e) {
    e.preventDefault();

    // Animate transition back to login form
    gsap.to($links, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        $links.hide();
        $form.show().css({ opacity: 0 });
        gsap.to($form, { opacity: 1, duration: 0.3 });
      }
    });
  });
});


// Animation on scroll
// Ensure GSAP and ScrollTrigger are loaded
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const maxDisplacement = 50;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Animate parallax shape entrance
  const animateShapeEntrance = () => {
    gsap.utils.toArray(".parallax-shape").forEach((shape, i) => {
      gsap.fromTo(shape, {
        opacity: 0,
        scale: 0.9,
        y: 30
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: "power2.out"
      });
    });
  };

  // Apply independent parallax effect to each shape
  const applyParallaxEffect = () => {
    document.querySelectorAll('.parallax-container').forEach(container => {
      const shape = container.querySelector('.parallax-shape');
      const scrollSpeed = parseFloat(container.dataset.scrollSpeed) || 0.5; // Custom scroll speed for each shape
      const mouseSpeed = parseFloat(container.dataset.mouseSpeed) || 0.1;  // Custom mouse speed for each shape

      shape.style.transformOrigin = "center center";

      // Scroll-based parallax (each shape moves independently)
      gsap.to(shape, {
        yPercent: -scrollSpeed * 100, // Individual scroll-based movement
        ease: "none",
        scrollTrigger: {
          trigger: container.closest('.content-section'),
          start: 'top bottom', // starts when the section comes into view
          end: 'bottom top',  // ends when the section leaves the view
          scrub: 1, // smoothens the scrolling effect
          invalidateOnRefresh: true
        }
      });

      // Mouse movement parallax (only for non-touch devices)
      if (!isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        const updateMouseMovement = () => {
          currentX += (mouseX - currentX) * mouseSpeed;
          currentY += (mouseY - currentY) * mouseSpeed;

          gsap.set(shape, { x: currentX, y: currentY });
          requestAnimationFrame(updateMouseMovement);
        };
        updateMouseMovement();

        document.addEventListener('mousemove', (e) => {
          mouseX = (e.clientX / window.innerWidth - 0.5) * maxDisplacement;
          mouseY = (e.clientY / window.innerHeight - 0.5) * maxDisplacement;
        });
      }
    });
  };

  // Call animation functions
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

