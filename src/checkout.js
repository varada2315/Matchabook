// checkout.js - MATCHA BOOK Standalone Checkout Page Logic

// Persisted Cart Array State
let cart = JSON.parse(localStorage.getItem('mb_cart')) || [];

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

function renderCheckout() {
  const summaryWrapper = document.getElementById('checkoutSummaryItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  
  if (cart.length === 0) {
    window.location.href = '/cart.html';
    return;
  }
  
  if (!summaryWrapper) return;
  summaryWrapper.innerHTML = '';
  
  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const summaryItemDiv = document.createElement('div');
    summaryItemDiv.className = 'checkout-summary-item';
    summaryItemDiv.innerHTML = `
      <div>
        <span class="summary-item-name">${item.name}</span>
        <span class="summary-item-meta">(${item.size} x ${item.quantity})</span>
      </div>
      <span>₹${itemTotal.toLocaleString('en-IN')}</span>
    `;
    summaryWrapper.appendChild(summaryItemDiv);
  });
  
  const shippingThreshold = 1199;
  const shippingFee = subtotal >= shippingThreshold ? 0 : 99;
  const grandTotal = subtotal + shippingFee;
  
  subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  shippingEl.textContent = shippingFee === 0 ? 'FREE' : `₹${shippingFee}`;
  grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  placeOrderBtn.textContent = `Place Order & Pay: ₹${grandTotal.toLocaleString('en-IN')}`;
}

// --------------------------------------------------------------------------
// FORM SYNCING & INPUT VALIDATION
// --------------------------------------------------------------------------
const shippingPhone = document.getElementById('shippingPhone');
const shippingWhatsApp = document.getElementById('shippingWhatsApp');
const syncWhatsApp = document.getElementById('syncWhatsApp');

if (syncWhatsApp && shippingPhone && shippingWhatsApp) {
  syncWhatsApp.addEventListener('change', () => {
    if (syncWhatsApp.checked) {
      shippingWhatsApp.value = shippingPhone.value;
      shippingWhatsApp.setAttribute('readonly', 'true');
    } else {
      shippingWhatsApp.removeAttribute('readonly');
    }
  });
  
  shippingPhone.addEventListener('input', () => {
    if (syncWhatsApp.checked) {
      shippingWhatsApp.value = shippingPhone.value;
    }
  });
}

// Payment method tab switching
const paymentTabs = document.querySelectorAll('.payment-tab');
paymentTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    paymentTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const selectedMethod = tab.dataset.method;
    document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`payment-content-${selectedMethod}`).classList.add('active');
  });
});

// Toast notification helper
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

// Form Submission simulator
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const shippingName = document.getElementById('shippingName').value.trim();
    const phone = shippingPhone.value.trim();
    const whatsapp = shippingWhatsApp.value.trim();
    const address = document.getElementById('shippingAddress').value.trim();
    
    if (!shippingName || !phone || !whatsapp || !address) {
      showToast("Please fill in all required shipping details.");
      return;
    }
    
    const activePaymentTab = document.querySelector('.payment-tab.active');
    const paymentMethod = activePaymentTab ? activePaymentTab.dataset.method : 'card';
    
    if (paymentMethod === 'card') {
      const cardNum = document.getElementById('cardNum').value.trim();
      const cardExpiry = document.getElementById('cardExpiry').value.trim();
      const cardCvv = document.getElementById('cardCvv').value.trim();
      if (!cardNum || !cardExpiry || !cardCvv) {
        showToast("Please enter credit/debit card credentials.");
        return;
      }
    }
    
    if (paymentMethod === 'upi') {
      const upiId = document.getElementById('upiId').value.trim();
      if (!upiId) {
        showToast("Please enter your UPI ID.");
        return;
      }
    }
    
    // Display Processing loader
    const loader = document.getElementById('paymentLoader');
    if (loader) loader.classList.add('active');
    
    setTimeout(() => {
      if (loader) loader.classList.remove('active');
      
      // Calculate final totals
      let subtotal = 0;
      cart.forEach(item => { subtotal += item.price * item.quantity; });
      const shippingFee = subtotal >= 1199 ? 0 : 99;
      const grandTotal = subtotal + shippingFee;
      
      const lastOrderData = {
        name: shippingName,
        phone: phone,
        whatsapp: whatsapp,
        address: address,
        invoiceNumber: 'MB-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        items: cart,
        subtotal: subtotal,
        shipping: shippingFee,
        grandTotal: grandTotal
      };
      
      // Save order info to localStorage for success view
      localStorage.setItem('mb_last_order', JSON.stringify(lastOrderData));
      
      // Clear cart
      checkoutForm.reset();
      if (syncWhatsApp) syncWhatsApp.checked = false;
      shippingWhatsApp.removeAttribute('readonly');
      localStorage.setItem('mb_cart', '[]');
      cart = [];
      updateCartBadge();
      
      // Redirect to success
      window.location.href = '/success.html';
    }, 2500);
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
  renderCheckout();
});

// Direct initialization fallback
updateCartBadge();
renderCheckout();
