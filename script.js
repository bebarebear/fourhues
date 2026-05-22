const products = [
  { id: 1, name: "Rose Quartz Bracelet", price: 28, category: "gifts", image: "assets/prod-bracelet.png" },
  { id: 2, name: "Petite Dried Bouquet", price: 22, category: "florals", image: "assets/prod-bouquet.png" },
  { id: 3, name: "Lace Ribbon Set", price: 18, category: "supplies", image: "assets/prod-ribbon.png" },
  { id: 4, name: "Floral Greeting Cards", price: 12, category: "stationery", image: "assets/prod-cards.png" },
  { id: 5, name: "Beaded Bag Charm", price: 16, category: "gifts", image: "assets/prod-charm.png" },
  { id: 6, name: "Bead Mix Jar", price: 14, category: "supplies", image: "assets/prod-beads.png" },
  { id: 7, name: "Soft Ribbon Bundle", price: 20, category: "supplies", image: "assets/prod-ribbon.png" },
  { id: 8, name: "Mini Floral Gift Tag", price: 10, category: "stationery", image: "assets/prod-cards.png" },
  { id: 9, name: "Pastel Pearl Charm", price: 15, category: "gifts", image: "assets/prod-charm.png" },
  { id: 10, name: "Lavender Dry Stem Set", price: 24, category: "florals", image: "assets/prod-bouquet.png" },
  { id: 11, name: "Pink Bead Bracelet", price: 26, category: "gifts", image: "assets/prod-bracelet.png" },
  { id: 12, name: "Mixed Craft Jar", price: 14, category: "supplies", image: "assets/prod-beads.png" }
];

const productGrid = document.getElementById("productGrid");
const filterLabel = document.getElementById("filterLabel");
const viewAllBtn = document.getElementById("viewAllBtn");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

let activeFilter = "all";
let showAll = false;
let cart = [];
let favorites = new Set();

const labels = {
  all: "Showing all products",
  gifts: "Showing handmade gifts",
  supplies: "Showing craft supplies",
  florals: "Showing dried florals",
  stationery: "Showing stationery"
};

function money(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const filtered = activeFilter === "all" ? products : products.filter(product => product.category === activeFilter);
  const visible = showAll ? filtered : filtered.slice(0, 6);

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
        <button class="favorite-btn ${favorites.has(product.id) ? "active" : ""}" data-favorite="${product.id}" aria-label="Save ${product.name}">♡</button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">${money(product.price)}</p>
        <button class="add-btn" data-add="${product.id}">Add to Cart</button>
      </div>
    </article>
  `).join("");

  filterLabel.textContent = labels[activeFilter] || labels.all;
  viewAllBtn.style.display = filtered.length > 6 ? "inline-flex" : "none";
  viewAllBtn.textContent = showAll ? "Show Featured Products" : "View All Products";
}

function setFilter(filter) {
  activeFilter = filter || "all";
  showAll = false;
  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  updateCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty. Add something lovely from the shop.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} × ${item.qty}</p>
      </div>
      <button type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button>
    </div>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2200);
}

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");

  if (addButton) addToCart(addButton.dataset.add);

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast("Removed from favorites");
    } else {
      favorites.add(id);
      showToast("Saved to favorites");
    }
    renderProducts();
  }
});

viewAllBtn.addEventListener("click", () => {
  showAll = !showAll;
  renderProducts();
});

document.querySelectorAll("[data-filter]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    setFilter(link.dataset.filter);
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => setFilter(card.dataset.filter));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFilter(card.dataset.filter);
    }
  });
});

document.getElementById("openCart").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
});

cartDrawer.addEventListener("click", event => {
  if (event.target === cartDrawer) {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
  }
});

cartItems.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return showToast("Your cart is empty");
  showToast("Demo checkout clicked. Connect this to your payment system.");
});

document.getElementById("subscribeForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("email");
  showToast(`Thank you for subscribing, ${email.value}!`);
  email.value = "";
});

document.querySelectorAll("[data-popup]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showToast(link.dataset.popup);
  });
});

document.querySelectorAll(".value-card").forEach(button => {
  button.addEventListener("click", () => showToast(button.dataset.value));
});

menuToggle?.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
});

// Automatic navigation highlight based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav > a, .main-nav > div > a");

const observerOptions = {
  threshold: 0.3,
  rootMargin: "-50px 0px -66% 0px"
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("active"));
      
      const matchingLink = Array.from(navLinks).find(link => 
        link.getAttribute("href") === `#${entry.target.id}`
      );
      
      if (matchingLink) {
        matchingLink.classList.add("active");
      }
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

renderProducts();
updateCart();
