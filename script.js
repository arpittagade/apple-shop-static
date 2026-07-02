const products = [
  {
    id: "mba13",
    name: "MacBook Air 13″",
    category: "Mac",
    kicker: "New",
    price: 99900,
    desc: "Light, fast and built for college, coding and everyday creative work.",
    image: "assets/products/macbook-air-13.webp",
    thumb: "assets/products/macbook-air-13-thumb.webp",
    alt: "MacBook Air 13 inch open on a white background",
    specs: ["13-inch portable design", "M5 demo chip", "All-day battery"]
  },
  {
    id: "mba15",
    name: "MacBook Air 15″",
    category: "Mac",
    kicker: "More screen",
    price: 124900,
    desc: "More room for multitasking with the same clean and portable Air design.",
    image: "assets/products/macbook-air-15.webp",
    thumb: "assets/products/macbook-air-15-thumb.webp",
    alt: "MacBook Air 15 inch displaying a product page",
    specs: ["15-inch display", "Spacious desktop", "Slim aluminium build"]
  },
  {
    id: "mbp14",
    name: "MacBook Pro 14″",
    category: "Mac",
    kicker: "Pro",
    price: 169900,
    desc: "For heavier development, editing and production workloads.",
    image: "assets/products/macbook-pro-14.webp",
    thumb: "assets/products/macbook-pro-14-thumb.webp",
    alt: "MacBook Pro 14 inch with Finder window open",
    specs: ["14-inch pro display", "Sustained performance", "Creator-ready workflow"]
  },
  {
    id: "iphonepro",
    name: "iPhone Pro",
    category: "iPhone",
    kicker: "Camera system",
    price: 119900,
    desc: "A premium iPhone experience for photos, video and everyday speed.",
    image: "assets/products/iphone-pro.webp",
    thumb: "assets/products/iphone-pro-thumb.webp",
    alt: "Close-up of iPhone Pro camera system",
    specs: ["Pro camera system", "Premium finish", "Fast mobile experience"]
  },
  {
    id: "ipadair",
    name: "iPad Air",
    category: "iPad",
    kicker: "Portable canvas",
    price: 59900,
    desc: "Sketch, study, watch and work with a thin tablet-first experience.",
    image: "assets/products/ipad-air.webp",
    thumb: "assets/products/ipad-air-thumb.webp",
    alt: "iPad Air being used with Apple Pencil for drawing",
    specs: ["Portable drawing canvas", "Apple Pencil workflow", "Thin tablet design"]
  },
  {
    id: "watch",
    name: "Apple Watch",
    category: "Watch",
    kicker: "Health + fitness",
    price: 41900,
    desc: "Quick notifications, fitness tracking and everyday convenience.",
    image: "assets/products/apple-watch.webp",
    thumb: "assets/products/apple-watch-thumb.webp",
    alt: "Apple Watch on wrist during an outdoor fitness activity",
    specs: ["Fitness tracking", "Health summaries", "Wrist notifications"]
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    category: "Audio",
    kicker: "Audio",
    price: 24900,
    desc: "Compact wireless audio for calls, focus and entertainment.",
    image: "assets/products/airpods-pro.webp",
    thumb: "assets/products/airpods-pro-thumb.webp",
    alt: "AirPods Pro and charging case on a wooden table",
    specs: ["Noise control", "Spatial audio concept", "Compact charging case"]
  },
  {
    id: "studio",
    name: "Studio Display",
    category: "Display",
    kicker: "Workspace",
    price: 159900,
    desc: "A sharp external display for a cleaner desk and creative setup.",
    image: "assets/products/studio-display.webp",
    thumb: "assets/products/studio-display-thumb.webp",
    alt: "Studio Display on a desk with keyboard and trackpad",
    specs: ["Large desktop display", "Clean workspace setup", "Mac ecosystem ready"]
  }
];

const categories = ["All", ...new Set(products.map(product => product.category))];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("apple-demo-cart-v2") || "{}");
  } catch {
    return {};
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem("apple-demo-cart-v2", JSON.stringify(cart));
  } catch {
    // Storage can be unavailable in strict private browsing modes. The in-memory cart still works.
  }
}

const state = {
  cart: readCart(),
  activeCategory: "All",
  revealObserver: null
};

const header = $("[data-header]");
const menuToggle = $("[data-menu-toggle]");
const navLinks = $("[data-nav-links]");
const productGrid = $("[data-products]");
const filters = $("[data-filters]");
const cartDrawer = $("[data-cart-drawer]");
const cartItems = $("[data-cart-items]");
const cartCount = $("[data-cart-count]");
const cartTotal = $("[data-cart-total]");
const detailModal = $("[data-detail-modal]");
const detailCard = $("[data-detail-card]");
const toast = $("[data-toast]");
const track = $("[data-highlight-track]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function filteredProducts() {
  if (state.activeCategory === "All") return products;
  return products.filter(product => product.category === state.activeCategory);
}

function renderFilters() {
  filters.innerHTML = categories.map(category => `
    <button
      class="filter-pill${category === state.activeCategory ? " active" : ""}"
      type="button"
      data-filter="${escapeHTML(category)}"
      aria-pressed="${category === state.activeCategory ? "true" : "false"}">
      ${escapeHTML(category)}
    </button>
  `).join("");
}

function renderProducts() {
  const items = filteredProducts();
  productGrid.innerHTML = items.map(product => `
    <article class="product-card reveal" data-product-card="${escapeHTML(product.id)}">
      <div class="product-media">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy" />
      </div>
      <div class="product-body">
        <p class="product-kicker">${escapeHTML(product.kicker)}</p>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.desc)}</p>
        <ul class="product-specs">
          ${product.specs.slice(0, 3).map(spec => `<li>${escapeHTML(spec)}</li>`).join("")}
        </ul>
        <div class="price-line">
          <strong>${formatCurrency(product.price)}</strong>
          <div class="card-actions">
            <button class="details-button" type="button" data-details="${escapeHTML(product.id)}">Details</button>
            <button class="add-button" type="button" data-add="${escapeHTML(product.id)}">Add</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
  observeReveals(productGrid);
}

function productById(id) {
  return products.find(product => product.id === id);
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ ...productById(id), qty }))
    .filter(item => item.id && item.qty > 0);
}

function renderCart() {
  const entries = cartEntries();
  const totalQty = entries.reduce((sum, item) => sum + item.qty, 0);
  const total = entries.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatCurrency(total);

  if (!entries.length) {
    cartItems.innerHTML = `<p class="small-note">Your bag is empty. Add a product from the store section.</p>`;
    return;
  }

  cartItems.innerHTML = entries.map(item => `
    <article class="cart-item">
      <div class="cart-thumb"><img src="${escapeHTML(item.thumb)}" alt="" /></div>
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${formatCurrency(item.price)}</p>
      </div>
      <div class="qty-control" aria-label="Quantity controls for ${escapeHTML(item.name)}">
        <button type="button" data-decrease="${escapeHTML(item.id)}" aria-label="Decrease ${escapeHTML(item.name)}">−</button>
        <span>${item.qty}</span>
        <button type="button" data-increase="${escapeHTML(item.id)}" aria-label="Increase ${escapeHTML(item.name)}">+</button>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  writeCart(state.cart);
}

function addToCart(id) {
  const product = productById(id);
  if (!product) return;
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast(`${product.name} added to bag`);
}

function updateQty(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function openDetails(id) {
  const product = productById(id);
  if (!product) return;

  detailCard.innerHTML = `
    <div class="detail-layout">
      <div class="detail-media">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" />
      </div>
      <div class="detail-copy">
        <header>
          <div>
            <p class="eyebrow">${escapeHTML(product.category)}</p>
            <h2>${escapeHTML(product.name)}</h2>
          </div>
          <button class="icon-button" type="button" aria-label="Close product details" data-detail-close>×</button>
        </header>
        <p>${escapeHTML(product.desc)}</p>
        <ul class="detail-specs">
          ${product.specs.map(spec => `<li>${escapeHTML(spec)}</li>`).join("")}
        </ul>
        <div class="detail-actions">
          <button class="button primary" type="button" data-add="${escapeHTML(product.id)}">Add to bag — ${formatCurrency(product.price)}</button>
          <button class="button secondary" type="button" data-detail-close>Close</button>
        </div>
      </div>
    </div>
  `;
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeDetails() {
  detailModal.setAttribute("aria-hidden", "true");
  if (cartDrawer.getAttribute("aria-hidden") === "true") {
    document.body.classList.remove("no-scroll");
  }
}

function observeReveals(root = document) {
  const targets = $$(".reveal:not(.in-view)", root);
  if (!targets.length) return;

  if (!state.revealObserver) {
    if (!("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("in-view"));
      return;
    }
    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          state.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }

  targets.forEach(target => state.revealObserver.observe(target));
}

function initTilt() {
  const image = $("[data-tilt-image]");
  const hero = image?.closest(".hero-visual");
  if (!image || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let raf = null;
  hero.addEventListener("pointermove", (event) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      image.style.setProperty("--tilt-y", `${x * 5}deg`);
      image.style.setProperty("--tilt-x", `${y * -5}deg`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    image.style.setProperty("--tilt-y", "0deg");
    image.style.setProperty("--tilt-x", "0deg");
  });
}

function initCarousel() {
  $("[data-carousel-next]")?.addEventListener("click", () => {
    track.scrollBy({ left: Math.min(500, track.clientWidth * 0.86), behavior: "smooth" });
  });
  $("[data-carousel-prev]")?.addEventListener("click", () => {
    track.scrollBy({ left: -Math.min(500, track.clientWidth * 0.86), behavior: "smooth" });
  });
}

function initFAQ() {
  $$(".faq-item button").forEach(button => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
    });
  });
}

function bindEvents() {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }, { passive: true });

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    }
  });

  document.addEventListener("click", (event) => {
    const addId = event.target.closest("[data-add]")?.dataset.add;
    const incId = event.target.closest("[data-increase]")?.dataset.increase;
    const decId = event.target.closest("[data-decrease]")?.dataset.decrease;
    const detailsId = event.target.closest("[data-details]")?.dataset.details;
    const filterValue = event.target.closest("[data-filter]")?.dataset.filter;

    if (addId) addToCart(addId);
    if (incId) updateQty(incId, 1);
    if (decId) updateQty(decId, -1);
    if (detailsId) openDetails(detailsId);
    if (filterValue) {
      state.activeCategory = filterValue;
      renderFilters();
      renderProducts();
    }
    if (event.target.closest("[data-cart-open]")) openCart();
    if (event.target.closest("[data-cart-close]")) closeCart();
    if (event.target.closest("[data-detail-close]")) closeDetails();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeDetails();
    }
  });

  $("[data-checkout]").addEventListener("click", () => {
    if (!cartEntries().length) {
      showToast("Add a product before checkout");
      return;
    }
    showToast("Checkout demo only — connect a backend before real payments");
  });

  $("[data-film-button]").addEventListener("click", () => {
    track.scrollTo({ left: 0, behavior: "smooth" });
    showToast("Film placeholder — add your product video here");
  });
}

renderFilters();
renderProducts();
renderCart();
bindEvents();
observeReveals();
initTilt();
initCarousel();
initFAQ();
