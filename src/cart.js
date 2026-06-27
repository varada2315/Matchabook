// cart.js - MATCHA BOOK Standalone Cart Page Logic

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

function renderCart() {
  const wrapper = document.getElementById('cartItemsWrapper');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartGrandTotalEl = document.getElementById('cartGrandTotal');
  const shippingGoalText = document.getElementById('shipping-goal-text');
  const shippingGoalBarFill = document.getElementById('shippingGoalBarFill');
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
  
  if (!wrapper) return;
  
  if (cart.length === 0) {
    wrapper.innerHTML = `
      <div class="empty-cart-state">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Your cart is empty</p>
        <a href="/products.html" class="btn btn-primary" style="display: inline-block; text-decoration: none;">Start Shopping</a>
      </div>
    `;
    cartSubtotalEl.textContent = '₹0';
    cartShippingEl.textContent = '₹0';
    cartGrandTotalEl.textContent = '₹0';
    
    if (shippingGoalText) {
      shippingGoalText.innerHTML = `Add <strong>₹1,199</strong> more for <strong>FREE SHIPPING!</strong>`;
    }
    if (shippingGoalBarFill) {
      shippingGoalBarFill.style.width = '0%';
    }
    if (proceedToCheckoutBtn) {
      proceedToCheckoutBtn.style.display = 'none';
    }
    return;
  }
  
  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.style.display = 'block';
  }
  
  wrapper.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-size">${item.size}</span>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-selector">
          <button class="qty-btn btn-qty-minus" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn btn-qty-plus" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="btn-delete-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
    wrapper.appendChild(cartItemDiv);
  });
  
  // Shipping details computation
  const shippingThreshold = 1199;
  let shippingFee = 99;
  
  if (subtotal >= shippingThreshold) {
    shippingFee = 0;
    if (shippingGoalText) {
      shippingGoalText.innerHTML = `🎉 You qualify for <strong>FREE SHIPPING!</strong>`;
    }
    if (shippingGoalBarFill) {
      shippingGoalBarFill.style.width = '100%';
    }
  } else {
    const remaining = shippingThreshold - subtotal;
    if (shippingGoalText) {
      shippingGoalText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>FREE SHIPPING!</strong>`;
    }
    if (shippingGoalBarFill) {
      const percentage = (subtotal / shippingThreshold) * 100;
      shippingGoalBarFill.style.width = `${percentage}%`;
    }
  }
  
  const grandTotal = subtotal + shippingFee;
  
  cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  cartShippingEl.textContent = shippingFee === 0 ? 'FREE' : `₹${shippingFee}`;
  cartGrandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  
  // Handlers for edit triggers
  wrapper.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
      } else {
        cart.splice(idx, 1);
      }
      saveCart();
      renderCart();
    });
  });
  
  wrapper.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      cart[idx].quantity += 1;
      saveCart();
      renderCart();
    });
  });
  
  wrapper.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });
}

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
  renderCart();
});

// Direct initialization fallback
updateCartBadge();
renderCart();
