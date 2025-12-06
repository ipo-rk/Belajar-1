# 📊 Checkout Integration - Visual Diagrams & Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN PAGE (index.html)                   │
│                                                             │
│  User Profile:                   Order Table:              │
│  ┌──────────────┐               ┌──────────────────────┐  │
│  │ Logged In    │               │ Product │ Price │ Qty│  │
│  │ User Photo   │               │ Espresso│ $5.00 │ 2 │  │
│  │ [Profile ▼] │               │ Latte   │ $5.50 │ 1 │  │
│  └──────────────┘               │ Mocha   │ $4.50 │ 1 │  │
│                                 │ ─────────────────────│  │
│                                 │ Total:      $20.50   │  │
│                                 │ [Checkout Button]    │  │
│                                 └──────────────────────┘  │
│                                                             │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Click Checkout
                      ▼
         [CHECKOUT-BRIDGE] Checkout button clicked
         [CHECKOUT-BRIDGE] Item collected: {product, price, qty}
         [CHECKOUT-BRIDGE] Order data saved to sessionStorage
         [CHECKOUT-BRIDGE] Redirecting to checkout.html

        ╔═══════════════════════════════════════════╗
        ║ sessionStorage.checkoutData = {            ║
        ║   items: [{...}, {...}, {...}],            ║
        ║   total: "$20.50",                         ║
        ║   totalAmount: 20.50,                      ║
        ║   timestamp: "ISO date"                    ║
        ║ }                                          ║
        ╚═══════════════════════════════════════════╝
                      │
                      │ 1.5 sec delay
                      │ window.location.href = 'checkout.html'
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 CHECKOUT PAGE (checkout.html)               │
│                                                             │
│  Left Column:                   Right Column:              │
│  ┌──────────────────────┐      ┌──────────────────────┐  │
│  │ Order Summary        │      │ Payment Method       │  │
│  │ ─────────────────    │      │ ┌─ Card            │  │
│  │ Espresso (2x $5.00)  │      │ ┌─ Transfer        │  │
│  │ Latte (1x $5.50)     │      │ ┌─ E-Wallet        │  │
│  │ Mocha (1x $4.50)     │      │ ┌─ Cash on Delivery│  │
│  │ ─────────────────    │      │ └─────────────────┘  │
│  │ Subtotal:    $15.00  │      │                       │  │
│  │ Tax (10%):   $1.50   │      │ Card Details (if     │  │
│  │ Delivery:    $3.00   │      │ selected):           │  │
│  │ ─────────────────    │      │ Name: [____]         │  │
│  │ Total:       $19.50  │      │ Card: [__________]   │  │
│  │                      │      │ Exp: [__/__]         │  │
│  │                      │      │ CVV: [___]           │  │
│  │ Customer Info:       │      │ ────────────────────│  │
│  │ Name: John Doe       │      │ [Complete Payment]  │  │
│  │ Email: john@ex.com   │      │                      │  │
│  │ Phone: [______]      │      │                      │  │
│  │ Address: [_______]   │      │                      │  │
│  │ □ Agree to Terms     │      │                      │  │
│  └──────────────────────┘      └──────────────────────┘  │
│                                                             │
└─────────────────────┬──────────────────────────────────────┘
                      │
        [CHECKOUT-BRIDGE] Attempting to retrieve checkoutData
        [CHECKOUT-BRIDGE] Data successfully parsed
        [CHECKOUT-BRIDGE] Customer name populated: John Doe
        [CHECKOUT-BRIDGE] Customer email populated: john@ex.com
        [CHECKOUT-BRIDGE] Displaying order items: 3
        [CHECKOUT-BRIDGE] Calculating totals for 3 items
        [CHECKOUT-BRIDGE] Payment form bound successfully

        ╔═══════════════════════════════════════════╗
        ║ localStorage = {                           ║
        ║   enauto_user: "John Doe",                ║
        ║   enauto_email: "john@ex.com",            ║
        ║   ...other user data...                   ║
        ║ }                                          ║
        ╚═══════════════════════════════════════════╝
                      │
                      │ User selects payment method & fills form
                      │
                      │ Click "Complete Payment"
                      ▼
        [CHECKOUT-BRIDGE] Payment form submitted
        [CHECKOUT-BRIDGE] Form validation passed
        [CHECKOUT-BRIDGE] Starting payment process...
        ─ Show Loader: "Processing Payment..."
        [CHECKOUT-BRIDGE] Payment processing timeout completed
        [CHECKOUT-BRIDGE] Order number generated: ORD-123456789
        [CHECKOUT-BRIDGE] Payment record saved to localStorage
                      │
        ╔═══════════════════════════════════════════╗
        ║ localStorage.paymentRecords = [            ║
        ║   {                                       ║
        ║     orderNumber: "ORD-123456789",         ║
        ║     customerName: "John Doe",             ║
        ║     total: 19.50,                         ║
        ║     paymentMethod: "card",                ║
        ║     timestamp: "ISO date"                 ║
        ║   }                                       ║
        ║ ]                                         ║
        ╚═══════════════════════════════════════════╝
                      │
        [CHECKOUT-BRIDGE] Showing success page for order: ORD-123456789
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │     SUCCESS PAGE (Hidden → Shown)   │
        │                                     │
        │  ┌───────────────────────────────┐ │
        │  │ ✓ PAYMENT SUCCESSFUL!        │ │
        │  │                               │ │
        │  │ Order Number:                 │ │
        │  │ ORD-123456789                 │ │
        │  │                               │ │
        │  │ Your order will be delivered  │ │
        │  │ within 30 minutes.            │ │
        │  │                               │ │
        │  │ [← Back to Home]              │ │
        │  └───────────────────────────────┘ │
        │                                     │
        │ + Toast Notification (5 sec):      │
        │ ✓ Your order ORD-123456789         │
        │   has been confirmed!              │
        └─────────────────────────────────────┘
                      │
                      │ User clicks "Back to Home"
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MAIN PAGE (index.html)                   │
│            (Order Table Cleared, Ready for New)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Console Logging Timeline

```
Timeline ──────────────────────────────────────────────────────────►

PAGE: index.html
│
├─ User Activity
│  └─ [CHECKOUT] User is logged in
│  └─ [CART] Items added to cart
│
└─ Click Checkout Button
   └─ [CHECKOUT-BRIDGE] Checkout button clicked
   └─ [CHECKOUT-BRIDGE] Item collected: {Espresso, $5.00, qty:2}
   └─ [CHECKOUT-BRIDGE] Item collected: {Latte, $5.50, qty:1}
   └─ [CHECKOUT-BRIDGE] Item collected: {Mocha, $4.50, qty:1}
   └─ [CHECKOUT-BRIDGE] Order data saved to sessionStorage
   └─ [CHECKOUT-BRIDGE] Redirecting to checkout.html

   ════════════════ PAGE REDIRECT ════════════════

PAGE: checkout.html
│
├─ Page Load Event
│  └─ [CHECKOUT] Page loaded
│
├─ Initialize Checkout
│  ├─ [CHECKOUT-BRIDGE] Attempting to retrieve checkoutData
│  ├─ [CHECKOUT-BRIDGE] Raw data retrieved (first 100 chars)
│  ├─ [CHECKOUT-BRIDGE] Data successfully parsed
│  │  {itemCount: 3, total: "$15.00", ...}
│  │
│  ├─ [CHECKOUT-BRIDGE] Populating customer info
│  ├─ [CHECKOUT-BRIDGE] Retrieved from localStorage
│  ├─ [CHECKOUT-BRIDGE] Customer name populated: John Doe
│  ├─ [CHECKOUT-BRIDGE] Customer email populated: john@ex.com
│  │
│  ├─ [CHECKOUT-BRIDGE] Displaying order items: 3
│  ├─ [CHECKOUT-BRIDGE] Item displayed: {Espresso, qty:2...}
│  ├─ [CHECKOUT-BRIDGE] Item displayed: {Latte, qty:1...}
│  ├─ [CHECKOUT-BRIDGE] Item displayed: {Mocha, qty:1...}
│  ├─ [CHECKOUT-BRIDGE] All order items displayed successfully
│  │
│  ├─ [CHECKOUT-BRIDGE] Calculating totals for 3 items
│  ├─ [CHECKOUT-BRIDGE] Item 1: {product, price, qty, total}
│  ├─ [CHECKOUT-BRIDGE] Item 2: {product, price, qty, total}
│  ├─ [CHECKOUT-BRIDGE] Item 3: {product, price, qty, total}
│  ├─ [CHECKOUT-BRIDGE] Calculation summary
│  ├─ [CHECKOUT-BRIDGE] Updated subtotal: $15.00
│  ├─ [CHECKOUT-BRIDGE] Updated taxAmount: $1.50
│  ├─ [CHECKOUT-BRIDGE] Updated deliveryFee: $3.00
│  ├─ [CHECKOUT-BRIDGE] Updated checkoutTotal: $19.50
│  ├─ [CHECKOUT-BRIDGE] Total calculation complete
│  │
│  ├─ [CHECKOUT-BRIDGE] Binding payment form...
│  └─ [CHECKOUT-BRIDGE] Payment form bound successfully
│
├─ [CHECKOUT] Initialization complete
│
├─ User Activity
│  ├─ Selects Payment Method
│  │  └─ [CHECKOUT-BRIDGE] Payment method selected: card
│  │
│  └─ Clicks Complete Payment
│     ├─ [CHECKOUT-BRIDGE] Payment form submitted
│     ├─ [CHECKOUT-BRIDGE] Starting payment process...
│     ├─ [CHECKOUT-BRIDGE] Form validation passed
│     ├─ [CHECKOUT-BRIDGE] Loader shown
│     │  (2 second delay - simulating payment)
│     ├─ [CHECKOUT-BRIDGE] Payment processing timeout completed
│     ├─ [CHECKOUT-BRIDGE] Completing payment...
│     ├─ [CHECKOUT-BRIDGE] Order number generated: ORD-123456789
│     ├─ [CHECKOUT-BRIDGE] Payment data prepared
│     ├─ [CHECKOUT-BRIDGE] Payment record saved to localStorage
│     ├─ [CHECKOUT-BRIDGE] sessionStorage.checkoutData removed
│     ├─ [CHECKOUT-BRIDGE] localStorage.currentOrder removed
│     ├─ [CHECKOUT-BRIDGE] Showing success page for order
│     ├─ [CHECKOUT-BRIDGE] Order number displayed: ORD-123456789
│     └─ [CHECKOUT-BRIDGE] Success toast shown
│
└─ Success! Ready for user action or new checkout
```

---

## Data Flow State Diagram

```
                    ┌──────────────────────┐
                    │   USER LOGGED IN     │
                    │   ITEMS IN CART      │
                    └──────────┬───────────┘
                               │
                               │ Click Checkout
                               ▼
        ╔══════════════════════════════════════╗
        ║   COLLECTING ORDER DATA              ║
        ║   ✓ Validating user login            ║
        ║   ✓ Validating cart not empty        ║
        ║   ✓ Collecting items from table      ║
        ║   ✓ Building checkoutData object     ║
        ╚══════════════════════════════════════╝
                               │
                               │ All validation passed
                               ▼
        ╔══════════════════════════════════════╗
        ║   SAVING TO STORAGE                  ║
        ║   sessionStorage.setItem(             ║
        ║     'checkoutData',                  ║
        ║     JSON.stringify(checkoutData)     ║
        ║   )                                  ║
        ╚══════════════════════════════════════╝
                               │
                               │ Save successful
                               ▼
        ╔══════════════════════════════════════╗
        ║   REDIRECTING TO CHECKOUT            ║
        ║   window.location.href =             ║
        ║   'checkout.html'                    ║
        ║   (1.5 second delay)                 ║
        ╚══════════════════════════════════════╝
                               │
                               │ Page transition
                               ▼
        ╔══════════════════════════════════════╗
        ║   CHECKOUT PAGE LOADING              ║
        ║   ✓ Retrieving data from storage     ║
        ║   ✓ Validating data structure        ║
        ║   ✓ Parsing JSON                     ║
        ║   ✓ Verifying items array            ║
        ╚══════════════════════════════════════╝
                               │
                               │ Data retrieved
                               ▼
        ╔══════════════════════════════════════╗
        ║   POPULATING CUSTOMER INFO           ║
        ║   ✓ Reading from localStorage        ║
        ║   ✓ Filling customer fields          ║
        ║   ✓ Validating fields exist          ║
        ╚══════════════════════════════════════╝
                               │
                               │ Fields populated
                               ▼
        ╔══════════════════════════════════════╗
        ║   DISPLAYING ORDER ITEMS             ║
        ║   ✓ Creating item elements           ║
        ║   ✓ Calculating item totals           ║
        ║   ✓ Appending to container           ║
        ╚══════════════════════════════════════╝
                               │
                               │ Items displayed
                               ▼
        ╔══════════════════════════════════════╗
        ║   CALCULATING TOTALS                 ║
        ║   ✓ Computing subtotal               ║
        ║   ✓ Computing tax (10%)              ║
        ║   ✓ Computing delivery fee           ║
        ║   ✓ Computing final total            ║
        ║   ✓ Updating display                 ║
        ╚══════════════════════════════════════╝
                               │
                               │ Totals calculated
                               ▼
        ╔══════════════════════════════════════╗
        ║   FORM READY FOR INPUT               ║
        ║   ✓ Binding payment form             ║
        ║   ✓ Binding payment method selector  ║
        ║   ✓ Binding submit handler           ║
        ╚══════════════════════════════════════╝
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  │ User interactions       │
                  ▼                         ▼
        ┌──────────────────────┐  ┌────────────────────┐
        │ SELECT PAYMENT       │  │ FILL FORM FIELDS   │
        │ METHOD               │  │                    │
        │ • Card              │  │ • Full Name        │
        │ • Transfer          │  │ • Email            │
        │ • E-Wallet          │  │ • Phone            │
        │ • Cash on Delivery  │  │ • Address          │
        └──────────┬───────────┘  │ • Agree Terms      │
                   │              └────────────────────┘
                   │                      │
                   └──────────┬───────────┘
                              │
                              │ Click Complete Payment
                              ▼
        ╔══════════════════════════════════════╗
        ║   VALIDATING FORM                    ║
        ║   ✓ Checking all fields filled       ║
        ║   ✓ Validating card data (if card)   ║
        ║   ✓ Validating phone format          ║
        ║   ✓ Checking terms agreement         ║
        ╚══════════════════════════════════════╝
                               │
                  ┌────────────┴────────────┐
                  │                         │
         Validation Failed        Validation Passed
                  │                         │
                  │                         ▼
              [ERROR]            ╔═══════════════════════════╗
                  │              ║   PROCESSING PAYMENT      ║
                  │              ║   ✓ Showing loader        ║
                  │              ║   ✓ Simulating payment    ║
                  │              ║   ✓ 2 second delay        ║
                  │              ╚═════════════┬═════════════╝
                  │                            │
                  │                            ▼
                  │              ╔═══════════════════════════╗
                  │              ║   COMPLETING PAYMENT      ║
                  │              ║   ✓ Generating order #    ║
                  │              ║   ✓ Creating payment data  ║
                  │              ║   ✓ Saving to localStorage ║
                  │              ║   ✓ Clearing temp data     ║
                  │              ╚═════════════┬═════════════╝
                  │                            │
                  │                            ▼
                  │              ╔═══════════════════════════╗
                  │              ║   SHOWING SUCCESS PAGE    ║
                  │              ║   ✓ Hiding payment form   ║
                  │              ║   ✓ Showing success card  ║
                  │              ║   ✓ Displaying order #    ║
                  │              ║   ✓ Showing toast message ║
                  │              ╚═════════════┬═════════════╝
                  │                            │
                  │                            ▼
                  │              ╔═══════════════════════════╗
                  │              ║   PAYMENT COMPLETE ✓      ║
                  │              ║   Order saved            ║
                  │              ║   Ready for return or    ║
                  │              ║   new checkout           ║
                  │              ╚═══════════════════════════╝
                  │
                  └──────────────────────────┘
```

---

## Storage Lifecycle

```
LOCAL STORAGE (Persistent - Survives page refresh)
═════════════════════════════════════════════════════════════

Before Checkout:
├─ enauto_logged: "true"
├─ enauto_user: "John Doe"
├─ enauto_email: "john@example.com"
├─ enauto_photo: "base64image..."
├─ enauto_registered_users: "[{...user data...}]"
└─ paymentRecords: "[]" (empty or existing records)

After Checkout Success:
├─ enauto_logged: "true"
├─ enauto_user: "John Doe"
├─ enauto_email: "john@example.com"
├─ enauto_photo: "base64image..."
├─ enauto_registered_users: "[{...user data...}]"
└─ paymentRecords: "[{orderNumber, total, ...}, ...]" (NEW!)

SESSION STORAGE (Temporary - Cleared on browser close)
═════════════════════════════════════════════════════════════

During Checkout (index.html → checkout.html):
├─ checkoutData: {items, total, timestamp, ...}
└─ (other temporary session data)

After Payment Complete:
└─ checkoutData: (CLEARED by clearOrderData())

After Page Refresh on index.html:
└─ (All cleared - page reload cleared sessionStorage)
```

---

## Function Call Chain

```
initializeCheckout()
├─ getOrderDataFromSession()
│  ├─ sessionStorage.getItem('checkoutData')
│  ├─ JSON.parse(data)
│  └─ Validate items array
│
├─ populateCustomerInfo()
│  ├─ localStorage.getItem('enauto_user')
│  ├─ localStorage.getItem('enauto_email')
│  ├─ document.getElementById('customerName')
│  └─ document.getElementById('customerEmail')
│
├─ displayOrderItems(items)
│  ├─ document.getElementById('checkoutOrderItems')
│  └─ for each item: append element
│
├─ calculateTotals(items)
│  ├─ Calculate subtotal
│  ├─ Calculate tax (10%)
│  ├─ Calculate delivery fee
│  ├─ document.getElementById('subtotal').textContent
│  ├─ document.getElementById('taxAmount').textContent
│  ├─ document.getElementById('deliveryFee').textContent
│  └─ document.getElementById('checkoutTotal').textContent
│
└─ bindPaymentForm()
   └─ form.addEventListener('submit', processPayment)

selectPaymentMethod(element, method)
├─ Remove active class from all
└─ Add active class to selected

bindPaymentForm()
└─ document.getElementById('paymentForm').addEventListener('submit')

processPayment()
├─ validateCheckoutForm()
├─ showLoader('Processing Payment...')
└─ setTimeout(completePayment, 2000)

completePayment()
├─ generateOrderNumber()
├─ savePaymentRecord(paymentData)
├─ clearOrderData()
│  ├─ sessionStorage.removeItem('checkoutData')
│  └─ localStorage.removeItem('currentOrder')
└─ showPaymentSuccess(orderNumber)
   ├─ hideLoader()
   ├─ document.getElementById('checkoutForm').style.display = 'none'
   ├─ document.getElementById('paymentSuccess').classList.add('show')
   └─ Swal.fire(success notification)
```

---

**These visual diagrams show the complete flow of your checkout system!**
