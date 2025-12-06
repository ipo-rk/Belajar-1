// ===========================
// CHECKOUT PAGE MANAGEMENT
// ===========================

// Current step tracking
let currentStep = 1;

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

// Mute checkout form (disable interaction)
function muteCheckoutForm() {
    try {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.classList.add('muted');
            // Disable all form inputs
            const inputs = checkoutForm.querySelectorAll('input, textarea, button:not(.close)');
            inputs.forEach(input => {
                input.disabled = true;
            });
            console.log('[CHECKOUT] Checkout form muted on initial load');
        }
    } catch (error) {
        console.error('[CHECKOUT] Error muting checkout form:', error);
    }
}

// Activate checkout form (enable interaction)
function activateCheckoutForm() {
    try {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.classList.remove('muted');
            // Enable all form inputs
            const inputs = checkoutForm.querySelectorAll('input, textarea, button');
            inputs.forEach(input => {
                input.disabled = false;
            });
            console.log('[CHECKOUT] Checkout form activated');
        }
    } catch (error) {
        console.error('[CHECKOUT] Error activating checkout form:', error);
    }
}

// ===========================
// STEP NAVIGATION
// ===========================

// Go to specific step
function goToStep(stepNumber) {
    try {
        console.log('[CHECKOUT-BRIDGE] ========== Navigating to step:', stepNumber, '==========');

        // Validate step number
        if (stepNumber < 1 || stepNumber > 3) {
            console.error('[CHECKOUT-BRIDGE] Invalid step number:', stepNumber);
            return false;
        }

        // Update step indicator
        updateStepIndicator(stepNumber);

        // Show/hide step contents
        const step1Content = document.getElementById('step1Content');
        const step2Content = document.getElementById('step2Content');
        const step3Content = document.getElementById('step3Content');
        const paymentSuccess = document.getElementById('paymentSuccess');

        console.log('[CHECKOUT-BRIDGE] Elements found:', {
            step1Content: !!step1Content,
            step2Content: !!step2Content,
            step3Content: !!step3Content
        });

        // Hide all step contents
        if (step1Content) {
            step1Content.style.setProperty('display', 'none', 'important');
            console.log('[CHECKOUT-BRIDGE] Step 1 content HIDDEN');
        }
        if (step2Content) {
            step2Content.style.setProperty('display', 'none', 'important');
            console.log('[CHECKOUT-BRIDGE] Step 2 content HIDDEN');
        }
        if (step3Content) {
            step3Content.style.setProperty('display', 'none', 'important');
            console.log('[CHECKOUT-BRIDGE] Step 3 content HIDDEN');
        }

        // Show selected step content
        if (stepNumber === 1) {
            if (step1Content) {
                step1Content.style.setProperty('display', 'block', 'important');
                console.log('[CHECKOUT-BRIDGE] Step 1 content SHOWN');
            }
            muteCheckoutForm(); // Mute form on Step 1
            console.log('[CHECKOUT-BRIDGE] Step 1 displayed - form muted');
        } else if (stepNumber === 2) {
            if (step2Content) {
                step2Content.style.setProperty('display', 'block', 'important');
                console.log('[CHECKOUT-BRIDGE] Step 2 content SHOWN');
            }
            activateCheckoutForm(); // Activate form on Step 2
            console.log('[CHECKOUT-BRIDGE] Step 2 displayed - form activated');
        } else if (stepNumber === 3) {
            if (step3Content) {
                step3Content.style.setProperty('display', 'block', 'important');
                console.log('[CHECKOUT-BRIDGE] Step 3 content SHOWN');
            }
            updateConfirmationData();
            console.log('[CHECKOUT-BRIDGE] Step 3 displayed - confirmation data updated');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        currentStep = stepNumber;
        console.log('[CHECKOUT-BRIDGE] Current step updated to:', currentStep);
        console.log('[CHECKOUT-BRIDGE] ========== Navigation complete ==========');

        return true;
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error navigating to step:', error);
        console.error('[CHECKOUT-BRIDGE] Stack trace:', error.stack);
        return false;
    }
}

// Update step indicator
function updateStepIndicator(stepNumber) {
    try {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        console.log('[CHECKOUT-BRIDGE] Step indicator updated to:', stepNumber);
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error updating step indicator:', error);
    }
}

// Validate and go to step 3
function validateAndGoToStep3() {
    try {
        console.log('[CHECKOUT-BRIDGE] Validating form for step 3...');

        // Validate customer information
        const customerName = document.getElementById('customerName').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
            showErrorMessage('❌ Silakan lengkapi semua informasi pelanggan');
            console.warn('[CHECKOUT-BRIDGE] Form validation failed: missing customer info');
            return false;
        }

        if (!paymentMethod) {
            showErrorMessage('❌ Silakan pilih metode pembayaran');
            console.warn('[CHECKOUT-BRIDGE] Form validation failed: no payment method selected');
            return false;
        }

        // Validate payment method specific fields
        const selectedPaymentMethod = paymentMethod.value;

        if (selectedPaymentMethod === 'card') {
            const cardName = document.getElementById('cardName').value.trim();
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!cardName || !cardNumber || !expiryDate || !cvv) {
                showErrorMessage('❌ Silakan lengkapi detail kartu kredit');
                console.warn('[CHECKOUT-BRIDGE] Card validation failed');
                return false;
            }

            if (cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber)) {
                showErrorMessage('❌ Nomor kartu tidak valid');
                return false;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                showErrorMessage('❌ Format tanggal kadaluarsa harus MM/YY');
                return false;
            }

            if (!/^\d{3}$/.test(cvv)) {
                showErrorMessage('❌ CVV harus 3 digit');
                return false;
            }
        }

        if (selectedPaymentMethod === 'qrcode') {
            const qrcodeConfirm = document.getElementById('qrcodeConfirm');
            if (!qrcodeConfirm || !qrcodeConfirm.checked) {
                showErrorMessage('❌ Silakan konfirmasi bahwa Anda telah melakukan pembayaran QR Code');
                console.warn('[CHECKOUT-BRIDGE] QR code confirmation not checked');
                return false;
            }
        }

        console.log('[CHECKOUT-BRIDGE] All validations passed, proceeding to step 3');
        goToStep(3);
        return true;

    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error validating form:', error);
        showErrorMessage('❌ Terjadi kesalahan validasi form');
        return false;
    }
}

// Update confirmation data on step 3
function updateConfirmationData() {
    try {
        console.log('[CHECKOUT-BRIDGE] Updating confirmation data...');

        // Get form data
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const total = window.checkoutTotal ? '$' + window.checkoutTotal.toFixed(2) : '$0.00';

        // Map payment method names
        const paymentMethodNames = {
            'card': 'Kartu Kredit/Debit',
            'transfer': 'Transfer Bank',
            'ewallet': 'E-Wallet (GCash/PayMaya)',
            'cod': 'Bayar di Tempat (COD)',
            'qrcode': 'QR Code / Barcode'
        };

        // Update confirmation display
        const confirmName = document.getElementById('confirmName');
        const confirmEmail = document.getElementById('confirmEmail');
        const confirmPhone = document.getElementById('confirmPhone');
        const confirmPaymentMethod = document.getElementById('confirmPaymentMethod');
        const confirmTotal = document.getElementById('confirmTotal');
        const paymentAmountBtn = document.getElementById('paymentAmount');

        if (confirmName) confirmName.textContent = name;
        if (confirmEmail) confirmEmail.textContent = email;
        if (confirmPhone) confirmPhone.textContent = phone;
        if (confirmPaymentMethod) confirmPaymentMethod.textContent = paymentMethodNames[paymentMethod] || paymentMethod;
        if (confirmTotal) confirmTotal.textContent = total;
        if (paymentAmountBtn) paymentAmountBtn.textContent = total;

        console.log('[CHECKOUT-BRIDGE] Confirmation data updated:', {
            name, email, phone, paymentMethod, total
        });

    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error updating confirmation data:', error);
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

        // MUTE checkout form on initial load (Step 1)
        muteCheckoutForm();

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
            container.innerHTML = '<p class="text-muted text-light">No items in cart</p>';
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
                        <small class=" text-secondary">Qty: ${item.quantity} × $${item.price}</small>
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
        const qrcodeDetails = document.getElementById('qrcodeDetails');

        if (!cardDetails) {
            console.warn('[CHECKOUT-BRIDGE] cardDetails element not found');
            return;
        }

        if (!qrcodeDetails) {
            console.warn('[CHECKOUT-BRIDGE] qrcodeDetails element not found');
            return;
        }

        if (method === 'card') {
            cardDetails.style.display = 'block';
            qrcodeDetails.style.display = 'none';
            setCardFieldsRequired(true);
            console.log('[CHECKOUT-BRIDGE] Card payment activated');
        } else if (method === 'qrcode') {
            cardDetails.style.display = 'none';
            qrcodeDetails.style.display = 'block';
            setCardFieldsRequired(false);
            // Get total amount and show QR code
            const totalAmount = window.checkoutTotal ? window.checkoutTotal.toFixed(2) : '$0.00';
            const totalStr = typeof totalAmount === 'string' ? totalAmount : '$' + totalAmount;
            showQRCodeDetails(totalStr);
            console.log('[CHECKOUT-BRIDGE] QR Code payment activated, amount:', totalStr);
        } else {
            cardDetails.style.display = 'none';
            qrcodeDetails.style.display = 'none';
            setCardFieldsRequired(false);
            console.log('[CHECKOUT-BRIDGE] Other payment method:', method);
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

// ===========================
// QR CODE / BARCODE PAYMENT
// ===========================

// Generate QR Code for payment
function generateQRCode(amount, referenceNumber) {
    try {
        console.log('[CHECKOUT-BRIDGE] Generating QR Code for amount:', amount, 'ref:', referenceNumber);

        const qrcodeCanvas = document.getElementById('qrcodeCanvas');
        if (!qrcodeCanvas) {
            console.error('[CHECKOUT-BRIDGE] qrcodeCanvas element not found');
            return false;
        }

        // Create QR code data string
        // Format: PAYMENT|AMOUNT|REF|TIMESTAMP
        const timestamp = new Date().toISOString();
        const qrData = `PAYMENT|${amount}|${referenceNumber}|${timestamp}`;

        console.log('[CHECKOUT-BRIDGE] QR Code data:', qrData);

        // Clear previous QR code
        qrcodeCanvas.innerHTML = '';

        // Create canvas element for QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Simple QR Code placeholder with barcode-like pattern
        generateSimpleQRPattern(canvas, qrData, referenceNumber, amount);

        qrcodeCanvas.appendChild(canvas);
        console.log('[CHECKOUT-BRIDGE] QR Code generated successfully');
        return true;
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error generating QR code:', error);
        return false;
    }
}

// Generate simple QR pattern (mock for demo)
function generateSimpleQRPattern(canvas, data, referenceNumber, amount) {
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate pattern based on data
    const pattern = generateBarcodePattern(data);
    const cellSize = size / 25; // 25x25 grid

    ctx.fillStyle = '#000000';
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j]) {
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);

    // Add reference number text at bottom
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('REF: ' + referenceNumber, size / 2, size - 10);
}

// Generate barcode pattern from data
function generateBarcodePattern(data) {
    const pattern = [];
    const rows = 25;
    const cols = 25;

    // Initialize pattern
    for (let i = 0; i < rows; i++) {
        pattern[i] = [];
        for (let j = 0; j < cols; j++) {
            pattern[i][j] = false;
        }
    }

    // Hash data to generate pattern
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Create pattern from hash
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const bit = (hash >> ((i * cols + j) % 32)) & 1;
            pattern[i][j] = bit === 1;
        }
    }

    // Add quiet zone (white border)
    for (let i = 0; i < rows; i++) {
        pattern[i][0] = false;
        pattern[i][cols - 1] = false;
    }
    for (let j = 0; j < cols; j++) {
        pattern[0][j] = false;
        pattern[rows - 1][j] = false;
    }

    return pattern;
}

// Show QR Code details
function showQRCodeDetails(amount) {
    try {
        console.log('[CHECKOUT-BRIDGE] Showing QR Code details for amount:', amount);

        // Generate reference number
        const referenceNumber = generateQRReference();

        // Update QR code reference and amount fields
        const refField = document.getElementById('qrcodeReference');
        const amountField = document.getElementById('qrcodeAmount');

        if (refField) {
            refField.value = referenceNumber;
            console.log('[CHECKOUT-BRIDGE] Reference number set:', referenceNumber);
        }

        if (amountField) {
            amountField.value = amount;
            console.log('[CHECKOUT-BRIDGE] Amount set:', amount);
        }

        // Generate QR Code
        generateQRCode(amount, referenceNumber);

        console.log('[CHECKOUT-BRIDGE] QR Code details displayed');
        return referenceNumber;
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error showing QR code details:', error);
        return null;
    }
}

// Generate QR Reference Number
function generateQRReference() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const reference = `QR${timestamp}${random}`;
    console.log('[CHECKOUT-BRIDGE] Generated QR reference:', reference);
    return reference;
}

// Bind payment form submission
function bindPaymentForm() {
    try {
        console.log('[CHECKOUT-BRIDGE] Binding payment forms...');

        // Bind main payment form (step 1-2)
        const form = document.getElementById('paymentForm');
        if (!form) {
            console.error('[CHECKOUT-BRIDGE] paymentForm element not found');
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('[CHECKOUT-BRIDGE] Payment form submitted - this form is for navigation only');
        });

        // Bind step 3 confirmation form
        const form3 = document.getElementById('paymentFormStep3');
        if (form3) {
            form3.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('[CHECKOUT-BRIDGE] Step 3 confirmation form submitted');
                processPayment();
            });
            console.log('[CHECKOUT-BRIDGE] Step 3 form bound successfully');
        } else {
            console.warn('[CHECKOUT-BRIDGE] paymentFormStep3 element not found');
        }

        console.log('[CHECKOUT-BRIDGE] Payment forms bound successfully');
    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error binding payment forms:', error);
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

    // Validate QR Code payment
    if (method === 'qrcode') {
        const qrcodeConfirm = document.getElementById('qrcodeConfirm');
        if (!qrcodeConfirm || !qrcodeConfirm.checked) {
            showErrorMessage('Please confirm that you have completed QR Code payment');
            console.warn('[CHECKOUT] Validation failed: QR code payment not confirmed');
            return false;
        }
        console.log('[CHECKOUT-BRIDGE] QR Code payment validation passed');
    }

    console.log('[CHECKOUT] Validation passed for method:', method);
    return true;;
}

// Process payment
function processPayment() {
    try {
        console.log('[CHECKOUT-BRIDGE] Starting payment process from step 3...');

        // Get form data (validation sudah dilakukan di step sebelumnya)
        const agreeTerms = document.getElementById('agreeTerms');

        if (!agreeTerms || !agreeTerms.checked) {
            showErrorMessage('❌ Silakan setujui syarat dan ketentuan pembayaran');
            console.warn('[CHECKOUT-BRIDGE] Terms & conditions not accepted');
            return;
        }

        console.log('[CHECKOUT-BRIDGE] All checks passed, starting payment processing...');
        showLoader('🔄 Memproses Pembayaran...');
        console.log('[CHECKOUT-BRIDGE] Loader shown, waiting for payment processing...');

        // Simulate payment processing (2 seconds)
        setTimeout(() => {
            console.log('[CHECKOUT-BRIDGE] Payment processing timeout completed, completing payment...');
            completePayment();
        }, 2000);

    } catch (error) {
        console.error('[CHECKOUT-BRIDGE] Error processing payment:', error);
        hideLoader();
        showErrorMessage('❌ Terjadi kesalahan saat memproses pembayaran');
    }
}

// Complete payment and show success
function completePayment() {
    try {
        console.log('[CHECKOUT-BRIDGE] Completing payment...');

        // Generate order number
        const orderNumber = generateOrderNumber();
        console.log('[CHECKOUT-BRIDGE] Order number generated:', orderNumber);

        // Get payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Collect payment data
        const paymentData = {
            orderNumber: orderNumber,
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            paymentMethod: paymentMethod,
            subtotal: window.checkoutSubtotal,
            tax: window.checkoutTax,
            deliveryFee: window.checkoutDelivery,
            total: window.checkoutTotal,
            timestamp: new Date().toISOString()
        };

        // Add QR Code specific data if payment method is QR Code
        if (paymentMethod === 'qrcode') {
            const qrcodeReference = document.getElementById('qrcodeReference').value;
            const qrcodeAmount = document.getElementById('qrcodeAmount').value;

            paymentData.qrcodeReference = qrcodeReference;
            paymentData.qrcodeAmount = qrcodeAmount;
            paymentData.qrcodeConfirmed = true;

            console.log('[CHECKOUT-BRIDGE] QR Code payment data added:', {
                qrcodeReference: qrcodeReference,
                qrcodeAmount: qrcodeAmount
            });
        }

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

        // Hide all step contents
        const step1Content = document.getElementById('step1Content');
        const step2Content = document.getElementById('step2Content');
        const step3Content = document.getElementById('step3Content');
        const checkoutForm = document.getElementById('checkoutForm');
        const successDiv = document.getElementById('paymentSuccess');

        if (step1Content) step1Content.style.display = 'none';
        if (step2Content) step2Content.style.display = 'none';
        if (step3Content) step3Content.style.display = 'none';
        if (checkoutForm) checkoutForm.style.display = 'none';

        if (!successDiv) {
            console.warn('[CHECKOUT-BRIDGE] Success elements not found');
            return;
        }

        successDiv.classList.add('show');

        const orderNumberElement = document.getElementById('successOrderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
            console.log('[CHECKOUT-BRIDGE] Order number displayed:', orderNumber);
        }

        // Update step indicator to step 3 (completion)
        updateStepIndicator(3);

        // Show toast notification
        Swal.fire({
            icon: 'success',
            title: '✅ Pembayaran Berhasil!',
            html: `Pesanan <strong>${orderNumber}</strong> telah dikonfirmasi.<br>Pesanan akan dikirim dalam 30 menit.`,
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
