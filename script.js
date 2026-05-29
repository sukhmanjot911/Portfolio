"use strict";

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Loading Screen ─────────────────────────────────────── */
window.addEventListener("load", () => {
  const screen = qs("#loading-screen");
  if (!screen) return;
  setTimeout(() => screen.classList.add("hidden"), 1900);
});

/* ── Custom Cursor ──────────────────────────────────────── */
(function initCursor() {
  const dot  = qs(".cursor-dot");
  const ring = qs(".cursor-ring");
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });
  (function animRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  })();
  document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });
})();

/* ── Scroll Progress ────────────────────────────────────── */
(function initScrollProgress() {
  const bar = qs("#scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + "%";
  }, { passive: true });
})();

/* ── Sticky Navbar ──────────────────────────────────────── */
(function initNavbar() {
  const nav = qs(".navbar");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 50);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const links = qsa(".nav-link");
  const path  = location.pathname.split("/").pop() || "index.html";
  links.forEach(l => {
    const href = l.getAttribute("href") || "";
    const pg   = href.split("/").pop();
    if (pg === path || (path === "" && pg === "index.html")) l.classList.add("active");
    else l.classList.remove("active");
  });
})();

/* ── Scroll-to-Top ──────────────────────────────────────── */
(function initScrollTop() {
  const btn = qs("#scroll-top");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 400), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ── Scroll Reveal ──────────────────────────────────────── */
(function initReveal() {
  const items = qsa(".reveal");
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
})();

/* ── Typing Animation ───────────────────────────────────── */
(function initTyping() {
  const el = qs(".typed-text");
  if (!el) return;
  const texts = ["Graphics Designer", "Motion Graphics Artist", "2D Animator", "Video Editor", "VFX Artist"];
  let ti = 0, ci = 0, deleting = false;
  function type() {
    const cur = texts[ti];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(type, 1600); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 55 : 100);
  }
  type();
})();

/* ── Counter Animation ──────────────────────────────────── */
(function initCounters() {
  const counters = qsa(".counter-number");
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.target);
      const dur = 1800, step = end / (dur / 16);
      let cur = 0;
      const suffix = el.dataset.suffix || "";
      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = (Number.isInteger(end) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
        if (cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── Skill Bars ─────────────────────────────────────────── */
(function initSkillBars() {
  const fills = qsa(".skill-bar-fill");
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + "%";
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ── Particles ──────────────────────────────────────────── */
(function initParticles() {
  const canvas = qs("#particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  const NUM = window.innerWidth < 600 ? 40 : 90;
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + .3,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      alpha: Math.random() * .5 + .1,
      col: Math.random() > .5 ? "0,255,136" : "168,85,247"
    });
  }
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.alpha})`;
      ctx.fill();
    });
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,255,136,${.08 * (1 - d / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  })();
})();

/* ── Portfolio Filter ───────────────────────────────────── */
(function initFilter() {
  const btns  = qsa(".filter-btn");
  const items = qsa(".portfolio-item");
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      items.forEach(item => item.classList.toggle("hidden", cat !== "all" && item.dataset.cat !== cat));
    });
  });
})();

/* ── Lightbox ───────────────────────────────────────────── */
(function initLightbox() {
  const lb       = qs("#lightbox");
  const lbImg    = qs("#lightbox-img");
  const lbVid    = qs("#lightbox-vid");
  const lbCap    = qs("#lightbox-caption");
  const lbClose  = qs("#lightbox-close");
  if (!lb) return;

  function openLightbox(src, caption, isVideo) {
    if (isVideo) {
      if (lbImg) lbImg.style.display = "none";
      if (lbVid) { lbVid.style.display = "block"; lbVid.src = src; lbVid.play(); }
    } else {
      if (lbVid) { lbVid.style.display = "none"; lbVid.pause(); lbVid.src = ""; }
      if (lbImg) { lbImg.style.display = "block"; lbImg.src = src; }
    }
    if (lbCap) lbCap.textContent = caption || "";
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
    if (lbVid) { lbVid.pause(); lbVid.src = ""; }
    if (lbImg) lbImg.src = "";
  }

  qsa("[data-lightbox]").forEach(el => {
    el.addEventListener("click", () => {
      openLightbox(el.dataset.lightbox, el.dataset.caption || "", false);
    });
  });
  qsa("[data-video-lightbox]").forEach(el => {
    el.addEventListener("click", () => {
      openLightbox(el.dataset.videoLightbox, el.dataset.caption || "", true);
    });
  });

  lbClose && lbClose.addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();

/* ── Contact Form ───────────────────────────────────────── */
(function initForm() {
  const form  = qs("#contact-form");
  const toast = qs("#toast");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    qsa("[required]", form).forEach(f => {
      if (!f.value.trim()) { f.style.borderColor = "#ff4d4d"; valid = false; }
      else f.style.borderColor = "";
    });
    const email = qs("[type='email']", form);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = "#ff4d4d"; valid = false;
    }
    if (!valid) return;
    const btn = qs("[type='submit']", form);
    btn.textContent = "Sending…"; btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = "Send Message"; btn.disabled = false;
      if (toast) { toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 3500); }
    }, 1200);
  });
})();

/* ── Swiper init ────────────────────────────────────────── */
window.addEventListener("load", () => {
  if (typeof Swiper === "undefined") return;
  if (qs(".showcase-swiper")) {
    new Swiper(".showcase-swiper", {
      loop: true, autoplay: { delay: 3500, disableOnInteraction: false },
      slidesPerView: 1,
      breakpoints: { 768: { slidesPerView: 2, spaceBetween: 24 }, 1200: { slidesPerView: 3, spaceBetween: 28 } },
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination", clickable: true },
      speed: 800,
    });
  }
  if (qs(".testimonial-swiper")) {
    new Swiper(".testimonial-swiper", {
      loop: true, autoplay: { delay: 4500 },
      slidesPerView: 1,
      breakpoints: { 768: { slidesPerView: 2, spaceBetween: 28 }, 1200: { slidesPerView: 3, spaceBetween: 32 } },
      spaceBetween: 20,
      pagination: { el: ".testimonial-pagination", clickable: true },
      speed: 700,
    });
  }
});

/* ── AOS ────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 800, once: true, offset: 60, easing: "ease-out-cubic" });
  }
});

/* ── Page transition ─────────────────────────────────────── */
document.querySelectorAll("a[href]").forEach(a => {
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
  a.addEventListener("click", e => {
    e.preventDefault();
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity .35s ease";
    setTimeout(() => { window.location = href; }, 340);
  });
});
document.body.style.opacity = "0";
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity .5s ease";
    document.body.style.opacity    = "1";
  });
});
