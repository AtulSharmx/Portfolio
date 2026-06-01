// ============ PAGE LOADER ============
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

  if (!loader) { finishLoading(); return; }

  const transitionDone = (e) => {
    if (e.target !== loader || e.propertyName !== "opacity") return;
    loader.removeEventListener("transitionend", transitionDone);
    loader.style.display = "none";
    finishLoading();
  };

  loader.addEventListener("transitionend", transitionDone);
  requestAnimationFrame(() => loader.classList.add("hidden"));

  // Fallback in case transitionend doesn't fire
  setTimeout(() => {
    if (!settled) { loader.style.display = "none"; finishLoading(); }
  }, 900);
});

// ============ CUSTOM CURSOR ============
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursorFollower");

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
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

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        ticking = false;
      });
    }
  }, { passive: true });

  // Smooth follower with RAF — stops when tab hidden to save CPU
  let followerRaf;
  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    followerRaf = requestAnimationFrame(animateFollower);
  };
  followerRaf = requestAnimationFrame(animateFollower);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(followerRaf);
    else followerRaf = requestAnimationFrame(animateFollower);
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      overInteractive = true;
      cursor.style.transform = "translate(-50%, -50%) scale(2)";
      follower.style.transform = "translate(-50%, -50%) scale(0.5)";
      applyCursorPalette();
    }, { passive: true });
    el.addEventListener("mouseleave", () => {
      overInteractive = false;
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      follower.style.transform = "translate(-50%, -50%) scale(1)";
      applyCursorPalette();
    }, { passive: true });
  });

  const colorObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) darkSectionsInView.add(entry.target);
      else darkSectionsInView.delete(entry.target);
    });
    applyCursorPalette();
  }, { threshold: 0.35 });

  document.querySelectorAll(".panel-dark").forEach((p) => colorObserver.observe(p));
  applyCursorPalette();
}

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal-up").forEach((el) => {
  if (!el.closest("#hero")) revealObserver.observe(el);
});

// ============ SMOOTH SCROLL ANCHORS ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ============ SKETCH GUY FLOAT ============
const sketchGuy = document.querySelector(".sketch-guy");
if (sketchGuy) {
  let t = 0;
  let sketchRaf;
  const floatSketch = () => {
    t += 0.05;
    sketchGuy.style.transform = `translateY(${4 * Math.sin(t)}px)`;
    sketchRaf = requestAnimationFrame(floatSketch);
  };
  sketchRaf = requestAnimationFrame(floatSketch);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(sketchRaf);
    else sketchRaf = requestAnimationFrame(floatSketch);
  });
}

// ============ CHAT POPUP ============
(() => {
  const triggers = document.querySelectorAll(".km-chat-trigger");
  const overlay = document.getElementById("kmChatOverlay");
  const closeBtn = document.getElementById("kmChatClose");
  if (!triggers.length || !overlay || !closeBtn) return;

  const openChat = () => {
    document.body.classList.add("km-chat-open");
    overlay.setAttribute("aria-hidden", "false");
    triggers.forEach((t) => t.setAttribute("aria-expanded", "true"));
  };

  const closeChat = () => {
    document.body.classList.remove("km-chat-open");
    overlay.setAttribute("aria-hidden", "true");
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", openChat));
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeChat(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("km-chat-open")) closeChat();
  });
})();

// ============ ADDED ANIMATIONS ============


// Animation 4: Section fade-in on scroll
const sectionFadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("section-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

// Apply to all main sections (excluding hero to preserve your existing initial loader behavior)
document.querySelectorAll("section.panel:not(#hero)").forEach(section => {
  section.classList.add("section-fade");
  sectionFadeObserver.observe(section);
});

// ============ COPY EMAIL TO CLIPBOARD ============
const emailCopyBtn = document.getElementById('emailCopyBtn');
const emailCopyText = document.getElementById('emailCopyText');

if (emailCopyBtn && emailCopyText) {
  emailCopyBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent opening the mail app
    const email = "atulsharm0744@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const originalText = emailCopyText.innerText;
      emailCopyText.innerText = 'Copied!';
      setTimeout(() => {
        emailCopyText.innerText = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
}

