// main.js - MATCHA BOOK 5-Product Rebranded Logic
import './style.css';

/* ==========================================================================
   1. PRODUCT FLAVORS DATA (5 FLAVORS FROM UPLOADED PACKAGES)
   ========================================================================== */
const FLAVORS = [
  {
    index: 0,
    name: "Ceremonial Matcha",
    title: "Elevate Your Greens: Experience Peace in Every Sip",
    subtitle: "Elevate your daily ritual with every sip of MATCHA BOOK's premium matcha blends, carefully crafted to bring you a moment of serenity in the midst of chaos. Experience the harmony of nature in every cup, carefully curated for the modern wellness enthusiast.",
    img: "/ceremonial_matcha.jpg",
    themeClass: "theme-0"
  },
  {
    index: 1,
    name: "Strawberry Matcha",
    title: "Sweet Harmony: Sip Peace in Every Cup",
    subtitle: "A delightful and indulgent blend of Uji ceremonial matcha and sweet organic strawberry juice, formulated to satisfy your dessert cravings healthily. Curated for GenZ and wellness lovers in Tier 1 cities.",
    img: "/strawberry_matcha.jpg",
    themeClass: "theme-1"
  },
  {
    index: 2,
    name: "Mango Matcha",
    title: "Tropical Calm: Savor the Harmony of Fruits",
    subtitle: "Exotic sun-ripened mango and premium Uji ceremonial matcha layered to deliver a refreshing, sweet, and tropical mindfulness experience. Sipping peace made tropical.",
    img: "/mango_matcha.jpg",
    themeClass: "theme-2"
  },
  {
    index: 3,
    name: "Rose Matcha",
    title: "Aromatic Calms: Savor the Serenity",
    subtitle: "Find your quiet moment with the soothing aroma of organic red rose petals infused with stone-ground Uji matcha. Crafted to soothe your senses and relax your mind after a busy day.",
    img: "/rose_matcha.jpg",
    themeClass: "theme-3"
  },
  {
    index: 4,
    name: "Apple Matcha",
    title: "Crisp Focus: Savor the Harmony of Nature",
    subtitle: "A refreshing splash of crisp green apple and premium ceremonial matcha tea. Engineered to keep active minds hydrated, focused, and energized in busy Tier 1 cities.",
    img: "/apple_matcha.jpg",
    themeClass: "theme-4"
  }
];

/* ==========================================================================
   2. DOM ELEMENT SELECTORS
   ========================================================================== */
const outerContainer = document.getElementById('outerContainer');
const sliderTrack = document.getElementById('sliderTrack');
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const cartBadge = document.getElementById('cartBadge');
const orderNowBtn = document.getElementById('orderNowBtn');
const floatingContainer = document.getElementById('floatingContainer');
const testimonialStage = document.getElementById('testimonialStage');
const prevTestimonialBtn = document.getElementById('prevTestimonial');
const nextTestimonialBtn = document.getElementById('nextTestimonial');

/* ==========================================================================
   3. HERO SLIDER LOGIC (5-PRODUCT CAROUSEL)
   ========================================================================== */
let currentSlide = 0;
let isTransitioning = false;

// Initialize Hero Slides
function initHeroSlider() {
  sliderTrack.innerHTML = '';
  FLAVORS.forEach((flavor) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');
    slideDiv.dataset.index = flavor.index;
    
    // Create Main Product Pouch Image
    const img = document.createElement('img');
    img.src = flavor.img;
    img.alt = flavor.name;
    img.classList.add('pouch-img');
    
    slideDiv.appendChild(img);
    sliderTrack.appendChild(slideDiv);
  });
  updateSliderState();
}

// Update Slide positions and Active class states for a 5-product loop
function updateSliderState() {
  const slides = document.querySelectorAll('.slide');
  const count = FLAVORS.length; // 5

  slides.forEach((slide) => {
    const index = parseInt(slide.dataset.index);
    slide.className = 'slide'; // Clear classes
    
    if (index === currentSlide) {
      slide.classList.add('active');
    } else if (index === (currentSlide + 1) % count) {
      slide.classList.add('next');
    } else if (index === (currentSlide + 2) % count) {
      slide.classList.add('far-next');
    } else if (index === (currentSlide - 1 + count) % count) {
      slide.classList.add('prev');
    } else {
      slide.classList.add('hidden');
    }
  });

  // Update Theme class on outer container
  outerContainer.className = 'outer-container'; // reset
  outerContainer.classList.add(FLAVORS[currentSlide].themeClass);

  // Update Hero Text with a smooth fade animation
  heroTitle.classList.remove('fade-anim');
  heroSubtitle.classList.remove('fade-anim');
  
  // Trigger reflow to restart css animation
  void heroTitle.offsetWidth; 
  
  heroTitle.textContent = FLAVORS[currentSlide].title;
  heroSubtitle.textContent = FLAVORS[currentSlide].subtitle;
  
  heroTitle.classList.add('fade-anim');
  heroSubtitle.classList.add('fade-anim');
}

// Next Slide Action
function nextSlide() {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide = (currentSlide + 1) % FLAVORS.length;
  updateSliderState();
  setTimeout(() => isTransitioning = false, 650);
}

// Prev Slide Action
function prevSlide() {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide = (currentSlide - 1 + FLAVORS.length) % FLAVORS.length;
  updateSliderState();
  setTimeout(() => isTransitioning = false, 650);
}

// Auto-Slider Logic (2s Interval)
let autoSlideInterval;

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextSlide, 2000);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }
}

// Manual interactions reset the auto-slide timer
function handleManualNext() {
  nextSlide();
  startAutoSlide();
}

function handleManualPrev() {
  prevSlide();
  startAutoSlide();
}

// Event Listeners for Hero Slider
if (nextSlideBtn) nextSlideBtn.addEventListener('click', handleManualNext);
if (prevSlideBtn) prevSlideBtn.addEventListener('click', handleManualPrev);

// Support clicking on the "next" blurred slide directly
sliderTrack.addEventListener('click', (e) => {
  const clickedSlide = e.target.closest('.slide');
  if (clickedSlide && clickedSlide.classList.contains('next')) {
    handleManualNext();
  }
});

/* ==========================================================================
   4. WEIGHT & SIZE SELECTOR LOGIC
   ========================================================================== */
const sizeButtons = document.querySelectorAll('.size-btn');
sizeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Add micro-animation bounce effect on active slide when size changes
    const activeSlideImg = document.querySelector('.slide.active .pouch-img');
    if (activeSlideImg) {
      activeSlideImg.style.transform = 'scale(1.1) translateY(-10px)';
      setTimeout(() => {
        activeSlideImg.style.transform = '';
      }, 300);
    }
  });
});

/* ==========================================================================
   5. MENU LIST DIRECT SWITCHING
   ========================================================================== */
const menuCards = document.querySelectorAll('.menu-card');
menuCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    // Avoid double trigger if clicking BUY NOW button
    if (e.target.classList.contains('btn-buy')) return;
    
    const flavorIndex = parseInt(card.dataset.flavor);
    currentSlide = flavorIndex;
    updateSliderState();
    startAutoSlide(); // reset timer on manual selection
    
    // Smooth scroll to top of card hero
    document.querySelector('.mockup-card').scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

/* ==========================================================================
   6. INTERACTIVE FAQ ACCORDIONS
   ========================================================================== */
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isActive = item.classList.contains('active');

    // Close all other accordions first
    document.querySelectorAll('.accordion-item').forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
      }
    });

    // Toggle active state
    if (isActive) {
      item.classList.remove('active');
      content.style.maxHeight = '0px';
    } else {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});

/* ==========================================================================
   7. SLANTED TESTIMONIALS SLIDER
   ========================================================================== */
let activeTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function updateTestimonials() {
  const total = testimonialCards.length;
  
  testimonialCards.forEach((card) => {
    card.className = 'testimonial-card'; // reset classes
    const index = parseInt(card.dataset.index);
    
    if (index === activeTestimonial) {
      card.classList.add('active');
    } else if (index === (activeTestimonial + 1) % total) {
      card.classList.add('next-stack');
    } else {
      card.classList.add('far-stack');
    }
  });
}

// --------------------------------------------------------------------------
// Testimonials Autoplay Logic (4s Interval)
// --------------------------------------------------------------------------
let testimonialInterval;

function startTestimonialAutoplay() {
  stopTestimonialAutoplay();
  testimonialInterval = setInterval(nextTestimonial, 4000);
}

function stopTestimonialAutoplay() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
  }
}

function nextTestimonial() {
  activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
  updateTestimonials();
}

function prevTestimonial() {
  activeTestimonial = (activeTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  updateTestimonials();
}

// Manual interactions clear and restart the autoplay countdown
function handleManualNextTestimonial() {
  nextTestimonial();
  startTestimonialAutoplay();
}

function handleManualPrevTestimonial() {
  prevTestimonial();
  startTestimonialAutoplay();
}

prevTestimonialBtn.addEventListener('click', handleManualPrevTestimonial);
nextTestimonialBtn.addEventListener('click', handleManualNextTestimonial);

/* ==========================================================================
   8. SHOPPING CART INCREMENT
   ========================================================================== */
let cartCount = 2;
function addToCart() {
  cartCount += 1;
  cartBadge.textContent = cartCount;
  
  // Bounce animation on badge
  cartBadge.style.transform = 'scale(1.3)';
  setTimeout(() => {
    cartBadge.style.transform = 'scale(1)';
  }, 300);
}

orderNowBtn.addEventListener('click', () => {
  // Find Your Blend links directly to menu section
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

const buyButtons = document.querySelectorAll('.btn-buy');
buyButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart();
    
    // Add visual success ripple/bounce
    btn.textContent = "ADDED ✓";
    btn.style.backgroundColor = "var(--color-forest-accent)";
    setTimeout(() => {
      btn.textContent = "BUY NOW";
      btn.style.backgroundColor = "";
    }, 1200);
  });
});

/* ==========================================================================
   9. DYNAMIC FLOATING PARTICLES (VALUE PROP CANVAS)
   ========================================================================== */
const particleTypes = [
  { type: 'leaf', src: '/matcha_leaf.png' },
  { type: 'strawberry_slice', src: '/strawberry_slice.png' },
  { type: 'rose_petal', src: '/rose_petal.png' },
  { type: 'apple_slice', src: '/apple_slice.png' }
];

function generateFloatingParticles() {
  floatingContainer.innerHTML = '';
  // Generate 12 floating items scattered
  for (let i = 0; i < 12; i++) {
    const pType = particleTypes[i % particleTypes.length];
    const img = document.createElement('img');
    img.src = pType.src;
    img.alt = pType.type;
    img.classList.add('floating-item', pType.type);
    
    // Random position and timing
    img.style.left = `${Math.random() * 90 + 5}%`;
    img.style.top = `${Math.random() * 80 + 10}%`;
    img.style.animationDelay = `${Math.random() * 6}s`;
    img.style.animationDuration = `${Math.random() * 8 + 8}s`;
    
    // Slight random rotation offset
    img.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    floatingContainer.appendChild(img);
  }
}

// Generate once
generateFloatingParticles();

// Reset positions occasionally for visual variety
setInterval(generateFloatingParticles, 30000);

/* ==========================================================================
   10. LEGAL OVERLAYS MODALS LOGIC
   ========================================================================== */
const legalLinks = document.querySelectorAll('.legal-link');
const modalCloses = document.querySelectorAll('.modal-close');
const modalOverlays = document.querySelectorAll('.modal-overlay');

legalLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = link.dataset.modal; // "refund", "privacy", "terms", "disclaimer"
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
    // If user clicks on background backdrop, close modal
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

/* ==========================================================================
   11. INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  updateTestimonials();
  startAutoSlide();
  startTestimonialAutoplay();
});

// Immediately invoke slider setup in case DOMContentLoaded fired
initHeroSlider();
updateTestimonials();
startAutoSlide();
startTestimonialAutoplay();
