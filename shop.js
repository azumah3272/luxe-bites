// ==========================================
// LUXE BITES SHOPPING CART FUNCTIONALITY
// ==========================================

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('luxebitesCart')) || [];

// DOM Elements
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const deliveryFeeEl = document.getElementById('deliveryFee');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

// Constants
const DELIVERY_FEE = 10;
const TAX_RATE = 0.15; // 15% VAT

// ==========================================
// CART FUNCTIONS
// ==========================================

// Add item to cart
function addToCart(event) {
    const button = event.currentTarget;
    const productName = button.dataset.product;
    const price = parseFloat(button.dataset.price);

    // Get quantity from the quantity input
    const quantityInput = button.closest('.item-actions').querySelector('.qty-input');
    const quantity = parseInt(quantityInput.value) || 1;

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: quantity
        });
    }

    // Reset quantity input
    quantityInput.value = 1;

    // Update cart display and localStorage
    saveCart();
    renderCart();

    // Visual feedback
    showAddedNotification(productName);
}

// Remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    renderCart();
}

// Update item quantity
function updateQuantity(productName, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productName);
    } else {
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('luxebitesCart', JSON.stringify(cart));
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        updateCartTotals();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">GH₵${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="cart-qty-selector">
          <button class="cart-qty-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">−</button>
          <span class="cart-qty">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
        </div>
        <span class="cart-item-total">GH₵${(item.price * item.quantity).toFixed(2)}</span>
        <button class="cart-remove-btn" onclick="removeFromCart('${item.name}')" aria-label="Remove item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

    updateCartTotals();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_FEE;

    subtotalEl.textContent = `GH₵${subtotal.toFixed(2)}`;
    taxEl.textContent = `GH₵${tax.toFixed(2)}`;
    totalEl.textContent = `GH₵${total.toFixed(2)}`;

    // Show/hide delivery fee based on cart
    if (cart.length === 0) {
        deliveryFeeEl.parentElement.style.display = 'none';
    } else {
        deliveryFeeEl.parentElement.style.display = 'flex';
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}

// Checkout handler
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }

    // For now, redirect to a checkout page (we'll create this next)
    window.location.href = 'checkout.html';
}

// Show visual feedback when item added
function showAddedNotification(productName) {
    // You can enhance this with a toast notification later
    console.log(`${productName} added to cart!`);
}

// ==========================================
// CATEGORY FILTER
// ==========================================

function filterByCategory(category) {
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            // Add animation
            item.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            item.style.display = 'none';
        }
    });
}

// ==========================================
// QUANTITY CONTROLS IN MENU
// ==========================================

function setupQuantityControls() {
    const allQtyButtons = document.querySelectorAll('.qty-btn');

    allQtyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.closest('.quantity-selector').querySelector('.qty-input');
            let currentValue = parseInt(input.value) || 1;

            if (this.classList.contains('plus')) {
                input.value = currentValue + 1;
            } else if (this.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Add to cart buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Category filter buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterByCategory(this.dataset.category);
    });
});

// Clear and checkout buttons
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkout);

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    setupQuantityControls();
    renderCart();
});
