(function () {
  var prefixText = "We build";
  var phrases = ["brands.", "products.", "experience."];

  var prefixEl = document.getElementById("typewriter-prefix");
  var dynamicEl = document.getElementById("typewriter");
  var caret = document.getElementById("caret");
  var body = document.body;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  var phraseIndex = 0;
  var charIndex = 0;
  var prefixIndex = 0;

  var typingSpeed = 50;
  var deletingSpeed = 30;
  var pauseAfterType = 450;
  var pauseAfterDelete = 120;

  function revealRest() {
    body.classList.add("revealed");
    if (caret) {
      caret.classList.add("done");
    }
    enableScroll();
  }

  function disableScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function enableScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  disableScroll();

  // Support for users who prefer reduced motion
  if (reduceMotion) {
    if (prefixEl) prefixEl.textContent = prefixText;
    if (dynamicEl) dynamicEl.textContent = phrases[phrases.length - 1];
    revealRest();
    return;
  }

  // 1. Type the static prefix first ("We build")
  function typePrefix() {
    if (!prefixEl) {
      // Fallback if element is not found
      setTimeout(tick, 300);
      return;
    }

    if (prefixIndex < prefixText.length) {
      prefixEl.textContent += prefixText.charAt(prefixIndex);
      prefixIndex++;
      setTimeout(typePrefix, typingSpeed);
    } else {
      // Prefix typing done, pause briefly then start cycling dynamic phrases
      setTimeout(tick, 300);
    }
  }

  // 2. Type dynamic suffixes ("experiences.", "products.", etc.)
  function tick() {
    if (!dynamicEl) {
      revealRest();
      return;
    }

    var current = phrases[phraseIndex];
    var isLastPhrase = phraseIndex === phrases.length - 1;

    if (charIndex <= current.length) {
      dynamicEl.textContent = current.slice(0, charIndex);
      charIndex++;
      setTimeout(tick, typingSpeed);
      return;
    }

    // Finished typing the last phrase, proceed to reveal the rest of the page
    if (isLastPhrase) {
      setTimeout(revealRest, 400);
      return;
    }

    // Wait and erase the current phrase
    setTimeout(function () {
      eraseTick(current);
    }, pauseAfterType);
  }

  // 3. Erase the current dynamic phrase
  function eraseTick(current) {
    if (charIndex > 0) {
      charIndex--;
      dynamicEl.textContent = current.slice(0, charIndex);
      setTimeout(function () {
        eraseTick(current);
      }, deletingSpeed);
      return;
    }
    // Proceed to next phrase
    phraseIndex++;
    setTimeout(tick, pauseAfterDelete);
  }

  // Kick off the sequence on page load
  document.addEventListener("DOMContentLoaded", function () {
    if (!prefixEl || !dynamicEl) {
      revealRest();
    } else {
      typePrefix();
    }

    // 1. Infinite marquee track logic with smooth hover deceleration
    var marqueeTrack = document.querySelector(".marquee-track");
    if (marqueeTrack) {
      var targetSpeed = 0.4;
      var speed = 0.4;
      var currentX = 0;

      marqueeTrack.addEventListener("mouseenter", function () {
        targetSpeed = 0.1; // Smoothly decelerate to 0.1 on hover
      });

      marqueeTrack.addEventListener("mouseleave", function () {
        targetSpeed = 0.4; // Smoothly accelerate back to 0.4
      });

      function animateMarquee() {
        // Interpolate speed for buttery transitions
        speed += (targetSpeed - speed) * 0.05;
        currentX -= speed;
        var firstBlock = marqueeTrack.children[0];
        if (firstBlock) {
          if (Math.abs(currentX) >= firstBlock.offsetWidth) {
            currentX += firstBlock.offsetWidth;
          }
        }
        marqueeTrack.style.transform = "translateX(" + currentX + "px)";
        requestAnimationFrame(animateMarquee);
      }

      animateMarquee();
    }

    // 2. Scroll listener to toggle scrolled-nav class (smooth CSS transition)
    var navbar = document.querySelector(".navbar");
    if (navbar) {
      window.addEventListener(
        "scroll",
        function () {
          if (window.scrollY > 50) {
            navbar.classList.add("scrolled-nav");
          } else {
            navbar.classList.remove("scrolled-nav");
          }
        },
        { passive: true },
      );
    }

    // 2b. About section now reveals via the standard .reveal fade-in (no carpet animation)

    // 3. iOS-inspired snapping custom cursor
    var cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      var isAimCursor = document.body.classList.contains("aim-cursor");
      var mouseX = 0,
        mouseY = 0;
      var currentXCursor = 0,
        currentYCursor = 0;
      var isHovering = false;

      // Track raw mouse position
      window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Show cursor only when mouse moves onto window
      document.addEventListener("mouseenter", function () {
        cursor.style.opacity = "1";
      });
      document.addEventListener("mouseleave", function () {
        cursor.style.opacity = "0";
      });
    }

    // 4. Page transition curtain controls
    document.querySelectorAll("a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
      ) {
        // Robust relative link detection (works perfectly locally under file:// or servers)
        var isInternal =
          !href.startsWith("http://") &&
          !href.startsWith("https://") &&
          !href.startsWith("//");
        if (isInternal) {
          link.addEventListener("click", function (e) {
            e.preventDefault();

            // Prevent double clicks
            document.body.style.pointerEvents = "none";

            var curtain = document.querySelector(".curtain-wipe");
            if (curtain) {
              // Disable the entrance CSS animation
              curtain.style.animation = "none";
              // Reset curtain to the right side instantly without transition
              curtain.style.transition = "none";
              curtain.style.transform = "translateX(100%) skewX(-12deg)";
              curtain.getBoundingClientRect(); // force layout reflow

              // Slide in to center (snappy 450ms transition)
              curtain.style.transition =
                "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
              curtain.style.transform = "translateX(0%) skewX(-12deg)";
            }

            setTimeout(function () {
              window.location.href = href;
            }, 450); // 0.45s matches the transition duration
          });
        }
      }
    });

    // 5. Dark/Light Theme Toggle Control
    var toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var isDark = document.documentElement.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }

    // 5b. Resume Panel Overlay Toggle & Detail Expanders
    var viewResumeBtn = document.querySelector(".view-resume-trigger");
    var resumePanel = document.getElementById("resume-panel");
    var closePanelBtn = document.querySelector(".resume-panel-close");
    var panelBackdrop = document.querySelector(".resume-panel-backdrop");

    var pocketContainer = document.querySelector(".resume-pocket-container");
    var detailedViewer = document.getElementById("detailed-resume-viewer");
    var resumePanelContent = document.querySelector(".resume-panel-content");
    var backBtn = document.querySelector(".back-to-pocket-btn");
    var modalHeading = document.querySelector("#resume-panel h2");
    var modalSub = document.querySelector("#resume-panel p.mono");
    var printBtn = document.querySelector(".print-resume-action");

    if (viewResumeBtn && resumePanel) {
      viewResumeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        resumePanel.classList.add("active");
        document.body.style.overflow = "hidden"; // disable body scroll while panel is open
        resumePanel.scrollTop = 0;
        resetToPocket();
      });
    }

    function resetActiveResumeScroll() {
      var scrollContainers = document.querySelectorAll(".detail-resume-image");
      scrollContainers.forEach(function (container) {
        container.scrollTop = 0;
      });
    }

    function closeResumePanel() {
      if (resumePanel) {
        resumePanel.classList.remove("active");
        document.body.style.overflow = ""; // restore body scroll
      }
    }

    if (closePanelBtn) {
      closePanelBtn.addEventListener("click", closeResumePanel);
    }
    if (panelBackdrop) {
      panelBackdrop.addEventListener("click", closeResumePanel);
    }

    // Stacked card clicks inside the pocket
    var cards = document.querySelectorAll(".resume-card-wrapper");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var person = card.getAttribute("data-person");
        if (person) {
          showDetailedResume(person);
        }
      });
    });

    if (backBtn) {
      backBtn.addEventListener("click", resetToPocket);
    }

    function showDetailedResume(person) {
      // Hide pocket elements
      if (pocketContainer) pocketContainer.classList.add("hidden");
      if (modalSub) modalSub.style.display = "none";
      if (modalHeading)
        modalHeading.textContent =
          person.charAt(0).toUpperCase() + person.slice(1) + "'s Resume";
      if (printBtn) {
        printBtn.style.display = "inline-block";
        printBtn.setAttribute("onclick", "window.print()");
      }
      // Contain the tall resume viewer inside the card instead of letting it
      // spill past the rounded edges (the pocket needs overflow:visible for
      // its fan-out effect, but the resume viewer needs to be clipped/scrollable)
      if (resumePanelContent)
        resumePanelContent.classList.add("viewing-detail");

      resetActiveResumeScroll();
      if (resumePanel) resumePanel.scrollTop = 0;

      // Show viewer and specific resume
      if (detailedViewer) {
        detailedViewer.classList.add("active");
        var details = detailedViewer.querySelectorAll(
          ".detailed-resume-content",
        );
        details.forEach(function (d) {
          d.classList.remove("active");
        });
        var targetDetail = document.getElementById("detail-" + person);
        if (targetDetail) {
          targetDetail.classList.add("active");
          var targetScroller = targetDetail.querySelector(
            ".detail-resume-image",
          );
          if (targetScroller) targetScroller.scrollTop = 0;
        }
      }
    }

    function resetToPocket() {
      // Show pocket elements
      if (pocketContainer) pocketContainer.classList.remove("hidden");
      if (modalSub) modalSub.style.display = "block";
      if (modalHeading) modalHeading.textContent = "Our Team Resumes";
      if (printBtn) printBtn.style.display = "none";
      if (resumePanelContent)
        resumePanelContent.classList.remove("viewing-detail");
      resetActiveResumeScroll();
      if (resumePanel) resumePanel.scrollTop = 0;

      // Hide viewer and detail contents
      if (detailedViewer) {
        detailedViewer.classList.remove("active");
        var details = detailedViewer.querySelectorAll(
          ".detailed-resume-content",
        );
        details.forEach(function (d) {
          d.classList.remove("active");
        });
      }
    }
    // 5c. Project browser: sidebar-driven panel switching
    var projectPanels = document.querySelectorAll("[data-panel]");
    var projectSidebarItems = document.querySelectorAll(
      ".project-sidebar-item",
    );

    // 5c-i. Carousel setup: auto-cycling images inside the active panel
    function initProjectCarousel(node) {
      var root = node.querySelector("[data-carousel]");
      if (!root || root.dataset.carouselInit) return null;
      root.dataset.carouselInit = "true";

      var track = root.querySelector(".project-media-track");
      var slides = root.querySelectorAll(".project-media-slide");
      var dots = root.querySelectorAll(".project-media-dots button");
      var prevBtn = root.querySelector(".project-media-nav.prev");
      var nextBtn = root.querySelector(".project-media-nav.next");
      var index = 0;
      var timer = null;
      var AUTO_MS = 3200;

      function render() {
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        render();
      }

      function next() {
        goTo(index + 1);
      }

      function prev() {
        goTo(index - 1);
      }

      function startAuto() {
        stopAuto();
        if (slides.length > 1) {
          timer = window.setInterval(next, AUTO_MS);
        }
      }

      function stopAuto() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          goTo(i);
          startAuto();
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          next();
          startAuto();
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          prev();
          startAuto();
        });
      }

      root.addEventListener("mouseenter", stopAuto);
      root.addEventListener("mouseleave", startAuto);

      render();

      return { start: startAuto, stop: stopAuto };
    }

    var projectCarousels = new Map();

    function showProjectPanel(id) {
      projectPanels.forEach(function (panel) {
        var isMatch = panel.dataset.panel === id;
        panel.classList.toggle("is-active", isMatch);

        if (isMatch) {
          if (!projectCarousels.has(panel)) {
            projectCarousels.set(panel, initProjectCarousel(panel));
          }
          var carousel = projectCarousels.get(panel);
          if (carousel) carousel.start();
        } else {
          var existing = projectCarousels.get(panel);
          if (existing) existing.stop();
        }
      });

      projectSidebarItems.forEach(function (item) {
        item.classList.toggle("is-active", item.dataset.project === id);
      });
    }

    projectSidebarItems.forEach(function (item) {
      item.addEventListener("click", function () {
        showProjectPanel(item.dataset.project);
      });
    });

    // Initialize the carousel for whichever panel starts active.
    var initialPanel = document.querySelector(
      ".project-viewer-panel.is-active",
    );
    if (initialPanel && initialPanel.dataset.panel) {
      showProjectPanel(initialPanel.dataset.panel);
    }

    // 5c. Center-Outward Scramble Text Animation
    function scrambleText(element, originalText, duration) {
      if (element.classList.contains("scrambling")) return;
      element.classList.add("scrambling");

      var N = originalText.length;
      var glyphs = "!@#$%^&*()_+[]{}<>?1234567890ABCDEF";

      // Generate reveal order (center-outward)
      var indices = [];
      var mid = Math.floor(N / 2);
      var left = mid - 1;
      var right = mid;
      while (left >= 0 || right < N) {
        if (right < N) {
          indices.push(right);
          right++;
        }
        if (left >= 0) {
          indices.push(left);
          left--;
        }
      }

      var start = null;
      var revealMap = {};
      for (var j = 0; j < N; j++) {
        var charIndex = indices[j];
        revealMap[charIndex] = (j / N) * (duration - 400);
      }

      function animate(timestamp) {
        if (!start) start = timestamp;
        var elapsed = timestamp - start;

        var currentString = "";
        for (var i = 0; i < N; i++) {
          var origChar = originalText[i];
          if (origChar === " ") {
            currentString += " ";
          } else if (elapsed >= revealMap[i]) {
            currentString += origChar;
          } else {
            currentString += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }

        element.textContent = currentString;

        if (elapsed < duration + 100) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = originalText;
          element.classList.remove("scrambling");
        }
      }

      requestAnimationFrame(animate);
    }

    var scrambleTriggers = document.querySelectorAll(".scramble-trigger");
    scrambleTriggers.forEach(function (el) {
      var origText = el.textContent.trim();

      // On load (runs once slowly, no hover repeating)
      setTimeout(function () {
        scrambleText(el, origText, 1800);
      }, 500);
    });

    if (cursor) {
      // Smooth custom cursor positioning (lerping) when floating freely
      function updateCursor() {
        if (!isHovering) {
          currentXCursor += (mouseX - currentXCursor) * 0.18;
          currentYCursor += (mouseY - currentYCursor) * 0.18;

          cursor.style.left = currentXCursor + "px";
          cursor.style.top = currentYCursor + "px";
          if (isAimCursor) {
            cursor.style.width = "22px";
            cursor.style.height = "22px";
          } else {
            cursor.style.width = "8px";
            cursor.style.height = "8px";
            cursor.style.borderRadius = "50%";
          }
          cursor.style.transform = "translate(-50%, -50%)";
        }
        requestAnimationFrame(updateCursor);
      }
      updateCursor();

      // snap to interactive elements
      var interactives = document.querySelectorAll(
        "a, button, .work-card, nav a, .nav-cta, .skill-badge",
      );
      interactives.forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          isHovering = true;
          cursor.classList.add("hovering");

          var rect = el.getBoundingClientRect();
          // Snap custom cursor precisely to the center of the hovered element
          cursor.style.left = rect.left + rect.width / 2 + "px";
          cursor.style.top = rect.top + rect.height / 2 + "px";
          var padding = isAimCursor ? 14 : 10;
          cursor.style.width = rect.width + padding + "px";
          cursor.style.height = rect.height + padding + "px";

          if (!isAimCursor) {
            var style = window.getComputedStyle(el);
            cursor.style.borderRadius = style.borderRadius || "8px";
          }
        });

        el.addEventListener("mouseleave", function () {
          isHovering = false;
          cursor.classList.remove("hovering");
          // Instantly align lerped coordinates to current mouse position to prevent cursor jump back
          currentXCursor = mouseX;
          currentYCursor = mouseY;
        });
      });
    }

    // 5d. Contact form — builds and opens a pre-filled email to kcbianzon@gmail.com
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
      var formStatus = document.getElementById("form-status");
      var CONTACT_EMAIL = "kcbianzon@gmail.com";

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = contactForm.querySelector("#name").value.trim();
        var email = contactForm.querySelector("#email").value.trim();
        var projectType = contactForm.querySelector("#project-type").value;
        var message = contactForm.querySelector("#message").value.trim();

        if (!name || !email || !message) {
          if (formStatus) {
            formStatus.textContent =
              "Please fill in your name, email, and message.";
            formStatus.classList.remove("is-success");
            formStatus.classList.add("is-error");
          }
          return;
        }

        var subject =
          "New project inquiry from " + name + " (" + projectType + ")";
        var body =
          "Name: " +
          name +
          "\n" +
          "Email: " +
          email +
          "\n" +
          "Project type: " +
          projectType +
          "\n\n" +
          message;

        var mailtoLink =
          "mailto:" +
          CONTACT_EMAIL +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);

        window.location.href = mailtoLink;

        if (formStatus) {
          formStatus.textContent =
            "Opening your email app to send this to " + CONTACT_EMAIL + "…";
          formStatus.classList.remove("is-error");
          formStatus.classList.add("is-success");
        }
      });
    }
  });
})();
