document.addEventListener("DOMContentLoaded", () => {

  /* ================================
     INTRO LOADER
  ================================ */
  const loader = document.getElementById("loader");
  if (loader) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      loader.classList.add("hide");
      document.body.style.overflow = "auto";
    }, 2600);
  }

  /* ================================
     THEME PANEL + COLOR SYSTEM
  ================================ */
  const themePanel = document.querySelector(".theme-panel");
  const themeTitle = document.querySelector(".theme-title");
  const themeDots = document.querySelectorAll(".theme-colors span");

  themeTitle?.addEventListener("click", e => {
    e.stopPropagation();
    themePanel.classList.toggle("open");
  });

  document.addEventListener("click", e => {
    if (!themePanel?.contains(e.target)) {
      themePanel?.classList.remove("open");
    }
  });

  themeDots.forEach(dot => {
    dot.addEventListener("click", e => {
      e.stopPropagation();
      const color = dot.dataset.color;

      document.documentElement.style.setProperty("--accent", color);
      document.documentElement.style.setProperty("--glow", color);

      if (color === "#ffffff") {
        document.documentElement.style.setProperty("--bg", "#ffffff");
        document.documentElement.style.setProperty("--text", "#111");
        document.documentElement.style.setProperty("--card", "#f2f2f2");
      } else if (color === "#000000") {
        document.documentElement.style.setProperty("--bg", "#000");
        document.documentElement.style.setProperty("--text", "#fff");
        document.documentElement.style.setProperty("--card", "#111");
      } else {
        document.documentElement.style.setProperty("--bg", "#000");
        document.documentElement.style.setProperty("--text", "#eaffea");
        document.documentElement.style.setProperty("--card", "#0f160f");
      }

      localStorage.setItem("siteColor", color);
    });
  });

  const savedColor = localStorage.getItem("siteColor");
  if (savedColor) {
    document.documentElement.style.setProperty("--accent", savedColor);
    document.documentElement.style.setProperty("--glow", savedColor);
  }

  /* ================================
     INFINITE HORIZONTAL SLIDER
  ================================ */
  const slider = document.getElementById("slider");
  if (slider) {
    slider.innerHTML = "";
    albumsData.forEach(a => {
      slider.innerHTML += `
        <div class="slide-card">
          <img src="${a.img}">
        </div>`;
    });
    slider.innerHTML += slider.innerHTML;

    setTimeout(() => {
      const card = slider.querySelector(".slide-card");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16;
      slider.style.width =
        cardWidth * slider.children.length + "px";
    }, 300);
  }

  /* ================================
     ALBUM GRID + LOAD MORE
  ================================ */
  const albumGrid = document.getElementById("albumGrid");
  const loadBtn = document.getElementById("loadBtn");
  const loadLessBtn = document.getElementById("loadLessBtn");

  let shown = 0;
  const perLoad = 8;
  let currentList = albumsData;

  function renderAlbums(reset = true) {
    if (!albumGrid) return;

    if (reset) {
      albumGrid.innerHTML = "";
      shown = 0;
    }

    const slice = currentList.slice(shown, shown + perLoad);

    slice.forEach(a => {
      albumGrid.innerHTML += `
        <div class="card">
          <img src="${a.img}">
          <div class="card-body">
            <div class="c-title">${a.title}</div>
            <div class="c-artist">${a.artist}</div>
            <div class="c-price">${a.price}</div>
            <button class="add" data-id="${a.id}">Add To Cart</button>
          </div>
        </div>`;
    });

    shown += perLoad;

    loadBtn.style.display =
      shown >= currentList.length ? "none" : "inline-block";
    loadLessBtn.style.display =
      shown > perLoad ? "inline-block" : "none";

    enableMagneticCards();
  }

  renderAlbums();

  loadBtn?.addEventListener("click", () => renderAlbums(false));
  loadLessBtn?.addEventListener("click", () => renderAlbums(true));

  /* ================================
     GENRE FILTER
  ================================ */
  document.querySelectorAll(".g-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.genre;
      currentList =
        g === "All"
          ? albumsData
          : albumsData.filter(a => a.genre === g);
      renderAlbums(true);
    });
  });

  /* ================================
     CART SYSTEM (FAST + SAFE)
  ================================ */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");

  function updateCart() {
    cartCount.textContent = `(${cart.length})`;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  updateCart();

  document.addEventListener("click", e => {
    if (e.target.classList.contains("add")) {
      cart.push(e.target.dataset.id);
      updateCart();
    }
  });

  /* ================================
     REVIEWS – INFINITE
  ================================ */
  const reviewTrack = document.getElementById("reviewTrack");
  if (reviewTrack) {
    const reviews = [
      { stars: 5, text: "Top-class curation.", user: "— Leo" },
      { stars: 5, text: "Insane vinyl quality!", user: "— Mira" },
      { stars: 4, text: "Berlin underground vibes.", user: "— Arjun" },
      { stars: 5, text: "Rare albums found here.", user: "— Noor" }
    ];

    reviews.forEach(r => {
      reviewTrack.innerHTML += `
        <div class="review-card">
          <div class="stars">${"★".repeat(r.stars)}</div>
          <div class="review-text">${r.text}</div>
          <div class="review-user">${r.user}</div>
        </div>`;
    });

    reviewTrack.innerHTML += reviewTrack.innerHTML;
  }

  /* ================================
     SCROLL INTRO (ENTER SITE)
  ================================ */
  const intro = document.getElementById("intro");
  const main = document.getElementById("main-content");
  let entered = false;

  window.addEventListener("wheel", () => {
    if (!entered && intro && main) {
      entered = true;
      intro.classList.add("hide");
      main.classList.add("show");
      setTimeout(() => intro.remove(), 1200);
    }
  }, { once: true });

  /* ================================
     CARD MAGNETIC TILT
  ================================ */
  function enableMagneticCards() {
    document.querySelectorAll(".card").forEach(card => {
      card.onmousemove = e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y / rect.height - 0.5) * 12;
        const rotateY = (x / rect.width - 0.5) * -12;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
      };

      card.onmouseleave = () => {
        card.style.transform = "";
      };
    });
  }

});
function goBack() {
  // agar browser history hai → back
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // direct page open hua → home
    window.location.href = "index.html";
  }
}
document.querySelectorAll(".menu a").forEach(link => {
  if (link.href === window.location.href) {
    link.style.color = "var(--accent)";
    link.style.fontWeight = "700";
  }
});
/* ================================
   SCROLL REVEAL ANIMATION
================================ */
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => revealObserver.observe(el));
