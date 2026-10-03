# Quick Start: Deployment Testing

## 🚀 5-Minute Deployment Test

This is a condensed testing guide for Task 15.3. For comprehensive details, see `TASK-15.3-DEPLOYMENT-TEST-REPORT.md`.

---

## Test 1: Basic Functionality (2 minutes)

**What:** Verify app works via file:// protocol

**How:**
1. Double-click `index.html`
2. Add transaction: Name="Coffee", Amount=4.50, Category=Food
3. Refresh page (F5)
4. Verify transaction persists

**Expected:** ✓ Transaction appears and persists after reload

---

## Test 2: Private Browsing (1 minute)

**What:** Verify storage warning in private mode

**How:**
1. Open private window: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
2. Open `index.html`
3. Look for orange banner at top

**Expected:** ✓ "Storage unavailable" warning banner displays

---

## Test 3: Storage Cleared (1 minute)

**What:** Verify defaults load when storage is empty

**How:**
1. Open `index.html` normally
2. Press `F12` → Application tab → Clear storage
3. Reload page (`F5`)
4. Check categories dropdown

**Expected:** ✓ Shows default categories: Food, Transport, Fun

---

## Test 4: JavaScript Disabled (1 minute)

**What:** Verify graceful degradation message

**How:**
1. Disable JavaScript in browser settings
2. Open `index.html`
3. Observe displayed message

**Expected:** ✓ Clear "JavaScript Required" message with enable instructions

**Don't forget to re-enable JavaScript!**

---

## Test 5: Online Chart.js Loading (30 seconds)

**What:** Verify Chart.js loads from CDN

**How:**
1. Ensure internet connected
2. Open `index.html`
3. Add transactions in different categories
4. Scroll to "Spending by Category" chart

**Expected:** ✓ Pie chart displays with colors and legend

---

## ✅ All Tests Pass If:

- [x] App works via file:// protocol
- [x] Data persists in normal mode
- [x] Warning shows in private mode
- [x] Defaults load when storage cleared
- [x] Message shows when JS disabled
- [x] Chart renders when online

---

## 📊 Quick Results

| Test | Time | Expected Result |
|------|------|-----------------|
| Basic Functionality | 2 min | Transaction persists |
| Private Browsing | 1 min | Warning banner |
| Storage Cleared | 1 min | Default categories |
| JS Disabled | 1 min | Warning message |
| Chart Loading | 30 sec | Pie chart displays |

**Total Time:** ~5 minutes

---

## 🔧 Quick Fixes

**Problem:** Transaction doesn't persist  
**Solution:** Check if in private browsing mode

**Problem:** No chart displays  
**Solution:** Check internet connection (Chart.js CDN)

**Problem:** Blank page  
**Solution:** Check if JavaScript is enabled

---

## 📁 Files Reference

- `index.html` - Main application
- `test-deployment-scenarios.html` - Interactive test page
- `TASK-15.3-DEPLOYMENT-TEST-REPORT.md` - Detailed test report
- `TASK-15.3-COMPLETION-SUMMARY.md` - Task completion summary

---

## ✓ Task 15.3 Status: COMPLETED

All deployment scenarios validated ✓  
Requirements 10.2 & 10.3 compliant ✓  
Production ready ✓

---

**Need more details?** Open `test-deployment-scenarios.html` for interactive guided testing.
