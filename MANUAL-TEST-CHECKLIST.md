# Manual Cross-Browser Testing Checklist

## Quick Reference Guide for Task 15.1

**Purpose:** This checklist provides a step-by-step manual testing guide for verifying cross-browser functionality of the Expense & Budget Visualizer application.

**Time Estimate:** 15-20 minutes per browser (total ~1 hour)

---

## Pre-Test Setup

### Step 1: Prepare Test Environment
- [ ] Ensure all target browsers are updated to latest stable version
- [ ] Open `index.html` in each browser
- [ ] Open browser DevTools (F12) Console tab
- [ ] Clear Local Storage (DevTools → Application/Storage → Local Storage → Clear)

### Step 2: Have Test Data Ready
Use consistent test data across all browsers:
```
Transaction 1: "Grocery Shopping" | $125.50 | Food
Transaction 2: "Gas Station" | $45.00 | Transport  
Transaction 3: "Movie Tickets" | $28.50 | Fun
Transaction 4: "Coffee" | $5.75 | Food
Transaction 5: "Bus Pass" | $85.00 | Transport

Expected Total: $289.75
```

---

## Browser Testing Matrix

Complete this checklist for EACH browser (Chrome, Firefox, Edge, Safari):

### Browser: _______________
**Version:** _______________  
**Date:** _______________

---

## ✅ Test Sequence

### 1. Initial Page Load (30 seconds)

**Expected:** Page loads within 2 seconds, all UI visible, no console errors

- [ ] Page loads without errors
- [ ] Load time: _____ seconds (must be < 2s)
- [ ] Header with title visible
- [ ] Theme toggle button visible
- [ ] Transaction form visible
- [ ] Balance display shows $0.00
- [ ] Transaction list shows empty state
- [ ] Chart section visible
- [ ] Monthly summary visible
- [ ] Category manager visible
- [ ] No JavaScript errors in console

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 2. Form Validation (2 minutes)

**Expected:** Inline error messages appear for invalid inputs

#### Test A: Empty name validation
- [ ] Leave "Item Name" empty
- [ ] Fill amount: 100
- [ ] Select category: Food
- [ ] Click "Add Transaction"
- [ ] Error message appears below name field
- [ ] Error mentions "empty" or "required"
- [ ] Form does NOT submit

#### Test B: Invalid amount validation
- [ ] Fill name: "Test Item"
- [ ] Fill amount: 0 (or negative)
- [ ] Click "Add Transaction"
- [ ] Error message appears below amount field
- [ ] Error mentions "minimum" or "0.01"

#### Test C: Missing category validation
- [ ] Fill name: "Test Item"
- [ ] Fill amount: 50
- [ ] Leave category as "Select category..."
- [ ] Click "Add Transaction"
- [ ] Error message appears below category field
- [ ] Error mentions "select" or "required"

#### Test D: Clear errors on focus
- [ ] Click into name field
- [ ] Error message clears

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 3. Add Transaction (1 minute)

**Expected:** Transaction added within 1 second, form clears, appears in list

- [ ] Fill name: "Grocery Shopping"
- [ ] Fill amount: 125.50
- [ ] Select category: Food
- [ ] Click "Add Transaction"
- [ ] Form clears immediately
- [ ] Transaction appears in list with correct details
- [ ] Balance updates to $125.50
- [ ] Chart updates to show Food category
- [ ] Response time: _____ ms (must be < 1000ms)

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 4. Multiple Transactions (3 minutes)

**Expected:** All transactions display correctly, balance calculates accurately

Add remaining test transactions:
- [ ] Transaction 2: Gas Station | $45.00 | Transport
- [ ] Transaction 3: Movie Tickets | $28.50 | Fun
- [ ] Transaction 4: Coffee | $5.75 | Food
- [ ] Transaction 5: Bus Pass | $85.00 | Transport

Verify:
- [ ] All 5 transactions appear in list
- [ ] Newest transaction at top (Bus Pass)
- [ ] Balance shows $289.75
- [ ] Chart shows 3 category segments (Food, Transport, Fun)
- [ ] Each category has distinct color
- [ ] Legend shows percentages (e.g., "Food 46.1%")
- [ ] List is scrollable if needed

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 5. Delete Transaction (1 minute)

**Expected:** Transaction deletes within 1 second, balance recalculates

- [ ] Click delete (X) button on "Coffee" transaction
- [ ] Transaction fades out smoothly
- [ ] Transaction removed from list
- [ ] Balance updates to $284.00 (289.75 - 5.75)
- [ ] Chart updates immediately
- [ ] Response time: _____ ms (must be < 1000ms)

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 6. Chart Interaction (1 minute)

**Expected:** Chart renders correctly with tooltips and legend

- [ ] Pie chart displays 3 segments
- [ ] Colors are visually distinct
- [ ] Hover over segment shows tooltip
- [ ] Tooltip shows category, amount, and percentage
- [ ] Legend on right shows all categories
- [ ] Legend shows percentages rounded to 1 decimal

**Special Test - Delete All Transactions:**
- [ ] Delete all remaining transactions
- [ ] Chart shows empty state message
- [ ] Message says "No spending data available" or similar

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 7. Local Storage Persistence (2 minutes)

**Expected:** Data persists across browser sessions

- [ ] Add 2 new transactions
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify key exists: `ebv_transactions_v1`
- [ ] Verify key exists: `ebv_categories_v1`
- [ ] Verify key exists: `ebv_theme_v1`
- [ ] Close browser tab completely
- [ ] Reopen `index.html`
- [ ] Transactions load within 500ms
- [ ] All data restored correctly
- [ ] Load time: _____ ms (must be < 500ms)

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 8. Theme Toggle (1 minute)

**Expected:** Theme switches within 300ms, all components update

#### Test Light → Dark:
- [ ] Note current theme (should be light/white background)
- [ ] Click theme toggle button (☀️/🌙)
- [ ] Background changes to dark within 300ms
- [ ] All text changes to light color
- [ ] All cards update to dark background
- [ ] Forms update to dark theme
- [ ] No components retain light theme colors
- [ ] Icon changes from sun to moon
- [ ] Transition time: _____ ms (must be < 300ms)

#### Test Persistence:
- [ ] Reload page
- [ ] Dark theme is restored
- [ ] No flash of light theme during load

#### Test Dark → Light:
- [ ] Click toggle again
- [ ] Switches back to light smoothly
- [ ] All components update

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 9. Category Management (2 minutes)

**Expected:** Default categories present, custom categories can be added

#### Test Defaults:
- [ ] Category dropdown shows "Food"
- [ ] Category dropdown shows "Transport"
- [ ] Category dropdown shows "Fun"

#### Test Add Custom Category:
- [ ] Type "Shopping" in category input
- [ ] Click "Add" button
- [ ] "Shopping" appears in dropdown within 500ms
- [ ] Can select "Shopping" for new transaction

#### Test Duplicate Validation:
- [ ] Type "shopping" (lowercase)
- [ ] Click "Add"
- [ ] Error message appears
- [ ] Message mentions "already exists" or "duplicate"

#### Test Empty Validation:
- [ ] Clear input (empty string)
- [ ] Click "Add"
- [ ] Error message appears
- [ ] Message mentions "empty" or "required"

#### Test Persistence:
- [ ] Reload page
- [ ] "Shopping" category still in dropdown

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 10. Monthly Summary (2 minutes)

**Expected:** Shows current month, calculates category totals

- [ ] Monthly Summary section visible
- [ ] Month dropdown shows current month selected
- [ ] Category rows display (Food, Transport, Fun)
- [ ] Each row shows:
  - [ ] Category name
  - [ ] Total amount
  - [ ] Visual bar (progress bar)
- [ ] Grand total at bottom
- [ ] Total matches balance display

#### Test Month Selection:
- [ ] Select previous month (if no data, skip)
- [ ] Summary recalculates within 2 seconds
- [ ] Shows "No expenses" if empty
- [ ] Calculation time: _____ ms (must be < 2000ms)

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 11. Keyboard Navigation (2 minutes)

**Expected:** All interactive elements accessible via keyboard

- [ ] Press Tab repeatedly
- [ ] Focus moves through all elements in order
- [ ] Focus indicators are visible (outline/highlight)
- [ ] Tab order: Name → Amount → Category → Submit → ...

#### Test Enter Key:
- [ ] Tab to submit button
- [ ] Press Enter
- [ ] Form submits (if valid)

#### Test Delete with Enter:
- [ ] Tab to delete button on transaction
- [ ] Press Enter
- [ ] Transaction deletes

#### Test Escape Key:
- [ ] Trigger validation error
- [ ] Press Escape
- [ ] Error clears (if implemented)

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 12. Accessibility Audit (2 minutes)

**Expected:** ARIA attributes present, screen reader friendly

#### Using DevTools Inspect:
- [ ] Theme toggle has `aria-label`
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages have `role="alert"`
- [ ] Error messages have `aria-live="polite"`
- [ ] Form inputs have `aria-describedby` linking to errors
- [ ] Delete buttons have descriptive labels

#### Quick Screen Reader Test (if available):
- [ ] Turn on screen reader (NVDA, JAWS, VoiceOver)
- [ ] Navigate through form
- [ ] Announcements are meaningful
- [ ] Error messages are read aloud

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 13. Console Error Check (1 minute)

**Expected:** No JavaScript errors during normal usage

- [ ] DevTools Console is open
- [ ] Perform all major actions:
  - [ ] Add transaction
  - [ ] Delete transaction
  - [ ] Toggle theme
  - [ ] Add category
  - [ ] Select month
- [ ] No red error messages in console
- [ ] No failed network requests
- [ ] Chart.js loaded successfully

**Count:**
- Errors: _____
- Warnings: _____
- Failed requests: _____

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 14. Visual Rendering (2 minutes)

**Expected:** Consistent styling, no layout issues

- [ ] Cards have rounded corners
- [ ] Cards have subtle shadows
- [ ] Buttons have hover effects
- [ ] Form inputs have focus indicators
- [ ] Borders render correctly
- [ ] Colors are consistent with theme
- [ ] No overlapping elements
- [ ] No clipped text
- [ ] Grid layout works (2-column on desktop)

**Special Check for Safari:**
- [ ] CSS Grid gaps render correctly
- [ ] CSS custom properties work
- [ ] Border radius on all corners

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

### 15. Mobile Responsive (2 minutes)

**Expected:** Layout adapts to small viewports

Using DevTools Device Emulation:
- [ ] Set viewport to 320px width
- [ ] Layout switches to single column
- [ ] All content visible (no horizontal scroll)
- [ ] Touch targets are at least 44px
- [ ] Text is readable
- [ ] Forms are usable

- [ ] Set viewport to 768px width
- [ ] Layout switches to 2-column (desktop)

- [ ] Set viewport to 1920px width
- [ ] Content centered, max-width applied
- [ ] No elements stretch too wide

**Result:** ⬜ PASS | ⬜ FAIL  
**Notes:** _______________________________________________

---

## Browser Completion Summary

### Overall Assessment

**Total Tests:** 15  
**Passed:** _____ / 15  
**Failed:** _____ / 15  
**Pass Rate:** _____ %

### Critical Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Minor Issues Found
1. _______________________________________________
2. _______________________________________________

### Browser-Specific Notes
_______________________________________________
_______________________________________________
_______________________________________________

### Final Verdict

⬜ **APPROVED** - All features work correctly  
⬜ **APPROVED WITH NOTES** - Minor issues, does not block release  
⬜ **REQUIRES FIXES** - Critical issues must be resolved  

**Tester Signature:** _______________  
**Date:** _______________

---

## Quick Comparison Matrix

After testing all 4 browsers, fill this in:

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Page Load | ⬜ | ⬜ | ⬜ | ⬜ |
| Form Validation | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Transaction | ⬜ | ⬜ | ⬜ | ⬜ |
| Delete Transaction | ⬜ | ⬜ | ⬜ | ⬜ |
| Balance Calculation | ⬜ | ⬜ | ⬜ | ⬜ |
| Chart Rendering | ⬜ | ⬜ | ⬜ | ⬜ |
| Local Storage | ⬜ | ⬜ | ⬜ | ⬜ |
| Theme Toggle | ⬜ | ⬜ | ⬜ | ⬜ |
| Categories | ⬜ | ⬜ | ⬜ | ⬜ |
| Monthly Summary | ⬜ | ⬜ | ⬜ | ⬜ |
| Keyboard Nav | ⬜ | ⬜ | ⬜ | ⬜ |
| Accessibility | ⬜ | ⬜ | ⬜ | ⬜ |
| No Errors | ⬜ | ⬜ | ⬜ | ⬜ |
| Visual Rendering | ⬜ | ⬜ | ⬜ | ⬜ |
| Responsive | ⬜ | ⬜ | ⬜ | ⬜ |

**Legend:**  
✅ = Pass | ❌ = Fail | ⚠️ = Pass with notes

---

## Tips for Efficient Testing

1. **Use a Second Monitor:** Display checklist on one screen, browser on another
2. **Copy Test Data:** Have test transaction data in a text file to copy/paste
3. **Take Screenshots:** Capture any visual issues for documentation
4. **Record Timings:** Use browser DevTools Performance tab for accurate measurements
5. **Test Sequentially:** Complete all tests in one browser before moving to next
6. **Document Everything:** Even small differences between browsers matter

---

## Common Issues to Watch For

### Chrome
- Usually the reference implementation (should work perfectly)
- Check DevTools for any performance warnings

### Firefox
- CSS Grid implementation may differ slightly
- Date parsing edge cases
- Local Storage behavior in private mode

### Edge
- Should be similar to Chrome (Chromium-based since 2020)
- Check for any legacy Edge-specific issues

### Safari
- **Most likely to have issues:**
  - CSS Grid gaps rendering
  - Flexbox edge cases
  - Date parsing (ISO 8601)
  - Local Storage in private browsing
  - CSS custom property support in older versions
- Pay special attention to visual rendering

---

## Reporting Issues

When documenting issues, include:
1. **Browser and version**
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshot or video** (if visual issue)
6. **Console errors** (if applicable)
7. **Severity:** Critical / High / Medium / Low

Example:
```
Browser: Safari 16.2
Issue: Chart legend text cut off
Steps: Add 3 transactions, view chart
Expected: Full category names visible
Actual: Text truncated with "..."
Severity: Low (cosmetic)
Screenshot: attached
```

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** QA Team
