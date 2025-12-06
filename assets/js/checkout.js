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
        console.log('[CHECKOUT] sessionStorage keys:', Object.keys(sessionStorage));

        // Get order data from sessionStorage with detailed logging
        const orderData = getOrderDataFromSession();

        if (!orderData) {
            console.error('[CHECKOUT] Failed to retrieve order data from sessionStorage');
            console.log('[CHECKOUT] Available sessionStorage data:');
            for (let key in sessionStorage) {
                if (sessionStorage.hasOwnProperty(key)) {
                    console.log(`  - ${key}: ${sessionStorage[key].substring(0, 100)}...`);
                }
            }
            showEmptyCartMessage();
            return;
        }

        if (!orderData.items || orderData.items.length === 0) {
            console.warn('[CHECKOUT] Order data exists but items array is empty');
            showEmptyCartMessage();
            return;
        }

        console.log('[CHECKOUT] Order data successfully retrieved:', {
            itemCount: orderData.items.length,
            total: orderData.total,
            timestamp: orderData.timestamp,
            userEmail: orderData.userEmail
        });

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
        console.log('[CHECKOUT-BRIDGE] Attempting to retrieve checkoutData from sessionStorage...');

        const data = sessionStorage.getItem('checkoutData');

        if (!data) {
            console.warn('[CHECKOUT-BRIDGE] checkoutData not found in sessionStorage');
            console.log('[CHECKOUT-BRIDGE] Available sessionStorage items:');
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                console.log(`  - ${key}`);
            }
            return null;
        }

        console.log('[CHECKOUT-BRIDGE] Raw data retrieved (first 100 chars):', data.substring(0, 100));

        const orderData = JSON.parse(data);

        console.log('[CHECKOUT-BRIDGE] Data successfully parsed:', {
            itemCount: orderData.items?.length || 0,
            total: orderData.total,
            totalAmount: orderData.totalAmount,
            hasUserEmail: !!orderData.userEmail,
            hasUserName: !!orderData.userName,
            timestamp: orderData.timestamp
        });

        // Validate required fields
        if (!orderData.items || !Array.isArray(orderData.items)) {
            console.error('[CHECKOUT-BRIDGE] Invalid items array');
            return null;
        }

        return orderData;
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error retrieving order data:', error);
        console.error('[CHECKOUT-BRIDGE] sessionStorage content:', sessionStorage);
        return null;
    }
    return null;
}

// Populate customer info from logged-in user
function populateCustomerInfo() {
    try {
        console.log('[CHECKOUT-BRIDGE] Populating customer info from localStorage...');

        const name = localStorage.getItem('enauto_user');
        const email = localStorage.getItem('enauto_email');

        console.log('[CHECKOUT-BRIDGE] Retrieved from localStorage:', {
            name: name || 'NOT FOUND',
            email: email || 'NOT FOUND'
        });

        const nameField = document.getElementById('customerName');
        const emailField = document.getElementById('customerEmail');

        if (!nameField || !emailField) {
            console.warn('[CHECKOUT-BRIDGE] Customer info fields not found in DOM');
            return;
        }

        if (name) {
            nameField.value = name;
            console.log('[CHECKOUT-BRIDGE] Customer name populated:', name);
        } else {
            console.warn('[CHECKOUT-BRIDGE] Customer name not available in localStorage');
        }

        if (email) {
            emailField.value = email;
            console.log('[CHECKOUT-BRIDGE] Customer email populated:', email);
        } else {
            console.warn('[CHECKOUT-BRIDGE] Customer email not available in localStorage');
        }
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error populating customer info:', error);
    }
}

// Display order items in checkout
function displayOrderItems(items) {
    try {
        console.log('[CHECKOUT-BRIDGE] Displaying order items:', items.length);

        const container = document.getElementById('checkoutOrderItems');
        if (!container) {
            console.error('[CHECKOUT-BRIDGE] checkoutOrderItems container not found');
            return;
        }

        container.innerHTML = '';

        if (!items || items.length === 0) {
            console.warn('[CHECKOUT-BRIDGE] No items to display');
            container.innerHTML = '<p class="text-muted">No items in cart</p>';
            return;
        }

        items.forEach((item, index) => {
            try {
                const itemElement = document.createElement('div');
                itemElement.className = 'summary-item';
                const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
                itemElement.innerHTML = `
                    <span>
                        <strong>${item.product}</strong><br>
                        <small class="text-muted">Qty: ${item.quantity} × $${item.price}</small>
                    </span>
                    <span class="text-warning fw-bold">$${itemTotal}</span>
                `;
                container.appendChild(itemElement);
                console.log('[CHECKOUT-BRIDGE] Item displayed:', {
                    product: item.product,
                    qty: item.quantity,
                    price: item.price,
                    total: itemTotal
                });
            } catch (itemError) {
                console.error('[CHECKOUT-BRIDGE] Error displaying item', index, itemError);
            }
        });

        console.log('[CHECKOUT-BRIDGE] All order items displayed successfully');
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error displaying order items:', error);
    }
}

// Calculate totals with tax and delivery
function calculateTotals(items) {
    try {
        console.log('[CHECKOUT-BRIDGE] Calculating totals for', items.length, 'items');

        let subtotal = 0;
        items.forEach((item, index) => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            subtotal += itemTotal;
            console.log('[CHECKOUT-BRIDGE] Item', index + 1, ':', {
                product: item.product,
                price: item.price,
                qty: item.quantity,
                total: itemTotal.toFixed(2)
            });
        });

        const tax = subtotal * 0.10; // 10% tax
        const deliveryFee = subtotal > 50 ? 0 : 3.00; // Free delivery over $50
        const total = subtotal + tax + deliveryFee;

        console.log('[CHECKOUT-BRIDGE] Calculation summary:', {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            deliveryFee: deliveryFee === 0 ? 'FREE' : deliveryFee.toFixed(2),
            total: total.toFixed(2)
        });

        // Update display elements with error checking
        const elements = {
            'subtotal': '$' + subtotal.toFixed(2),
            'taxAmount': '$' + tax.toFixed(2),
            'deliveryFee': deliveryFee === 0 ? 'FREE' : '$' + deliveryFee.toFixed(2),
            'checkoutTotal': '$' + total.toFixed(2),
            'paymentAmount': '$' + total.toFixed(2)
        };

        for (const [elementId, value] of Object.entries(elements)) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
                console.log('[CHECKOUT-BRIDGE] Updated', elementId, ':', value);
            } else {
                console.warn('[CHECKOUT-BRIDGE] Element not found:', elementId);
            }
        }

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
        console.log('[CHECKOUT-BRIDGE] Total calculation complete');
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error calculating totals:', error);
    }
}

// Select payment method
function selectPaymentMethod(element, method) {
    try {
        console.log('[CHECKOUT-BRIDGE] Payment method selected:', method);

        // Remove active class from all
        const methods = document.querySelectorAll('.payment-method');
        methods.forEach(el => {
            el.classList.remove('active');
            const radio = el.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
        });

        // Add active class to selected
        element.classList.add('active');
        const selectedRadio = element.querySelector('input[type="radio"]');
        if (selectedRadio) selectedRadio.checked = true;

        // Show/hide card details
        const cardDetails = document.getElementById('cardDetails');
        if (!cardDetails) {
            console.warn('[CHECKOUT-BRIDGE] cardDetails element not found');
            return;
        }

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
        console.log('[CHECKOUT-BRIDGE] Binding payment form...');

        const form = document.getElementById('paymentForm');
        if (!form) {
            console.error('[CHECKOUT-BRIDGE] paymentForm element not found');
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('[CHECKOUT-BRIDGE] Payment form submitted');
            processPayment();
        });

        console.log('[CHECKOUT-BRIDGE] Payment form bound successfully');
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error binding payment form:', error);
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
        console.log('[CHECKOUT-BRIDGE] Starting payment process...');

        if (!validateCheckoutForm()) {
            console.warn('[CHECKOUT-BRIDGE] Form validation failed');
            return;
        }

        console.log('[CHECKOUT-BRIDGE] Form validation passed');
        showLoader('Processing Payment...');
        console.log('[CHECKOUT-BRIDGE] Loader shown, waiting for payment processing...');

        // Simulate payment processing (2 seconds)
        setTimeout(() => {
            console.log('[CHECKOUT-BRIDGE] Payment processing timeout completed, completing payment...');
            completePayment();
        }, 2000);

    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error processing payment:', error);
        hideLoader();
        showErrorMessage('Payment processing failed');
    }
}

// Complete payment and show success
function completePayment() {
    try {
        console.log('[CHECKOUT-BRIDGE] Completing payment...');

        // Generate order number
        const orderNumber = generateOrderNumber();
        console.log('[CHECKOUT-BRIDGE] Order number generated:', orderNumber);

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

        console.log('[CHECKOUT-BRIDGE] Payment data prepared:', paymentData);

        // Save to localStorage
        savePaymentRecord(paymentData);
        console.log('[CHECKOUT-BRIDGE] Payment record saved to localStorage');

        // Clear cart data from main page
        clearOrderData();
        console.log('[CHECKOUT-BRIDGE] Order data cleared');

        // Show success message
        showPaymentSuccess(orderNumber);
        console.log('[CHECKOUT-BRIDGE] Success message shown');

    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error completing payment:', error);
        hideLoader();
        showErrorMessage('Failed to complete payment');
    }
}

// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}${random}`;
    console.log('[CHECKOUT-BRIDGE] Generated order number:', orderNumber);
    return orderNumber;
}

// Save payment record to localStorage
function savePaymentRecord(paymentData) {
    try {
        const payments = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
        payments.push(paymentData);
        localStorage.setItem('paymentRecords', JSON.stringify(payments));
        console.log('[CHECKOUT-BRIDGE] Payment record saved to localStorage. Total records:', payments.length);
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error saving payment record:', error);
    }
}

// Clear order data from main page
function clearOrderData() {
    try {
        console.log('[CHECKOUT-BRIDGE] Clearing order data...');
        sessionStorage.removeItem('checkoutData');
        localStorage.removeItem('currentOrder');
        console.log('[CHECKOUT-BRIDGE] sessionStorage.checkoutData removed');
        console.log('[CHECKOUT-BRIDGE] localStorage.currentOrder removed');
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error clearing order data:', error);
    }
}

// Show payment success
function showPaymentSuccess(orderNumber) {
    try {
        console.log('[CHECKOUT-BRIDGE] Showing success page for order:', orderNumber);

        hideLoader();

        // Hide form, show success message
        const checkoutForm = document.getElementById('checkoutForm');
        const successDiv = document.getElementById('paymentSuccess');

        if (!checkoutForm || !successDiv) {
            console.warn('[CHECKOUT-BRIDGE] Success elements not found');
            return;
        }

        checkoutForm.style.display = 'none';
        successDiv.classList.add('show');

        const orderNumberElement = document.getElementById('successOrderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
            console.log('[CHECKOUT-BRIDGE] Order number displayed:', orderNumber);
        }

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
                console.log('[CHECKOUT-BRIDGE] Success toast shown');
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
