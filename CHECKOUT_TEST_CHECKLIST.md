# 🧪 Checkout Integration Test Checklist

## Test Environment

- Browser: Chrome/Firefox/Edge (with DevTools)
- URL: `http://localhost:5500/` or your local server
- Press `F12` to open DevTools Console for log verification

---

## 📋 Pre-Test Setup

### ☐ 1. Clear Browser Storage

```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### ☐ 2. Open DevTools

- Press `F12` to open Developer Tools
- Go to **Console** tab
- Filter logs with: `[CHECKOUT-BRIDGE]`

### ☐ 3. Prepare Test User

- Have registration form ready
- Test with email: `test@example.com`
- Test password: `Test123`

---

## 🧪 Test Suite 1: Authentication & Cart Setup

### Test 1.1: Register New User

```
✅ Expected Behavior:
  □ Registration form accepts input
  □ User can upload profile photo
  □ Success message appears
  □ User is logged in automatically
  □ enauto_user stored in localStorage
  □ enauto_email stored in localStorage
  □ enauto_photo (base64) stored
```

### Test 1.2: Add Items to Cart

```
✅ Expected Behavior:
  □ Can select products from menu
  □ Items added to cart
  □ Cart table shows products
  □ Can adjust quantities
  □ Total price updates correctly
  □ Order table visible with items
```

### Test 1.3: Verify Cart State

```
✅ Expected Logs (should see):
  - No [CHECKOUT-BRIDGE] errors yet
  - User logged in status confirmed
  - At least 1 item in cart
```

---

## 🧪 Test Suite 2: Checkout Button Click

### Test 2.1: Click Checkout Button

```
✅ Expected Behavior:
  □ Toast appears: "✓ Preparing checkout..."
  □ Page doesn't change immediately
  □ Browser redirects after ~1.5 seconds
```

### Test 2.2: Verify Console Logs

```
✅ Expected Logs (in order):
  [CHECKOUT-BRIDGE] Checkout button clicked
  [CHECKOUT-BRIDGE] Item collected: {product, price, qty}
  [CHECKOUT-BRIDGE] Order data saved to sessionStorage: {itemCount, total, dataSize}
  [CHECKOUT-BRIDGE] Redirecting to checkout.html
```

### Test 2.3: Verify sessionStorage

```
✅ In Browser Console:
  sessionStorage.getItem('checkoutData')

Should return JSON like:
{
  "items": [{"product": "Espresso", "price": "5.00", "quantity": 2}],
  "total": "$15.50",
  "totalAmount": 15.50,
  "timestamp": "...",
  "userEmail": "test@example.com",
  "userName": "Test User"
}
```

---

## 🧪 Test Suite 3: Checkout Page Load

### Test 3.1: Page Loads Successfully

```
✅ Expected Behavior:
  □ checkout.html loads without errors
  □ Loader spinner disappears
  □ Page displays order summary
  □ Customer info fields populated
  □ Order items visible
  □ Totals calculated
```

### Test 3.2: Verify Console Logs

```
✅ Expected Logs (in order):
  [CHECKOUT-BRIDGE] Attempting to retrieve checkoutData from sessionStorage...
  [CHECKOUT-BRIDGE] Raw data retrieved (first 100 chars):...
  [CHECKOUT-BRIDGE] Data successfully parsed: {itemCount, total, ...}
  [CHECKOUT-BRIDGE] Populating customer info from localStorage...
  [CHECKOUT-BRIDGE] Customer name populated: Test User
  [CHECKOUT-BRIDGE] Customer email populated: test@example.com
  [CHECKOUT-BRIDGE] Displaying order items: N
  [CHECKOUT-BRIDGE] Item displayed: {product, qty, price, total}
  [CHECKOUT-BRIDGE] Calculating totals for N items
  [CHECKOUT-BRIDGE] Calculation summary: {subtotal, tax, delivery, total}
  [CHECKOUT-BRIDGE] Binding payment form...
  [CHECKOUT-BRIDGE] Payment form bound successfully
```

### Test 3.3: Verify Order Summary Display

```
✅ In Checkout Page:
  □ Order items show: Product name, Quantity, Price
  □ Subtotal calculated correctly
  □ Tax shown (10% of subtotal)
  □ Delivery fee shown or "FREE" if over $50
  □ Total amount displayed
```

### Test 3.4: Verify Customer Info

```
✅ In Checkout Page:
  □ Full Name field filled
  □ Email field filled
  □ Phone field editable
  □ Address field editable
```

---

## 🧪 Test Suite 4: Payment Method Selection

### Test 4.1: Select Credit Card

```
✅ Expected Behavior:
  □ Click on "Credit/Debit Card" option
  □ Option highlights as selected
  □ Card details form appears

✅ Expected Logs:
  [CHECKOUT-BRIDGE] Payment method selected: card
```

### Test 4.2: Card Details Form

```
✅ Expected Display:
  □ Cardholder Name field
  □ Card Number field (auto-formats with spaces)
  □ Expiry Date field (MM/YY format)
  □ CVV field (3 digits)
```

### Test 4.3: Select Other Payment Methods

```
✅ For Each Method:
  □ Bank Transfer - shows text info
  □ E-Wallet (GCash/PayMaya) - shows info
  □ Cash on Delivery - hides card details

✅ Expected Logs:
  [CHECKOUT-BRIDGE] Payment method selected: transfer
  [CHECKOUT-BRIDGE] Payment method selected: ewallet
  [CHECKOUT-BRIDGE] Payment method selected: cod
```

---

## 🧪 Test Suite 5: Form Validation

### Test 5.1: Valid Card Payment

```
✅ Fill with Valid Data:
  - Full Name: John Doe
  - Email: john@example.com
  - Phone: 08123456789
  - Address: Jl. Test Street 123
  - Cardholder: John Doe
  - Card Number: 4532015112830366
  - Expiry: 12/25
  - CVV: 123
  - ✅ Agree Terms checkbox

✅ Click "Complete Payment"
```

### Test 5.2: Validation Errors

```
❌ Test Missing Phone:
  - Leave Phone field empty
  - Click "Complete Payment"
  - Expected: Toast "Phone number is required"

❌ Test Invalid Card Number:
  - Enter: 12345
  - Expected: Toast "Invalid card number"

❌ Test Invalid Expiry:
  - Enter: 25/20 (wrong format)
  - Expected: Toast "Expiry date must be in MM/YY format"

❌ Test Invalid CVV:
  - Enter: 12 (only 2 digits)
  - Expected: Toast "CVV must be 3 digits"
```

### Test 5.3: Skip Required Fields

```
❌ Test Unchecked Terms:
  - Leave "Agree to Terms" unchecked
  - Expected: Toast "You must agree to terms"

❌ Test Missing Address:
  - Leave Delivery Address empty
  - Expected: Toast "Delivery address is required"
```

---

## 🧪 Test Suite 6: Payment Processing

### Test 6.1: Complete Payment

```
✅ With All Fields Valid:
  □ Click "Complete Payment" button
  □ Loader appears: "Processing Payment..."
  □ Wait for 2 seconds (simulated processing)

✅ Expected Logs:
  [CHECKOUT-BRIDGE] Payment form submitted
  [CHECKOUT-BRIDGE] Starting payment process...
  [CHECKOUT-BRIDGE] Form validation passed
  [CHECKOUT-BRIDGE] Loader shown, waiting for payment processing...
  [CHECKOUT-BRIDGE] Payment processing timeout completed, completing payment...
  [CHECKOUT-BRIDGE] Completing payment...
  [CHECKOUT-BRIDGE] Order number generated: ORD-XXXXXX
  [CHECKOUT-BRIDGE] Payment data prepared: {...}
  [CHECKOUT-BRIDGE] Payment record saved to localStorage
  [CHECKOUT-BRIDGE] Showing success page for order: ORD-XXXXXX
```

### Test 6.2: Success Page Display

```
✅ After Payment Completes:
  □ Loader disappears
  □ Payment form hidden
  □ Success page appears
  □ Order Number displayed: "ORD-XXXXXX"
  □ Success message shown
  □ Toast notification appears for 5 seconds
  □ "Back to Home" button visible
```

### Test 6.3: Verify Payment Record Saved

```
✅ In Browser Console:
  JSON.parse(localStorage.getItem('paymentRecords'))

Should show new record with:
  - orderNumber: "ORD-XXXXXX"
  - customerName: "John Doe"
  - customerEmail: "john@example.com"
  - total: 19.49 (or your total)
  - timestamp: ISO date string
```

---

## 🧪 Test Suite 7: Data Cleanup

### Test 7.1: Clear Order Data

```
✅ After Payment Success:
  □ Click "Back to Home" button
  □ Redirects to index.html
  □ Page reloads

✅ Expected Logs:
  [CHECKOUT-BRIDGE] Order data cleared
```

### Test 7.2: Verify sessionStorage Cleared

```
✅ In Browser Console:
  sessionStorage.getItem('checkoutData')

Should return: null
```

### Test 7.3: Verify Cart Cleared

```
✅ On index.html:
  □ Order table empty
  □ Total shows $0.00
  □ Can add new items again
```

---

## 🧪 Test Suite 8: Edge Cases

### Test 8.1: Empty Cart Checkout

```
❌ Procedure:
  1. Remove all items from cart (if any)
  2. Click Checkout button

✅ Expected:
  - Toast: "⚠ Keranjang masih kosong"
  - No redirect to checkout.html
  - Remain on index.html

✅ Expected Log:
  [CHECKOUT-BRIDGE] Cart is empty
```

### Test 8.2: Not Logged In

```
❌ Procedure:
  1. Logout from profile (click profile icon)
  2. Click Checkout button

✅ Expected:
  - Login modal appears
  - No redirect to checkout.html

✅ Expected Log:
  [CHECKOUT-BRIDGE] User not logged in
```

### Test 8.3: Page Refresh on Checkout

```
✅ Procedure:
  1. Reach checkout.html page
  2. Press F5 (refresh page)

✅ Expected:
  □ Page reloads successfully
  □ Order data still visible (from sessionStorage)
  □ All values intact

⚠️ Note: sessionStorage persists during page refresh
```

### Test 8.4: Multiple Items in Cart

```
✅ Procedure:
  1. Add 3 different products to cart
  2. Adjust quantities (e.g., 2x item1, 1x item2, 3x item3)
  3. Click Checkout

✅ Expected:
  □ All items appear in checkout page
  □ Totals calculated for all items
  □ Can complete payment
```

### Test 8.5: Large Order Amount

```
✅ Procedure:
  1. Add many items or expensive items
  2. Get subtotal > $50

✅ Expected:
  □ Delivery fee shows "FREE"
  □ Tax calculated correctly
  □ Total accurate
```

---

## 📊 Logging Checklist

### Check Console for All Expected Logs

```
Login Phase:
  ✅ [LOGIN] logs appear when signing in

Checkout Button Phase:
  ✅ [CHECKOUT-BRIDGE] Checkout button clicked
  ✅ [CHECKOUT-BRIDGE] Item collected (for each item)
  ✅ [CHECKOUT-BRIDGE] Order data saved to sessionStorage

Page Load Phase:
  ✅ [CHECKOUT-BRIDGE] Attempting to retrieve checkoutData
  ✅ [CHECKOUT-BRIDGE] Data successfully parsed
  ✅ [CHECKOUT-BRIDGE] Customer info populated
  ✅ [CHECKOUT-BRIDGE] Order items displayed
  ✅ [CHECKOUT-BRIDGE] Totals calculated
  ✅ [CHECKOUT-BRIDGE] Payment form bound

Payment Phase:
  ✅ [CHECKOUT-BRIDGE] Payment method selected
  ✅ [CHECKOUT-BRIDGE] Payment form submitted
  ✅ [CHECKOUT-BRIDGE] Form validation passed
  ✅ [CHECKOUT-BRIDGE] Payment processing timeout completed

Success Phase:
  ✅ [CHECKOUT-BRIDGE] Order number generated
  ✅ [CHECKOUT-BRIDGE] Payment record saved
  ✅ [CHECKOUT-BRIDGE] Showing success page
```

---

## 🐛 Troubleshooting

### If You See: "No order data found"

```
✅ Solution:
  1. Check browser console for errors
  2. Verify sessionStorage has checkoutData:
     sessionStorage.getItem('checkoutData')
  3. Make sure you clicked Checkout button (not refreshed)
  4. Try again from beginning
```

### If You See: Customer Fields Not Populated

```
✅ Solution:
  1. Check localStorage has user data:
     localStorage.getItem('enauto_user')
  2. Make sure you're logged in
  3. Verify login happened before checkout
```

### If You See: Order Items Missing

```
✅ Solution:
  1. Check console for "[CHECKOUT-BRIDGE] Displaying order items" log
  2. Verify checkoutOrderItems div exists
  3. Check items array in sessionStorage
```

### If Payment Doesn't Process

```
✅ Solution:
  1. Check all form fields are filled
  2. For card: use valid MM/YY expiry format
  3. For card: use exactly 3-digit CVV
  4. Check browser console for validation errors
  5. Try selecting different payment method
```

---

## ✅ Final Verification

After completing all tests, verify:

```
✅ Checkout button works
✅ Data transfers to checkout.html
✅ Order items display correctly
✅ Totals calculate with tax and delivery
✅ Payment methods can be selected
✅ Form validation works
✅ Payment processes successfully
✅ Success page appears
✅ Order number generated
✅ Payment record saved to localStorage
✅ Data cleared after payment
✅ Can checkout multiple times
✅ All console logs appear with [CHECKOUT-BRIDGE] prefix
✅ No JavaScript errors in console
✅ Responsive design works on mobile
```

---

## 📝 Test Report Template

```
Test Date: _______________
Tester: _______________
Browser: _______________

Failed Tests:
- _______________________
- _______________________

Issues Found:
- _______________________
- _______________________

Additional Notes:
- _______________________
- _______________________

Overall Status: ✅ PASS / ❌ FAIL
```

---

**Happy Testing! 🚀**

If all tests pass, your checkout integration is complete and working correctly!
