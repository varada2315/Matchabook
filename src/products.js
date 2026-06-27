// products.js - MATCHA BOOK Product Listing Page Logic

const FLAVORS = [
  { index: 0, name: "Ceremonial Matcha", themeClass: "theme-0" },
  { index: 1, name: "Strawberry Matcha", themeClass: "theme-1" },
  { index: 2, name: "Mango Matcha", themeClass: "theme-2" },
  { index: 3, name: "Rose Matcha", themeClass: "theme-3" },
  { index: 4, name: "Apple Matcha", themeClass: "theme-4" }
];

const PRICING = {
  ceremonial: {
    "30g": { current: 649, original: 1399 },
    "50g": { current: 999, original: 2199 },
    "100g": { current: 1699, original: 3779 },
    "200g": { current: 2999, original: 6649 }
  },
  flavoured: {
    "30g": { current: 649, original: 1399 },
    "50g": { current: 999, original: 2199 },
    "100g": { current: 1699, original: 3779 },
    "200g": { current: 2999, original: 6649 }
  }
};

function getFlavorType(index) {
  return index === 0 ? 'ceremonial' : 'flavoured';
}

// Persisted Cart Array State
let cart = JSON.parse(localStorage.getItem('mb_cart')) || [];

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

function saveCart() {
  localStorage.setItem('mb_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCartItem(flavorIndex, size) {
  const flavor = FLAVORS[flavorIndex];
  const flavorType = getFlavorType(flavorIndex);
  const priceData = PRICING[flavorType][size];
  
  const existingItem = cart.find(item => item.flavorIndex === flavorIndex && item.size === size);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      flavorIndex: flavorIndex,
      name: flavor.name,
      img: `/${flavor.name.toLowerCase().replace(" ", "_")}.jpg`,
      size: size,
      price: priceData.current,
      quantity: 1
    });
  }
  
  saveCart();
  showToast(`🍵 ${flavor.name} (${size}) added to cart!`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('visible'), 50);
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// --------------------------------------------------------------------------
// CARD SIZE SELECTORS & ACTION BUTTONS
// --------------------------------------------------------------------------
function initProductCards() {
  const menuCards = document.querySelectorAll('.menu-card');
  
  menuCards.forEach((card) => {
    const flavorIndex = parseInt(card.dataset.flavor);
    const flavorType = getFlavorType(flavorIndex);
    const sizeBtns = card.querySelectorAll('.card-size-btn');
    const priceOriginalEl = card.querySelector('.price-original');
    const priceCurrentEl = card.querySelector('.price');
    
    function updateCardPrice(size) {
      const priceData = PRICING[flavorType][size];
      if (priceData && priceCurrentEl && priceOriginalEl) {
        priceCurrentEl.textContent = `₹${priceData.current.toLocaleString('en-IN')}`;
        priceOriginalEl.textContent = `₹${priceData.original.toLocaleString('en-IN')}`;
      }
    }
    
    // Size clicks
    sizeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCardPrice(btn.dataset.size);
      });
    });
    
    // Add to cart buttons inside cards
    const cardAddBtn = card.querySelector('.btn-add-to-cart');
    if (cardAddBtn) {
      cardAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeSizeBtn = card.querySelector('.card-size-btn.active');
        const size = activeSizeBtn ? activeSizeBtn.dataset.size : '100g';
        addToCartItem(flavorIndex, size);
        
        const oldText = cardAddBtn.textContent;
        cardAddBtn.textContent = "ADDED ✓";
        setTimeout(() => {
          cardAddBtn.textContent = oldText;
        }, 1200);
      });
    }
    
    // Buy Now buttons inside cards
    const cardBuyBtn = card.querySelector('.btn-buy-now');
    if (cardBuyBtn) {
      cardBuyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeSizeBtn = card.querySelector('.card-size-btn.active');
        const size = activeSizeBtn ? activeSizeBtn.dataset.size : '100g';
        addToCartItem(flavorIndex, size);
        window.location.href = '/checkout.html';
      });
    }
    
    // Set default price
    updateCardPrice('100g');
  });
}

// --------------------------------------------------------------------------
// SEARCH & FILTER SYSTEM
// --------------------------------------------------------------------------
const productSearchInput = document.getElementById('productSearchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

function filterProducts() {
  const searchQuery = productSearchInput ? productSearchInput.value.toLowerCase().trim() : '';
  const activeFilterBtn = document.querySelector('.filter-btn.active');
  const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
  
  menuCards.forEach((card) => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('.menu-card-desc').textContent.toLowerCase();
    const grade = card.dataset.grade;
    
    const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);
    const matchesFilter = (activeFilter === 'all') || (grade === activeFilter);
    
    if (matchesSearch && matchesFilter) {
      card.classList.remove('hidden-card');
    } else {
      card.classList.add('hidden-card');
    }
  });
}

if (productSearchInput) {
  productSearchInput.addEventListener('input', filterProducts);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProducts();
  });
});

// --------------------------------------------------------------------------
// MOBILE NAVIGATION HAMBURGER LOGIC
// --------------------------------------------------------------------------
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navCapsule = document.querySelector('.nav-capsule');

if (mobileMenuBtn && navCapsule) {
  const menuIcon = mobileMenuBtn.querySelector('i');
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navCapsule.classList.toggle('open');
    menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
}

// --------------------------------------------------------------------------
// MODALS LOGIC
// --------------------------------------------------------------------------
const legalLinks = document.querySelectorAll('.legal-link');
const modalCloses = document.querySelectorAll('.modal-close');
const modalOverlays = document.querySelectorAll('.modal-overlay');

legalLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = link.dataset.modal;
    const targetModal = document.getElementById(`modal-${modalId}`);
    if (targetModal) {
      targetModal.classList.add('active');
    }
  });
});

modalCloses.forEach((btn) => {
  btn.addEventListener('click', () => {
    const activeModal = btn.closest('.modal-overlay');
    if (activeModal) {
      activeModal.classList.remove('active');
    }
  });
});

modalOverlays.forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

// --------------------------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initProductCards();
});

// Direct initialization fallback
updateCartBadge();
initProductCards();
