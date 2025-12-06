// ===========================
// CHECKOUT PAGE MANAGEMENT
// ===========================

// Loader functions
function hideLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    if (loaderContainer) {
        loaderContainer.classList.add('hidden');
        console.log('[CHECKOUT] Loader hidden');
    }
}

function showLoader(message = 'Processing...') {
    const loaderContainer = document.getElementById('loaderContainer');
    if (loaderContainer) {
        const loaderText = loaderContainer.querySelector('.loader-text');
        if (loaderText) loaderText.textContent = message;
        loaderContainer.classList.remove('hidden');
        console.log('[CHECKOUT]', message);
    }
}

// Hide loader on page load
window.addEventListener('load', function () {
    console.log('[CHECKOUT] Page loaded');
    setTimeout(() => {
        hideLoader();
        document.body.style.opacity = '1';
        initializeCheckout();
    }, 500);
});

// Main checkout initialization
function initializeCheckout() {
    try {
        console.log('[CHECKOUT] Initializing checkout...');
        
        // Get order data from sessionStorage
        const orderData = getOrderDataFromSession();
        
        if (!orderData || orderData.items.length === 0) {
            console.warn('[CHECKOUT] No order data found');
            showEmptyCartMessage();
            return;
        }

        // Populate customer info from localStorage
        populateCustomerInfo();
        
        // Display order items
        displayOrderItems(orderData.items);
        
        // Calculate totals
        calculateTotals(orderData.items);
        
        // Bind payment form
        bindPaymentForm();
        
        console.log('[CHECKOUT] Initialization complete');
    } catch (error) {
        console.error('[CHECKOUT] Initialization error:', error);
        showErrorMessage('Failed to load checkout page');
    }
}

// Get order data from sessionStorage
function getOrderDataFromSession() {
    try {
        const data = sessionStorage.getItem('checkoutData');
        if (data) {
            const orderData = JSON.parse(data);
            console.log('[CHECKOUT] Order data retrieved:', {
                itemCount: orderData.items.length,
                total: orderData.total
            });
            return orderData;
        }
    } catch (error) {
        console.error('[CHECKOUT] Error retrieving order data:', error);
    }
    return null;
}

// Populate customer info from logged-in user
function populateCustomerInfo() {
    try {
        const name = localStorage.getItem('enauto_user');
        const email = localStorage.getItem('enauto_email');
        
        if (name) {
            document.getElementById('customerName').value = name;
            console.log('[CHECKOUT] Customer name populated:', name);
        }
        if (email) {
            document.getElementById('customerEmail').value = email;
            console.log('[CHECKOUT] Customer email populated:', email);
        }
    } catch (error) {
        console.error('[CHECKOUT] Error populating customer info:', error);
    }
}

// Display order items in checkout
function displayOrderItems(items) {
    try {
        const container = document.getElementById('checkoutOrderItems');
        if (!container) return;

        container.innerHTML = '';

        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <span>
                    <strong>${item.product}</strong><br>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </span>
                <span class="text-warning fw-bold">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            `;
            container.appendChild(itemElement);
        });

        console.log('[CHECKOUT] Order items displayed:', items.length);
    } catch (error) {
        console.error('[CHECKOUT] Error displaying order items:', error);
    }
}

// Calculate totals with tax and delivery
function calculateTotals(items) {
    try {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += parseFloat(item.price) * item.quantity;
        });

        const tax = subtotal * 0.10; // 10% tax
        const deliveryFee = subtotal > 50 ? 0 : 3.00; // Free delivery over $50
        const total = subtotal + tax + deliveryFee;

        // Update display
        document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
        document.getElementById('taxAmount').textContent = '$' + tax.toFixed(2);
        document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : '$' + deliveryFee.toFixed(2);
        document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
        document.getElementById('paymentAmount').textContent = '$' + total.toFixed(2);

        // Store for later
        window.checkoutTotal = total;
        window.checkoutSubtotal = subtotal;
        window.checkoutTax = tax;
        window.checkoutDelivery = deliveryFee;

        console.log('[CHECKOUT] Totals calculated:', {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            delivery: deliveryFee.toFixed(2),
            total: total.toFixed(2)
        });
    } catch (error) {
        console.error('[CHECKOUT] Error calculating totals:', error);
    }
}

// Select payment method
function selectPaymentMethod(element, method) {
    try {
        // Remove active class from all
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('active');
            el.querySelector('input[type="radio"]').checked = false;
        });

        // Add active class to selected
        element.classList.add('active');
        element.querySelector('input[type="radio"]').checked = true;

        // Show/hide card details
        const cardDetails = document.getElementById('cardDetails');
        if (method === 'card') {
            cardDetails.style.display = 'block';
            // Set as required
            setCardFieldsRequired(true);
        } else {
            cardDetails.style.display = 'none';
            // Remove required
            setCardFieldsRequired(false);
        }

        console.log('[CHECKOUT] Payment method selected:', method);
    } catch (error) {
        console.error('[CHECKOUT] Error selecting payment method:', error);
    }
}

// Set card fields as required or not
function setCardFieldsRequired(required) {
    const cardFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
    cardFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.required = required;
        }
    });
}

// Bind payment form submission
function bindPaymentForm() {
    try {
        const form = document.getElementById('paymentForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            processPayment();
        });

        console.log('[CHECKOUT] Payment form bound');
    } catch (error) {
        console.error('[CHECKOUT] Error binding payment form:', error);
    }
}

// Validate form inputs
function validateCheckoutForm() {
    const form = document.getElementById('paymentForm');
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Required fields
    const customerName = document.getElementById('customerName').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
        showErrorMessage('Please fill in all customer information');
        console.warn('[CHECKOUT] Validation failed: missing customer info');
        return false;
    }

    if (!agreeTerms) {
        showErrorMessage('Please agree to Terms & Conditions');
        console.warn('[CHECKOUT] Validation failed: terms not accepted');
        return false;
    }

    // Validate card if card payment
    if (method === 'card') {
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            showErrorMessage('Please fill in all card details');
            console.warn('[CHECKOUT] Validation failed: incomplete card info');
            return false;
        }

        // Validate card number (simple check)
        if (cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber)) {
            showErrorMessage('Invalid card number');
            console.warn('[CHECKOUT] Validation failed: invalid card number');
            return false;
        }

        // Validate expiry date format
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            showErrorMessage('Expiry date must be in MM/YY format');
            console.warn('[CHECKOUT] Validation failed: invalid expiry format');
            return false;
        }

        // Validate CVV
        if (!/^\d{3}$/.test(cvv)) {
            showErrorMessage('CVV must be 3 digits');
            console.warn('[CHECKOUT] Validation failed: invalid CVV');
            return false;
        }
    }

    console.log('[CHECKOUT] Validation passed');
    return true;
}

// Process payment
function processPayment() {
    try {
        if (!validateCheckoutForm()) {
            return;
        }

        showLoader('Processing Payment...');

        // Simulate payment processing
        setTimeout(() => {
            completePayment();
        }, 2000);

    } catch (error) {
        console.error('[CHECKOUT] Error processing payment:', error);
        hideLoader();
        showErrorMessage('Payment processing failed');
    }
}

// Complete payment and show success
function completePayment() {
    try {
        // Generate order number
        const orderNumber = generateOrderNumber();

        // Collect payment data
        const paymentData = {
            orderNumber: orderNumber,
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            subtotal: window.checkoutSubtotal,
            tax: window.checkoutTax,
            deliveryFee: window.checkoutDelivery,
            total: window.checkoutTotal,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        savePaymentRecord(paymentData);

        // Clear cart data from main page
        clearOrderData();

        // Show success message
        showPaymentSuccess(orderNumber);

        console.log('[CHECKOUT] Payment completed:', paymentData);

    } catch (error) {
        console.error('[CHECKOUT] Error completing payment:', error);
        hideLoader();
        showErrorMessage('Failed to complete payment');
    }
}

// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}${random}`;
    return orderNumber;
}

// Save payment record to localStorage
function savePaymentRecord(paymentData) {
    try {
        const payments = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
        payments.push(paymentData);
        localStorage.setItem('paymentRecords', JSON.stringify(payments));
        console.log('[CHECKOUT] Payment record saved');
    } catch (error) {
        console.error('[CHECKOUT] Error saving payment record:', error);
    }
}

// Clear order data from main page
function clearOrderData() {
    try {
        sessionStorage.removeItem('checkoutData');
        localStorage.removeItem('currentOrder');
        console.log('[CHECKOUT] Order data cleared');
    } catch (error) {
        console.error('[CHECKOUT] Error clearing order data:', error);
    }
}

// Show payment success
function showPaymentSuccess(orderNumber) {
    try {
        hideLoader();

        // Hide form, show success message
        document.getElementById('checkoutForm').style.display = 'none';
        const successDiv = document.getElementById('paymentSuccess');
        successDiv.classList.add('show');
        document.getElementById('successOrderNumber').textContent = orderNumber;

        // Show toast notification
        Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            html: `Your order <strong>${orderNumber}</strong> has been confirmed.<br>Pesanan akan dikirim dalam 30 menit.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        console.log('[CHECKOUT] Payment success displayed for order:', orderNumber);

    } catch (error) {
        console.error('[CHECKOUT] Error showing success message:', error);
    }
}

// Format card number input
document.addEventListener('DOMContentLoaded', function () {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }

    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
});

// Go back to order page
function goBackToOrder() {
    try {
        console.log('[CHECKOUT] Going back to order page');
        window.location.href = 'index.html#order';
    } catch (error) {
        console.error('[CHECKOUT] Error going back:', error);
    }
}

// Show error message using SweetAlert2
function showErrorMessage(message) {
    try {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            html: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        console.error('[CHECKOUT] Error shown:', message);
    } catch (error) {
        console.error('[CHECKOUT] Error showing error message:', error);
    }
}

// Show empty cart message
function showEmptyCartMessage() {
    try {
        Swal.fire({
            icon: 'warning',
            title: 'No Items',
            html: 'Your cart is empty. Please add items before proceeding to checkout.',
            confirmButtonText: 'Back to Store'
        }).then(() => {
            window.location.href = 'index.html#order';
        });
        console.warn('[CHECKOUT] Empty cart detected');
    } catch (error) {
        console.error('[CHECKOUT] Error showing empty cart message:', error);
    }
}

// Failsafe: hide loader after timeout
setTimeout(() => {
    hideLoader();
}, 5000);

console.log('[CHECKOUT] Checkout script loaded');
