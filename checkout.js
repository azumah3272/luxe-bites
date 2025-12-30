// ==========================================
// LUXE BITES CHECKOUT FUNCTIONALITY
// ==========================================

// Constants
const TAX_RATE = 0.15;
const DELIVERY_FEES = {
    standard: 10,
    express: 25,
    scheduled: 15
};

// DOM Elements
const checkoutForm = document.getElementById('checkoutForm');
const orderItemsContainer = document.getElementById('orderItems');
const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
const scheduledTimeContainer = document.getElementById('scheduledTimeContainer');
const scheduledTimeInput = document.getElementById('scheduledTime');
const confirmationModal = document.getElementById('confirmationModal');
const modalOverlay = document.getElementById('modalOverlay');

// ==========================================
// INITIALIZE CHECKOUT
// ==========================================

function initializeCheckout() {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('luxebitesCart')) || [];

    // If cart is empty, redirect back to shop
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        window.location.href = 'shop.html';
        return;
    }

    // Display order items
    displayOrderItems(cart);

    // Calculate and display totals
    updateOrderSummary(cart);
}

// ==========================================
// DISPLAY ORDER ITEMS
// ==========================================

function displayOrderItems(cart) {
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">No items in cart</p>';
        return;
    }

    orderItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="order-item">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">Qty: ${item.quantity}</span>
            </div>
            <span class="item-subtotal">GH₵${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

// ==========================================
// UPDATE ORDER SUMMARY
// ==========================================

function updateOrderSummary(cart) {
    // Get selected delivery type
    const selectedDeliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const deliveryFee = DELIVERY_FEES[selectedDeliveryType];

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate tax
    const tax = subtotal * TAX_RATE;

    // Calculate total
    const total = subtotal + tax + deliveryFee;

    // Update sidebar
    document.getElementById('breakdownSubtotal').textContent = `GH₵${subtotal.toFixed(2)}`;
    document.getElementById('breakdownDelivery').textContent = `GH₵${deliveryFee.toFixed(2)}`;
    document.getElementById('breakdownTax').textContent = `GH₵${tax.toFixed(2)}`;
    document.getElementById('breakdownTotal').textContent = `GH₵${total.toFixed(2)}`;
}

// ==========================================
// DELIVERY TYPE CHANGE HANDLER
// ==========================================

deliveryTypeRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        // Show/hide scheduled time input
        if (this.value === 'scheduled') {
            scheduledTimeContainer.style.display = 'block';
            scheduledTimeInput.required = true;
        } else {
            scheduledTimeContainer.style.display = 'none';
            scheduledTimeInput.required = false;
        }

        // Update summary
        const cart = JSON.parse(localStorage.getItem('luxebitesCart')) || [];
        updateOrderSummary(cart);
    });
});

// ==========================================
// FORM VALIDATION
// ==========================================

function validateForm(formData) {
    // Check required fields
    if (!formData.fullName.trim()) {
        alert('Please enter your full name');
        return false;
    }

    if (!formData.phone.trim()) {
        alert('Please enter your phone number');
        return false;
    }

    if (!formData.address.trim()) {
        alert('Please enter your delivery address');
        return false;
    }

    if (!formData.city.trim()) {
        alert('Please enter your city');
        return false;
    }

    if (!formData.area.trim()) {
        alert('Please enter your area/district');
        return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }

    // Validate scheduled time if selected
    if (formData.deliveryType === 'scheduled' && !formData.scheduledTime) {
        alert('Please select a delivery time');
        return false;
    }

    return true;
}

// ==========================================
// GENERATE ORDER NUMBER
// ==========================================

function generateOrderNumber() {
    // Format: #LB + timestamp + random 3 digits
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `#LB${timestamp}${random}`;
}

// ==========================================
// GET ESTIMATED DELIVERY TIME
// ==========================================

function getEstimatedDeliveryTime(deliveryType) {
    const now = new Date();

    if (deliveryType === 'standard') {
        // 1-2 hours from now
        const hours = Math.floor(Math.random() * 2) + 1;
        now.setHours(now.getHours() + hours);
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (deliveryType === 'express') {
        // 30-45 minutes from now
        const minutes = Math.floor(Math.random() * 15) + 30;
        now.setMinutes(now.getMinutes() + minutes);
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (deliveryType === 'scheduled') {
        // Use the time selected by user
        return document.getElementById('scheduledTime').value;
    }
}

// ==========================================
// SHOW CONFIRMATION MODAL
// ==========================================

function showConfirmation(orderData, total) {
    const orderNumber = generateOrderNumber();
    const estimatedTime = getEstimatedDeliveryTime(orderData.deliveryType);

    // Populate confirmation details
    document.getElementById('confirmOrderNumber').textContent = orderNumber;
    document.getElementById('confirmAddress').textContent =
        `${orderData.address}, ${orderData.area}, ${orderData.city}`;
    document.getElementById('confirmDelivery').textContent = estimatedTime;
    document.getElementById('confirmTotal').textContent = `GH₵${total.toFixed(2)}`;

    // Show modal
    confirmationModal.style.display = 'block';
    modalOverlay.style.display = 'block';

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// ==========================================
// HIDE CONFIRMATION MODAL
// ==========================================

function hideConfirmation() {
    confirmationModal.style.display = 'none';
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==========================================
// FORM SUBMISSION
// ==========================================

checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        area: document.getElementById('area').value,
        specialInstructions: document.getElementById('specialInstructions').value,
        deliveryType: document.querySelector('input[name="deliveryType"]:checked').value,
        scheduledTime: document.getElementById('scheduledTime').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    // Get cart data
    const cart = JSON.parse(localStorage.getItem('luxebitesCart')) || [];

    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee = DELIVERY_FEES[formData.deliveryType];
    const total = subtotal + tax + deliveryFee;

    // Create order object
    const order = {
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toLocaleString(),
        customer: formData,
        items: cart,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        total: total
    };

    // Store order in localStorage
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // Log order (in real application, would send to server)
    console.log('Order Placed:', order);

    // Show confirmation modal
    showConfirmation(formData, total);

    // Clear cart after successful order
    setTimeout(() => {
        localStorage.removeItem('luxebitesCart');
    }, 2000);
});

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    initializeCheckout();
});
