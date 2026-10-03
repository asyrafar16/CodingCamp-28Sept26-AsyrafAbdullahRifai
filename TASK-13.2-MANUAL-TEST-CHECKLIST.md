# Task 13.2: Keyboard Navigation - Manual Testing Checklist

## Test Environment
- **Browser:** Open `index.html` in Chrome, Firefox, Edge, or Safari
- **Method:** Use ONLY keyboard (no mouse) for all tests
- **Keys Used:** Tab, Shift+Tab, Enter, Escape, Space

---

## Test 1: Basic Tab Navigation ✓
**Purpose:** Ensure all interactive elements are keyboard accessible

### Steps:
1. Open the application
2. Press Tab repeatedly
3. Observe focus moving through:
   - Theme toggle button (☀️/🌙)
   - Item Name input field
   - Amount input field
   - Category dropdown
   - Add Transaction button
   - New category input
   - Add category button
   - (If transactions exist) Delete buttons for each transaction
   - Month selector dropdown

### Expected Results:
- [ ] Focus moves in logical order
- [ ] All interactive elements can be reached
- [ ] Each focused element has visible green outline (2-3px)
- [ ] Outline is clearly visible in both light and dark themes
- [ ] No element is skipped
- [ ] Shift+Tab moves focus backward correctly

---

## Test 2: Theme Toggle Keyboard Control ✓
**Purpose:** Verify theme button works with keyboard

### Steps:
1. Tab to theme toggle button (first interactive element)
2. Press Enter key
3. Observe theme change to dark mode
4. Press Space key
5. Observe theme change back to light mode

### Expected Results:
- [ ] Enter key toggles theme
- [ ] Space key toggles theme
- [ ] Theme transition is smooth (300ms)
- [ ] Icon changes appropriately (☀️ ↔ 🌙)
- [ ] Focus indicator remains visible throughout

---

## Test 3: Form Error Messages with Escape Key ✓
**Purpose:** Verify Escape key clears error messages

### Steps:
1. Tab to Item Name field
2. Leave it empty
3. Tab to Amount field
4. Leave it empty
5. Tab to Add Transaction button
6. Press Enter (form submits with errors)
7. Observe error messages appear
8. Focus should automatically be on Item Name field
9. Press Escape key
10. Observe error message clears for Item Name
11. Tab to Amount field
12. Press Escape key
13. Observe error message clears for Amount

### Expected Results:
- [ ] Invalid form submission shows error messages
- [ ] Focus automatically moves to first error field (Item Name)
- [ ] Error messages are displayed in red below each field
- [ ] Escape key clears error for focused field
- [ ] Field remains focused after clearing error
- [ ] Can clear errors for each field independently

---

## Test 4: Delete Button Enter Key Support ✓
**Purpose:** Verify delete buttons work with Enter key

### Setup:
1. Add 3 transactions using the form (use mouse for setup)
   - Transaction 1: "Coffee", $5.00, Food
   - Transaction 2: "Bus Fare", $2.50, Transport
   - Transaction 3: "Movie", $15.00, Fun

### Steps:
1. Tab through the form until you reach first delete button (×)
2. Verify focus indicator shows on delete button
3. Press Enter key
4. Observe transaction deletion with fade animation
5. Tab to next delete button
6. Press Enter key
7. Repeat for remaining transactions

### Expected Results:
- [ ] Delete button shows clear focus indicator when tabbed to
- [ ] Enter key triggers delete action
- [ ] Transaction fades out smoothly (300ms animation)
- [ ] Transaction is removed from list
- [ ] Focus moves to next transaction's delete button
- [ ] If no next transaction, focus moves to previous
- [ ] When last transaction deleted, focus moves to Item Name field

---

## Test 5: Focus Management After Deletion ✓
**Purpose:** Verify focus is properly managed when transactions are deleted

### Setup:
Add 4 transactions (any data)

### Test 5a: Delete from Middle
1. Tab to 2nd transaction's delete button
2. Press Enter
3. Observe focus moves to 3rd transaction's delete button (which is now 2nd)

**Expected:**
- [ ] Focus moves to next transaction after deletion

### Test 5b: Delete Last Transaction
1. Tab to last transaction's delete button
2. Press Enter
3. Observe focus moves to previous transaction's delete button

**Expected:**
- [ ] Focus moves to previous transaction when deleting last one

### Test 5c: Delete Only Transaction
1. Delete all transactions except one
2. Tab to the last delete button
3. Press Enter
4. Observe focus moves to Item Name field

**Expected:**
- [ ] Focus moves to form when no transactions remain
- [ ] Empty state message appears: "No transactions recorded"

---

## Test 6: Category Manager Keyboard Support ✓
**Purpose:** Verify category management works with keyboard

### Steps:
1. Tab to "New category name" input field
2. Type "Shopping"
3. Press Enter key
4. Observe category added to list
5. Tab back to category input
6. Type "Inv@lid!"
7. Press Enter
8. Observe error message (if validator catches special chars)
9. Press Escape key
10. Observe input cleared and error removed

### Expected Results:
- [ ] Enter key in category input adds valid category
- [ ] New category appears in category list display
- [ ] New category appears in form dropdown
- [ ] Invalid category shows error message
- [ ] Escape key clears input and error
- [ ] Tab moves between input and Add button normally

---

## Test 7: Form Validation Auto-Focus ✓
**Purpose:** Verify focus moves to first error on validation failure

### Test 7a: Empty Name
1. Tab to Amount field
2. Type "10.00"
3. Tab to Category dropdown
4. Select "Food"
5. Tab to Add Transaction button
6. Press Enter
7. Observe focus returns to Item Name field

**Expected:**
- [ ] Form doesn't submit
- [ ] Error appears: "Item name cannot be empty"
- [ ] Focus is on Item Name field

### Test 7b: Invalid Amount
1. Type "Test Item" in Item Name
2. Tab to Amount
3. Type "0.001" (below minimum)
4. Tab to Category, select "Food"
5. Press Enter on Add Transaction button
6. Observe focus on Amount field

**Expected:**
- [ ] Form doesn't submit
- [ ] Error appears: "Amount must be at least 0.01"
- [ ] Focus is on Amount field

### Test 7c: No Category Selected
1. Type "Test Item" in Item Name
2. Type "10.00" in Amount
3. Leave Category as "Select category..."
4. Press Enter on Add Transaction
5. Observe focus on Category dropdown

**Expected:**
- [ ] Form doesn't submit
- [ ] Error appears: "Please select a category"
- [ ] Focus is on Category field

---

## Test 8: Toast Notification Keyboard Control ✓
**Purpose:** Verify toast notifications can be closed with keyboard

### Setup (Simulate Storage Error):
This is harder to test manually, but you can check the code implementation

### Alternative Test:
1. Review the code implementation in NotificationManager
2. Confirm toast close button has keydown listeners
3. Verify Enter and Escape keys are handled

### Expected (Code Review):
- [ ] Toast close button has `addEventListener('keydown', ...)`
- [ ] Handler checks for Enter key
- [ ] Handler checks for Escape key
- [ ] Both keys call `dismissToast()`

---

## Test 9: Accessibility Compliance ✓
**Purpose:** Ensure WCAG 2.1 AA compliance

### Test 9a: No Keyboard Trap
1. Tab through entire application
2. Continue tabbing until focus cycles back to beginning
3. Verify you can always move focus away from any element

**Expected:**
- [ ] No element traps keyboard focus
- [ ] Tab always moves to next element
- [ ] Shift+Tab always moves to previous element

### Test 9b: Focus Indicators Always Visible
1. Test in light mode - tab through all elements
2. Toggle to dark mode (using keyboard)
3. Tab through all elements again
4. Verify outlines are visible in both themes

**Expected:**
- [ ] Focus indicators visible in light mode
- [ ] Focus indicators visible in dark mode
- [ ] Green outline contrasts with both backgrounds
- [ ] Outline doesn't disappear or become invisible

### Test 9c: Logical Tab Order
1. Tab through application
2. Verify order matches visual layout
3. Verify order is intuitive

**Expected Tab Order:**
1. Theme toggle (header)
2. Item Name (top-left)
3. Amount (top-left)
4. Category (top-left)
5. Add Transaction button (top-left)
6. Category input (left)
7. Add Category button (left)
8. Delete buttons (left, top to bottom)
9. Month selector (right)

---

## Test 10: Cross-Browser Compatibility ✓
**Purpose:** Ensure keyboard navigation works in all major browsers

### Steps:
Repeat Tests 1-7 in each browser:
- [ ] Chrome (latest stable)
- [ ] Firefox (latest stable)
- [ ] Edge (latest stable)
- [ ] Safari (latest stable - Mac only)

### Expected:
- [ ] All keyboard shortcuts work identically
- [ ] Focus indicators appear in all browsers
- [ ] No browser-specific issues
- [ ] Performance is acceptable (<300ms response)

---

## Test 11: Rapid Keyboard Interaction ✓
**Purpose:** Ensure app handles rapid keyboard input

### Steps:
1. Add a transaction quickly:
   - Tab, Type name, Tab, Type amount, Tab, Arrow to select category, Enter
2. Immediately add another transaction
3. Tab to delete button
4. Press Enter rapidly on multiple delete buttons

### Expected Results:
- [ ] Form responds correctly to rapid input
- [ ] No lag or frozen interface
- [ ] All actions complete successfully
- [ ] Focus management still works correctly
- [ ] No JavaScript errors in console

---

## Defect Reporting Template

If any test fails, report using this format:

```
DEFECT: [Brief description]
Test: [Test number and name]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result: [What should happen]
Actual Result: [What actually happened]
Browser: [Chrome/Firefox/Edge/Safari + version]
Severity: [High/Medium/Low]
```

---

## Success Criteria

Task 13.2 is considered COMPLETE when:
- [ ] All 11 tests pass
- [ ] No keyboard traps exist
- [ ] All interactive elements have visible focus indicators
- [ ] All error messages can be dismissed with Escape
- [ ] Delete buttons work with Enter key
- [ ] Focus is managed correctly during deletion
- [ ] Auto-focus moves to first error field
- [ ] Works in all 4 major browsers
- [ ] No console errors
- [ ] Meets WCAG 2.1 AA accessibility standards

---

## Notes

- Use Chrome DevTools Console (F12) to check for JavaScript errors
- If focus indicator is not visible, check browser zoom level (should be 100%)
- Some tests require adding data first - use mouse for setup only
- Test in clean browser profile to avoid extension interference
- Use "Keyboard Only" mode if browser provides it (some accessibility features)

## Additional Verification

After completing all tests, run through the application one more time using ONLY the keyboard from start to finish:
1. Open application
2. Add 3 transactions
3. Delete 1 transaction
4. Add a custom category
5. Toggle theme
6. View monthly summary
7. Delete remaining transactions
8. Close application

If you can complete this workflow entirely with keyboard, Task 13.2 is successful! ✓
