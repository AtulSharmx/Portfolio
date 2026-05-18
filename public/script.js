document.body.classList.add("loader-active");

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  let settled = false;

  const revealHero = () => {
    document.querySelectorAll("#hero .reveal-up").forEach((el, idx) => {
      setTimeout(() => el.classList.add("visible"), 130 * idx);
    });
  };

  const finishLoading = () => {
    if (settled) return;
    settled = true;
    document.body.classList.remove("loader-active");
    revealHero();
  };

  if (!loader) {
    finishLoading();
    return;
  }

  const transitionDone = (event) => {
    if (event.target !== loader || event.propertyName !== "opacity") return;
    loader.removeEventListener("transitionend", transitionDone);
    loader.style.display = "none";
    finishLoading();
  };

  loader.addEventListener("transitionend", transitionDone);

  requestAnimationFrame(() => {
    loader.classList.add("hidden");
  });

  setTimeout(() => {
    if (!settled) {
      loader.style.display = "none";
      finishLoading();
    }
  }, 900);
});

const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursorFollower");

if (cursor && follower) {
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let ticking = false;
  let overInteractive = false;
  const darkSectionsInView = new Set();

  const applyCursorPalette = () => {
    const isDark = darkSectionsInView.size > 0;

    if (overInteractive) {
      cursor.style.background = "var(--accent)";
      follower.style.borderColor = "var(--accent)";
      return;
    }

    cursor.style.background = isDark ? "#fff" : "var(--ink)";
    follower.style.borderColor = isDark ? "#fff" : "var(--ink)";
  };

  const updateCursor = () => {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  };

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateCursor();
          ticking = false;
        });
      }
    },
    { passive: true }
  );

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      overInteractive = true;
      cursor.style.transform = "translate(-50%, -50%) scale(2)";
      follower.style.transform = "translate(-50%, -50%) scale(0.5)";
      applyCursorPalette();
    });

    el.addEventListener("mouseleave", () => {
      overInteractive = false;
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      follower.style.transform = "translate(-50%, -50%) scale(1)";
      applyCursorPalette();
    });
  });

  const darkPanels = document.querySelectorAll(".panel-dark, .panel-hype");
  const colorObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          darkSectionsInView.add(entry.target);
        } else {
          darkSectionsInView.delete(entry.target);
        }
      });
      applyCursorPalette();
    },
    { threshold: 0.35 }
  );

  darkPanels.forEach((panel) => colorObserver.observe(panel));
  applyCursorPalette();
}

const revealEls = document.querySelectorAll(".reveal-up");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((el) => {
  if (!el.closest("#hero")) revealObserver.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

const projectBlocks = document.querySelectorAll(".project-block");
const projObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), 80);
        projObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
projectBlocks.forEach((block) => projObserver.observe(block));

const sketchGuy = document.querySelector(".sketch-guy");
if (sketchGuy) {
  let t = 0;
  setInterval(() => {
    t += 0.05;
    sketchGuy.style.transform = `translateY(${4 * Math.sin(t)}px)`;
  }, 30);
}

(() => {
  const trigger = document.getElementById("kmChatTrigger");
  const overlay = document.getElementById("kmChatOverlay");
  const popup = document.getElementById("kmChatPopup");
  const closeBtn = document.getElementById("kmChatClose");
  if (!trigger || !overlay || !popup || !closeBtn) return;

  const openChat = () => {
    document.body.classList.add("km-chat-open");
    overlay.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
  };

  const closeChat = () => {
    document.body.classList.remove("km-chat-open");
    overlay.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeChat();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("km-chat-open")) {
      closeChat();
    }
  });
})();
