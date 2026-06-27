// success.js - MATCHA BOOK Order Success Confirmation Logic

// Render Invoice from last order
function renderInvoice() {
  const lastOrderRaw = localStorage.getItem('mb_last_order');
  
  // Fallback mock data in case of direct navigation without a checkout session
  let orderData = {
    name: "John Doe",
    phone: "9899801069",
    whatsapp: "9899801069",
    address: "123 Green Street, Delhi",
    invoiceNumber: "MB-10023",
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    items: [
      { name: "Ceremonial Matcha", size: "30g", quantity: 1, price: 749 },
      { name: "Strawberry Matcha", size: "50g", quantity: 1, price: 999 }
    ],
    subtotal: 1748,
    shipping: 0,
    grandTotal: 1748
  };
  
  if (lastOrderRaw) {
    try {
      orderData = JSON.parse(lastOrderRaw);
    } catch (e) {
      console.error("Error parsing mb_last_order:", e);
    }
  }
  
  // Populate text elements
  const invoiceNumberEl = document.getElementById('invoiceNumber');
  const invoiceDateEl = document.getElementById('invoiceDate');
  const invoiceNameEl = document.getElementById('invoiceName');
  const invoiceAddressEl = document.getElementById('invoiceAddress');
  const invoicePhoneEl = document.getElementById('invoicePhone');
  const invoiceWhatsAppEl = document.getElementById('invoiceWhatsApp');
  const invoiceTableBody = document.getElementById('invoiceTableBody');
  const invoiceSubtotalEl = document.getElementById('invoiceSubtotal');
  const invoiceShippingEl = document.getElementById('invoiceShipping');
  const invoiceGrandTotalEl = document.getElementById('invoiceGrandTotal');
  
  if (invoiceNumberEl) invoiceNumberEl.textContent = `Invoice #: ${orderData.invoiceNumber}`;
  if (invoiceDateEl) invoiceDateEl.textContent = `Date: ${orderData.date}`;
  if (invoiceNameEl) invoiceNameEl.textContent = orderData.name;
  if (invoiceAddressEl) invoiceAddressEl.textContent = orderData.address;
  if (invoicePhoneEl) invoicePhoneEl.textContent = orderData.phone;
  if (invoiceWhatsAppEl) invoiceWhatsAppEl.textContent = orderData.whatsapp;
  
  if (invoiceTableBody) {
    invoiceTableBody.innerHTML = '';
    orderData.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td>${item.quantity}</td>
        <td class="text-right">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      `;
      invoiceTableBody.appendChild(row);
    });
  }
  
  const invoiceDiscountRow = document.getElementById('invoiceDiscountRow');
  const invoiceDiscountEl = document.getElementById('invoiceDiscount');
  
  if (invoiceSubtotalEl) invoiceSubtotalEl.textContent = `₹${orderData.subtotal.toLocaleString('en-IN')}`;
  
  if (orderData.discount && orderData.discount > 0) {
    if (invoiceDiscountRow) invoiceDiscountRow.style.display = 'flex';
    if (invoiceDiscountEl) invoiceDiscountEl.textContent = `-₹${orderData.discount.toLocaleString('en-IN')}`;
  } else {
    if (invoiceDiscountRow) invoiceDiscountRow.style.display = 'none';
  }
  
  if (invoiceShippingEl) invoiceShippingEl.textContent = orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`;
  if (invoiceGrandTotalEl) invoiceGrandTotalEl.textContent = `₹${orderData.grandTotal.toLocaleString('en-IN')}`;
}

// --------------------------------------------------------------------------
// CART BADGE INITIALIZATION (Should be 0 as order is placed)
// --------------------------------------------------------------------------
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('mb_cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
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
  renderInvoice();
});

// Direct initialization fallback
updateCartBadge();
renderInvoice();
