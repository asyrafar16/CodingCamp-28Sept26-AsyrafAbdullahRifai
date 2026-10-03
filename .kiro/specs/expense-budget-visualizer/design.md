# Technical Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a client-side web application built with vanilla HTML, CSS, and JavaScript. It enables users to track personal expenses, categorize spending, and visualize budget distribution without requiring any backend infrastructure. All data persistence is handled through the browser's Local Storage API, making the application completely self-contained and portable.

### Key Design Goals

1. **Zero Dependencies (Except Chart.js)**: Use only native Web APIs and vanilla JavaScript, avoiding frameworks and build tools
2. **Simplicity**: Single-file architecture for HTML, CSS, and JavaScript for easy deployment
3. **Performance**: Sub-second response times for all user interactions
4. **Portability**: Deployable as a standalone HTML file via `file://` protocol or as a browser extension
5. **Maintainability**: Clear separation of concerns despite single-file constraint

### Technology Stack

- **HTML5**: Semantic markup for accessibility and structure
- **CSS3**: Custom properties for theming, Flexbox/Grid for layout
- **Vanilla JavaScript (ES6+)**: Module pattern for organization
- **Chart.js (v4.x)**: Pie chart visualization via CDN
- **Local Storage API**: Client-side data persistence

---

## Architecture

### High-Level Structure

The application follows a Model-View-Controller (MVC) inspired architecture adapted for vanilla JavaScript:

```
┌─────────────────────────────────────────────┐
│              index.html                     │
│  ┌────────────────────────────────────┐    │
│  │         App Controller              │    │
│  │  (Initialization & Coordination)    │    │
│  └────────┬──────────────┬─────────────┘    │
│           │              │                   │
│  ┌────────▼─────┐  ┌────▼──────────────┐   │
│  │   Storage    │  │   UI Components    │   │
│  │   Manager    │  │ - TransactionForm  │   │
│  │              │  │ - TransactionList  │   │
│  └──────────────┘  │ - BalanceDisplay   │   │
│                    │ - PieChart         │   │
│                    │ - CategoryManager  │   │
│                    │ - MonthlySummary   │   │
│                    │ - ThemeToggle      │   │
│                    └────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Component Organization

The JavaScript architecture uses the **Revealing Module Pattern** to encapsulate functionality while maintaining clear interfaces:

1. **StorageManager**: Handles all Local Storage operations (read, write, error handling)
2. **DataModel**: Maintains in-memory state and provides data manipulation methods
3. **Validator**: Input validation logic separated from UI concerns
4. **UI Components**: Each major UI element (form, list, chart, etc.) is a self-contained module
5. **AppController**: Orchestrates initialization and inter-component communication

### Event Flow

```
User Action (e.g., "Add Transaction")
         ↓
   UI Component (TransactionForm)
         ↓
   Validator (validate inputs)
         ↓
   DataModel (update state)
         ↓
   StorageManager (persist to Local Storage)
         ↓
   Event Emission (custom event)
         ↓
   Multiple Listeners (List, Balance, Chart)
         ↓
   UI Re-render
```

This event-driven approach decouples components: when data changes, a custom event is dispatched, and interested components update themselves independently.

---

## Components and Interfaces

### 1. StorageManager

**Responsibility**: Abstract Local Storage operations with error handling and data serialization.

**Interface**:
```javascript
StorageManager = {
  save(key, data): boolean
  load(key): object | null
  clear(key): boolean
  isAvailable(): boolean
}
```

**Key Design Decisions**:
- All data is JSON-serialized before storage
- Quota exceeded errors are caught and reported to UI
- Private browsing mode detection via storage availability check
- Schema versioning for future compatibility (v1 format initially)

**Storage Keys**:
- `ebv_transactions_v1`: Array of transaction objects
- `ebv_categories_v1`: Array of category strings
- `ebv_theme_v1`: String ("light" or "dark")

### 2. DataModel

**Responsibility**: Maintain application state in memory and provide data manipulation methods.

**Interface**:
```javascript
DataModel = {
  // Transaction operations
  addTransaction(transaction): void
  deleteTransaction(id): void
  getAllTransactions(): array
  getTransactionsByMonth(year, month): array
  
  // Category operations
  addCategory(name): boolean
  getAllCategories(): array
  
  // Computed values
  getTotalBalance(): number
  getCategoryTotals(): object
  
  // Events
  on(eventName, callback): void
}
```

**State Structure**:
```javascript
{
  transactions: [
    {
      id: string (UUID v4),
      name: string,
      amount: number,
      category: string,
      date: string (ISO 8601),
      timestamp: number
    }
  ],
  categories: [
    "Food",
    "Transport", 
    "Fun",
    ...custom categories
  ]
}
```

**Event System**:
- `transaction:added`
- `transaction:deleted`
- `category:added`
- `data:loaded`

This allows components to subscribe to changes without tight coupling.

### 3. Validator

**Responsibility**: Validate user inputs according to requirements specifications.

**Interface**:
```javascript
Validator = {
  validateTransactionName(name): { valid: boolean, error: string }
  validateAmount(amount): { valid: boolean, error: string }
  validateCategory(category): { valid: boolean, error: string }
  validateCategoryName(name, existingCategories): { valid: boolean, error: string }
}
```

**Validation Rules**:
- **Transaction Name**: 1-100 characters, not empty after trim
- **Amount**: Numeric, 0.01 to 999999999.99, max 2 decimal places
- **Category**: Must be selected, must exist in category list
- **Category Name**: 1-50 characters, not only whitespace, case-insensitive uniqueness check

### 4. TransactionForm Component

**Responsibility**: Render the input form and handle user submission.

**Interface**:
```javascript
TransactionForm = {
  init(containerElement): void
  reset(): void
  showError(fieldName, message): void
  clearErrors(): void
}
```

**UI Structure**:
```
┌──────────────────────────────┐
│ Add New Expense              │
├──────────────────────────────┤
│ Item Name: [_______________] │
│           error message      │
│ Amount: [_______]            │
│        error message         │
│ Category: [▼ Select]         │
│          error message       │
│          [Add Transaction]   │
└──────────────────────────────┘
```

**Behavior**:
- On submit: validate all fields, show inline errors or add transaction
- Clear errors on field focus
- Disable submit button during validation
- Reset form after successful submission

### 5. TransactionList Component

**Responsibility**: Display scrollable list of all transactions with delete functionality.

**Interface**:
```javascript
TransactionList = {
  init(containerElement): void
  render(transactions): void
  showEmpty(): void
}
```

**UI Structure**:
```
┌─────────────────────────────────────┐
│ Your Expenses                       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🍕 Pizza · $15.00 · Food     [X]│ │
│ │ 🚗 Gas · $45.00 · Transport  [X]│ │
│ │ 🎬 Movie · $12.50 · Fun      [X]│ │
│ └─────────────────────────────────┘ │
│           (scrollable)              │
└─────────────────────────────────────┘
```

**Behavior**:
- Auto-scroll to bottom when new transaction is added
- Smooth deletion animation (fade out, then remove)
- Empty state: "No transactions recorded. Start by adding one above!"

### 6. BalanceDisplay Component

**Responsibility**: Show total spending calculation prominently.

**Interface**:
```javascript
BalanceDisplay = {
  init(containerElement): void
  update(total): void
}
```

**UI Structure**:
```
┌──────────────────────────────┐
│   Total Spending             │
│   $1,234.56                  │
└──────────────────────────────┘
```

**Behavior**:
- Format currency with 2 decimal places and thousands separators
- Animate number changes with brief highlight effect
- Support negative amounts (red color)

### 7. PieChart Component

**Responsibility**: Render interactive pie chart using Chart.js showing category distribution.

**Interface**:
```javascript
PieChart = {
  init(canvasElement): void
  update(categoryTotals): void
  destroy(): void
}
```

**Chart.js Configuration**:
```javascript
{
  type: 'pie',
  data: {
    labels: ['Food', 'Transport', 'Fun'],
    datasets: [{
      data: [150, 75, 50],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', ...]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            // Custom labels showing category + percentage
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Show category, amount, and percentage
          }
        }
      }
    }
  }
}
```

**Color Palette**:
Pre-defined array of 20 distinct colors ensuring visual differentiation. Colors are assigned deterministically based on category index.

**Behavior**:
- Re-render on data change by destroying and recreating chart instance
- Empty state: Show placeholder message "No spending data available"
- Display "Uncategorized" segment for any transactions without matching category

### 8. CategoryManager Component

**Responsibility**: Allow users to add custom spending categories.

**Interface**:
```javascript
CategoryManager = {
  init(containerElement): void
  refresh(): void
  showError(message): void
}
```

**UI Structure**:
```
┌──────────────────────────────┐
│ Manage Categories            │
├──────────────────────────────┤
│ Current: Food, Transport,    │
│          Fun, Shopping       │
│                              │
│ Add New: [_____________] [+] │
│          error message       │
└──────────────────────────────┘
```

**Behavior**:
- Default categories: "Food", "Transport", "Fun" (loaded on first run)
- Case-insensitive duplicate detection
- Update both form dropdown and category list in real-time
- Persist immediately to Local Storage

### 9. MonthlySummary Component

**Responsibility**: Display spending totals grouped by category for a selected month.

**Interface**:
```javascript
MonthlySummary = {
  init(containerElement): void
  show(): void
  hide(): void
  selectMonth(year, month): void
}
```

**UI Structure**:
```
┌──────────────────────────────────┐
│ Monthly Summary                  │
│ Month: [▼ January 2024]          │
├──────────────────────────────────┤
│ Food         $150.00  ████████  │
│ Transport    $75.00   ████      │
│ Fun          $50.00   ███       │
├──────────────────────────────────┤
│ Total        $275.00             │
└──────────────────────────────────┘
```

**Behavior**:
- Month selector populated with all months that have transactions
- Default to current month
- Filter transactions by date within selected month boundaries
- Exclude zero/negative amounts from totals
- Empty state: "No expenses recorded for this month"

### 10. ThemeToggle Component

**Responsibility**: Switch between dark and light visual themes.

**Interface**:
```javascript
ThemeToggle = {
  init(buttonElement): void
  setTheme(theme): void
  getTheme(): string
}
```

**UI Structure**:
```
┌────────┐
│ 🌙/☀️  │  (toggle button with icon)
└────────┘
```

**Implementation Strategy**:
- Use `data-theme` attribute on `<html>` element
- CSS custom properties for all colors
- Toggle classes, not inline styles
- Persist preference to Local Storage
- Smooth transition (300ms) via CSS

---

## Data Models

### Transaction Schema

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",  // UUID v4
  name: "Grocery shopping",                     // 1-100 chars
  amount: 45.67,                                // 0.01 - 999999999.99
  category: "Food",                             // must exist in categories list
  date: "2024-01-15T10:30:00.000Z",            // ISO 8601 string
  timestamp: 1705318200000                      // Unix timestamp (for sorting)
}
```

**Constraints**:
- `id`: Must be unique across all transactions
- `amount`: Stored as number, formatted on display
- `date`: Captured at transaction creation time
- `timestamp`: Used for deterministic sort order (newest first)

### Category Schema

```javascript
// Stored as simple array
["Food", "Transport", "Fun", "Shopping", "Bills"]
```

**Constraints**:
- Case-insensitive uniqueness
- Max 50 characters per category name
- Minimum 3 default categories always present
- No empty or whitespace-only strings

### Local Storage Schema (v1)

**Key: `ebv_transactions_v1`**
```javascript
{
  version: "1.0",
  data: [
    { id: "...", name: "...", amount: 45.67, category: "Food", date: "...", timestamp: 1234567890 },
    // ...more transactions
  ]
}
```

**Key: `ebv_categories_v1`**
```javascript
{
  version: "1.0",
  data: ["Food", "Transport", "Fun", "Shopping"]
}
```

**Key: `ebv_theme_v1`**
```javascript
{
  version: "1.0",
  data: "dark"  // or "light"
}
```

**Schema Versioning Strategy**:
- Version number included in every stored object
- Future versions can migrate data by checking version field
- Migration logic runs once on load if version mismatch detected

---

## HTML Structure and Layout

### File Organization

```
expense-budget-visualizer/
├── index.html           (single HTML file with embedded CSS and JS)
├── css/
│   └── styles.css       (external CSS file - alternative structure)
└── js/
    └── app.js           (external JS file - alternative structure)
```

Both deployment modes supported:
1. **Single-file mode**: All CSS and JS embedded in `index.html` for `file://` protocol compatibility
2. **Multi-file mode**: Separated files for development, combined during manual deployment

### HTML Document Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense & Budget Visualizer</title>
  
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  
  <style>
    /* CSS content here or link to external file */
  </style>
</head>
<body>
  <div class="app-container">
    <header class="app-header">
      <h1>Expense & Budget Visualizer</h1>
      <button id="theme-toggle" aria-label="Toggle dark/light mode">
        <span class="icon-sun">☀️</span>
        <span class="icon-moon">🌙</span>
      </button>
    </header>
    
    <main class="app-main">
      <!-- Balance Display -->
      <section id="balance-section" class="card">
        <h2>Total Spending</h2>
        <div id="balance-display" class="balance-amount">$0.00</div>
      </section>
      
      <!-- Transaction Form -->
      <section id="form-section" class="card">
        <h2>Add New Expense</h2>
        <form id="transaction-form">
          <div class="form-group">
            <label for="item-name">Item Name</label>
            <input type="text" id="item-name" name="name" 
                   maxlength="100" required>
            <span class="error-message"></span>
          </div>
          
          <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="amount" name="amount" 
                   min="0.01" max="999999999.99" step="0.01" required>
            <span class="error-message"></span>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" required>
              <option value="">Select category...</option>
            </select>
            <span class="error-message"></span>
          </div>
          
          <button type="submit" class="btn-primary">Add Transaction</button>
        </form>
      </section>
      
      <!-- Category Manager -->
      <section id="category-section" class="card">
        <h2>Manage Categories</h2>
        <div id="current-categories" class="category-list"></div>
        <div class="category-input-group">
          <input type="text" id="new-category" placeholder="New category name" 
                 maxlength="50">
          <button id="add-category-btn" class="btn-secondary">Add</button>
        </div>
        <span class="error-message"></span>
      </section>
      
      <!-- Transaction List -->
      <section id="list-section" class="card">
        <h2>Your Expenses</h2>
        <div id="transaction-list" class="transaction-container"></div>
      </section>
      
      <!-- Pie Chart -->
      <section id="chart-section" class="card">
        <h2>Spending by Category</h2>
        <div class="chart-wrapper">
          <canvas id="pie-chart"></canvas>
        </div>
      </section>
      
      <!-- Monthly Summary -->
      <section id="summary-section" class="card">
        <h2>Monthly Summary</h2>
        <div class="month-selector">
          <label for="month-select">Select Month:</label>
          <select id="month-select"></select>
        </div>
        <div id="monthly-summary-content"></div>
      </section>
    </main>
    
    <footer class="app-footer">
      <p>All data stored locally in your browser</p>
    </footer>
  </div>
  
  <script>
    /* JavaScript content here or link to external file */
  </script>
</body>
</html>
```

### Layout Strategy

**Desktop (≥768px)**:
- Two-column grid layout
- Left column: Form, Categories, List (sticky scroll)
- Right column: Balance, Chart, Monthly Summary

**Mobile (<768px)**:
- Single column stack
- Balance at top (always visible)
- Form next for quick entry
- List, Chart, Summary follow

**CSS Grid Template**:
```css
.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  grid-template-areas:
    "balance balance"
    "form chart"
    "categories chart"
    "list summary";
}

@media (max-width: 767px) {
  .app-main {
    grid-template-columns: 1fr;
    grid-template-areas:
      "balance"
      "form"
      "categories"
      "list"
      "chart"
      "summary";
  }
}
```

---

## CSS Organization

### Theme System with CSS Custom Properties

All colors defined as CSS variables on the `:root` selector, overridden for `[data-theme="dark"]`:

```css
:root {
  /* Light Theme Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #dddddd;
  --accent-color: #4CAF50;
  --error-color: #f44336;
  --shadow: rgba(0, 0, 0, 0.1);
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 1.25rem;
  --font-size-xl: 2rem;
  
  /* Transitions */
  --transition-speed: 300ms;
}

[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #404040;
  --accent-color: #66BB6A;
  --error-color: #ef5350;
  --shadow: rgba(0, 0, 0, 0.3);
}
```

### Component Styling Patterns

**Card Component**:
```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px var(--shadow);
  transition: background var(--transition-speed), 
              border-color var(--transition-speed);
}
```

**Button Styles**:
```css
.btn-primary {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  cursor: pointer;
  transition: opacity var(--transition-speed);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### Responsive Design Utilities

```css
/* Hide on mobile */
@media (max-width: 767px) {
  .desktop-only { display: none; }
}

/* Hide on desktop */
@media (min-width: 768px) {
  .mobile-only { display: none; }
}

/* Scrollable container */
.scrollable {
  max-height: 400px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## JavaScript Architecture

### Module Pattern Structure

```javascript
// IIFE to avoid global pollution
(function() {
  'use strict';
  
  // ========================================
  // STORAGE MANAGER
  // ========================================
  const StorageManager = (function() {
    const STORAGE_AVAILABLE = checkStorageAvailability();
    
    function checkStorageAvailability() {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    function save(key, data) {
      if (!STORAGE_AVAILABLE) return false;
      try {
        const wrapper = { version: "1.0", data };
        localStorage.setItem(key, JSON.stringify(wrapper));
        return true;
      } catch (e) {
        console.error('Storage save failed:', e);
        return false;
      }
    }
    
    function load(key) {
      if (!STORAGE_AVAILABLE) return null;
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        return parsed.data;
      } catch (e) {
        console.error('Storage load failed:', e);
        return null;
      }
    }
    
    return { save, load, isAvailable: () => STORAGE_AVAILABLE };
  })();
  
  
  // ========================================
  // VALIDATOR
  // ========================================
  const Validator = (function() {
    function validateTransactionName(name) {
      const trimmed = name.trim();
      if (trimmed.length === 0) {
        return { valid: false, error: 'Item name cannot be empty' };
      }
      if (trimmed.length > 100) {
        return { valid: false, error: 'Item name cannot exceed 100 characters' };
      }
      return { valid: true, error: '' };
    }
    
    function validateAmount(amount) {
      const num = parseFloat(amount);
      if (isNaN(num)) {
        return { valid: false, error: 'Amount must be a number' };
      }
      if (num < 0.01) {
        return { valid: false, error: 'Amount must be at least 0.01' };
      }
      if (num > 999999999.99) {
        return { valid: false, error: 'Amount cannot exceed 999,999,999.99' };
      }
      // Check for max 2 decimal places
      if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
        return { valid: false, error: 'Amount can have at most 2 decimal places' };
      }
      return { valid: true, error: '' };
    }
    
    function validateCategory(category, categories) {
      if (!category || category.trim() === '') {
        return { valid: false, error: 'Please select a category' };
      }
      if (!categories.includes(category)) {
        return { valid: false, error: 'Selected category does not exist' };
      }
      return { valid: true, error: '' };
    }
    
    function validateCategoryName(name, existingCategories) {
      const trimmed = name.trim();
      if (trimmed.length === 0 || /^\s+$/.test(name)) {
        return { valid: false, error: 'Category name cannot be empty or only whitespace' };
      }
      if (trimmed.length > 50) {
        return { valid: false, error: 'Category name cannot exceed 50 characters' };
      }
      const lowerName = trimmed.toLowerCase();
      if (existingCategories.some(cat => cat.toLowerCase() === lowerName)) {
        return { valid: false, error: 'Category already exists' };
      }
      return { valid: true, error: '' };
    }
    
    return {
      validateTransactionName,
      validateAmount,
      validateCategory,
      validateCategoryName
    };
  })();
  
  
  // ========================================
  // DATA MODEL
  // ========================================
  const DataModel = (function() {
    let transactions = [];
    let categories = ['Food', 'Transport', 'Fun'];
    const listeners = {};
    
    function emit(eventName, data) {
      if (listeners[eventName]) {
        listeners[eventName].forEach(callback => callback(data));
      }
    }
    
    function on(eventName, callback) {
      if (!listeners[eventName]) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(callback);
    }
    
    function generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    function addTransaction(transaction) {
      const newTransaction = {
        id: generateId(),
        name: transaction.name.trim(),
        amount: parseFloat(transaction.amount),
        category: transaction.category,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      transactions.push(newTransaction);
      emit('transaction:added', newTransaction);
      return newTransaction;
    }
    
    function deleteTransaction(id) {
      const index = transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        const deleted = transactions.splice(index, 1)[0];
        emit('transaction:deleted', deleted);
        return true;
      }
      return false;
    }
    
    function getAllTransactions() {
      return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
    }
    
    function getTransactionsByMonth(year, month) {
      return transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });
    }
    
    function addCategory(name) {
      const trimmed = name.trim();
      if (!categories.includes(trimmed)) {
        categories.push(trimmed);
        emit('category:added', trimmed);
        return true;
      }
      return false;
    }
    
    function getAllCategories() {
      return [...categories];
    }
    
    function getTotalBalance() {
      return transactions.reduce((sum, t) => sum + t.amount, 0);
    }
    
    function getCategoryTotals() {
      const totals = {};
      transactions.forEach(t => {
        const cat = t.category || 'Uncategorized';
        totals[cat] = (totals[cat] || 0) + t.amount;
      });
      return totals;
    }
    
    function loadData() {
      const loadedTransactions = StorageManager.load('ebv_transactions_v1');
      const loadedCategories = StorageManager.load('ebv_categories_v1');
      
      if (loadedTransactions) {
        transactions = loadedTransactions;
      }
      if (loadedCategories) {
        categories = loadedCategories;
      }
      
      emit('data:loaded');
    }
    
    function saveData() {
      StorageManager.save('ebv_transactions_v1', transactions);
      StorageManager.save('ebv_categories_v1', categories);
    }
    
    return {
      addTransaction,
      deleteTransaction,
      getAllTransactions,
      getTransactionsByMonth,
      addCategory,
      getAllCategories,
      getTotalBalance,
      getCategoryTotals,
      on,
      loadData,
      saveData
    };
  })();
  
  
  // ========================================
  // UI COMPONENTS
  // ========================================
  
  // (TransactionForm, TransactionList, BalanceDisplay, 
  //  PieChart, CategoryManager, MonthlySummary, ThemeToggle)
  // Each implemented as revealing module with init(), render(), etc.
  
  
  // ========================================
  // APP CONTROLLER
  // ========================================
  const AppController = (function() {
    function init() {
      // Load data from storage
      DataModel.loadData();
      
      // Initialize all UI components
      ThemeToggle.init(document.getElementById('theme-toggle'));
      TransactionForm.init(document.getElementById('transaction-form'));
      TransactionList.init(document.getElementById('transaction-list'));
      BalanceDisplay.init(document.getElementById('balance-display'));
      PieChart.init(document.getElementById('pie-chart'));
      CategoryManager.init(document.getElementById('category-section'));
      MonthlySummary.init(document.getElementById('summary-section'));
      
      // Set up event listeners
      DataModel.on('transaction:added', handleTransactionAdded);
      DataModel.on('transaction:deleted', handleTransactionDeleted);
      DataModel.on('category:added', handleCategoryAdded);
      
      // Initial render
      renderAll();
    }
    
    function handleTransactionAdded(transaction) {
      DataModel.saveData();
      renderAll();
    }
    
    function handleTransactionDeleted(transaction) {
      DataModel.saveData();
      renderAll();
    }
    
    function handleCategoryAdded(category) {
      DataModel.saveData();
      TransactionForm.refreshCategories();
    }
    
    function renderAll() {
      TransactionList.render(DataModel.getAllTransactions());
      BalanceDisplay.update(DataModel.getTotalBalance());
      PieChart.update(DataModel.getCategoryTotals());
      MonthlySummary.refresh();
    }
    
    return { init };
  })();
  
  
  // ========================================
  // INITIALIZATION
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AppController.init);
  } else {
    AppController.init();
  }
  
})();
```

### Key Design Patterns

1. **IIFE (Immediately Invoked Function Expression)**: Wrap entire application to avoid global scope pollution
2. **Revealing Module Pattern**: Each module exposes only public API, keeps implementation private
3. **Observer Pattern**: Custom event system (`on()` and `emit()`) for component communication
4. **Single Responsibility**: Each module has one clear purpose
5. **Dependency Injection**: Components receive dependencies rather than accessing globals

---

## Chart.js Integration

### Loading Strategy

Chart.js is loaded via CDN in the HTML `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
```

This provides the global `Chart` object used by the PieChart component.

### Chart Configuration Details

```javascript
const PieChart = (function() {
  let chartInstance = null;
  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40',
    '#36A2EB', '#FFCE56', '#9966FF', '#FF6384', '#4BC0C0',
    '#C9CBCF', '#FF9F40', '#36A2EB', '#FFCE56', '#9966FF'
  ];
  
  function init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  }
  
  function update(categoryTotals) {
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const total = amounts.reduce((sum, val) => sum + val, 0);
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Handle empty state
    if (total === 0) {
      showEmptyState();
      return;
    }
    
    // Create new chart
    chartInstance = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: categories.map((_, i) => COLORS[i % COLORS.length]),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              generateLabels: function(chart) {
                const data = chart.data;
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label}: ${percentage}%`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  function showEmptyState() {
    // Display message in canvas or adjacent container
  }
  
  function destroy() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
  
  return { init, update, destroy };
})();
```

### Handling Chart Updates

- **Performance**: Destroying and recreating is acceptable for small datasets (<1000 transactions)
- **Alternative**: For larger datasets, use `chart.data.labels = ...` and `chart.update()` instead of destroy/recreate
- **Theme switching**: Chart colors are static, but border colors should match theme

---

## Component Interactions

### Adding a Transaction - Sequence Diagram

```
User                TransactionForm    Validator    DataModel    Storage    UI Components
  |                        |              |            |            |              |
  |--[Submit Form]-------->|              |            |            |              |
  |                        |--validate--->|            |            |              |
  |                        |<--result-----|            |            |              |
  |                        |                           |            |              |
  |                        |---addTransaction()------->|            |              |
  |                        |                           |--save()--->|              |
  |                        |                           |<--success--|              |
  |                        |                           |                           |
  |                        |                           |--emit('transaction:added')|
  |                        |                           |                           |
  |                        |<-------success------------|            |              |
  |<--[Form Reset]---------|                           |            |              |
  |                        |                           |            |              |
  |                        |                           |----------broadcast-------->|
  |                        |                           |            |              |
  |<---------------------------------------[UI Updates]<------------|              |
```

### Deleting a Transaction - Sequence Diagram

```
User            TransactionList    DataModel    Storage    BalanceDisplay    PieChart
  |                    |              |            |              |              |
  |--[Click Delete]--->|              |            |              |              |
  |                    |--deleteTransaction(id)-->|              |              |
  |                    |              |--save()--->|              |              |
  |                    |              |<--success--|              |              |
  |                    |              |                           |              |
  |                    |              |--emit('transaction:deleted')------------>|
  |                    |              |                           |              |
  |                    |<--success----|            |              |              |
  |<--[Fade Out]-------|              |            |              |              |
  |                    |              |            |              |              |
  |                    |              |--getTotalBalance()------->|              |
  |                    |              |--getCategoryTotals()--------------------->|
  |                    |              |            |              |              |
  |<----------------------[UI Updates]<-----------|<-------------|<-------------|
```

### Theme Toggle - Sequence Diagram

```
User            ThemeToggle    HTML Element    Storage    All Components
  |                    |              |            |              |
  |--[Click Toggle]--->|              |            |              |
  |                    |--setTheme('dark')-------->|              |
  |                    |              |            |              |
  |                    |--setAttribute('data-theme', 'dark')----->|
  |                    |              |            |              |
  |                    |--save('ebv_theme_v1')--->|              |
  |                    |              |<--success--|              |
  |                    |              |            |              |
  |<----------------------------------------[CSS Transition]----->|
```

---

## Theme Switching Mechanism

### Implementation Details

**HTML Attribute Approach**:
- Theme state stored as `data-theme` attribute on `<html>` element
- CSS uses attribute selector: `[data-theme="dark"]`
- JavaScript toggles attribute value between "light" and "dark"

**CSS Transition**:
```css
* {
  transition: background-color var(--transition-speed),
              color var(--transition-speed),
              border-color var(--transition-speed);
}
```

**Persistence**:
- Current theme saved to Local Storage on every toggle
- On app load, theme restored before first paint to avoid flash
- Fallback to "light" if no stored preference

**Initialization Logic**:
```javascript
const ThemeToggle = (function() {
  const STORAGE_KEY = 'ebv_theme_v1';
  let currentTheme = 'light';
  
  function init(buttonElement) {
    // Load saved theme
    const savedTheme = StorageManager.load(STORAGE_KEY);
    if (savedTheme) {
      currentTheme = savedTheme;
    }
    
    // Apply immediately
    setTheme(currentTheme);
    
    // Attach event listener
    buttonElement.addEventListener('click', toggleTheme);
  }
  
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    StorageManager.save(STORAGE_KEY, currentTheme);
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateIcon(theme);
  }
  
  function updateIcon(theme) {
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (theme === 'dark') {
      sunIcon.style.display = 'inline';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline';
    }
  }
  
  return { init, setTheme, getTheme: () => currentTheme };
})();
```

---

## Responsive Design Approach

### Breakpoint Strategy

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile Optimizations

1. **Touch Targets**: Minimum 44px tap areas for buttons and interactive elements
2. **Font Scaling**: Base font size 16px (no zoom on input focus in iOS)
3. **Scrolling**: Native smooth scrolling, no custom scrollbar styling
4. **Navigation**: All features accessible without horizontal scroll

### Layout Transformations

**Desktop**:
```
+-------------------+-------------------+
|    Balance        |                   |
+-------------------+     Chart         |
|    Form           |                   |
+-------------------+-------------------+
|    Categories     |   Summary         |
+-------------------+-------------------+
|    List           |                   |
|                   |                   |
+-------------------+-------------------+
```

**Mobile**:
```
+-------------------+
|    Balance        |
+-------------------+
|    Form           |
+-------------------+
|    Categories     |
+-------------------+
|    List           |
+-------------------+
|    Chart          |
+-------------------+
|    Summary        |
+-------------------+
```

### Performance Considerations

- **Minimize Reflows**: Batch DOM updates, use `documentFragment` for multiple insertions
- **Debounce Input**: Debounce validation on input fields (300ms delay)
- **Lazy Rendering**: Only render visible transactions in list (virtual scrolling for 500+ items)
- **Image Optimization**: Use SVG for icons (scalable, small file size)

---

## Error Handling

### Error Categories and Responses

| Error Type | Trigger | User Feedback | Fallback Behavior |
|------------|---------|---------------|-------------------|
| Storage Quota Exceeded | Adding transaction when Local Storage full | Toast notification: "Storage full. Please delete old transactions." | Transaction not saved, form remains filled |
| Storage Unavailable | Private browsing mode | Banner on load: "Storage unavailable. Data will not persist." | App functions but data is lost on close |
| Invalid Input | Form submission with invalid data | Inline error messages per field | Form not submitted, focus on first error |
| Chart.js Load Failure | CDN unavailable or blocked | Message in chart area: "Chart library could not load" | App continues, chart section hidden |
| Category Not Found | Transaction references deleted category | Assign to "Uncategorized" | Transaction remains valid |
| Data Corruption | Malformed JSON in Local Storage | Console error, reset to defaults | Empty transaction list, default categories |

### Error Display Components

**Inline Field Errors**:
```html
<div class="form-group error">
  <label for="amount">Amount</label>
  <input type="number" id="amount" aria-invalid="true" aria-describedby="amount-error">
  <span id="amount-error" class="error-message" role="alert">
    Amount must be at least 0.01
  </span>
</div>
```

**Toast Notifications** (for system errors):
```html
<div class="toast toast-error" role="alert">
  <span class="toast-icon">⚠️</span>
  <span class="toast-message">Storage quota exceeded</span>
  <button class="toast-close" aria-label="Close">×</button>
</div>
```

**Empty States** (for missing data):
```html
<div class="empty-state">
  <span class="empty-icon">📊</span>
  <p>No spending data available</p>
  <p class="empty-hint">Add your first transaction to see the chart</p>
</div>
```

### Error Recovery Strategies

1. **Storage Quota**: Offer bulk delete functionality, export data as JSON
2. **Corrupt Data**: Attempt to parse and recover partial data, fallback to empty state
3. **CDN Failure**: Provide fallback text-based category summary instead of pie chart
4. **Validation Failures**: Never clear form on error, preserve user input

---

## Testing Strategy

### Testing Applicability Assessment

This application is a **client-side web application** with significant UI interaction, browser API usage, and Chart.js integration. The testing strategy should reflect the nature of the code:

**Areas where property-based testing is NOT appropriate**:
- **UI rendering and layout**: Testing that components render correctly is visual, not computable
- **Chart.js integration**: Testing third-party library behavior (already tested by Chart.js authors)
- **Local Storage browser API**: Testing browser API behavior (standardized, tested by browser vendors)
- **Theme switching visual effects**: Testing CSS transitions and visual appearance

**Areas suitable for property-based testing**:
- **Validator logic**: Pure functions with clear input/output behavior
- **Data transformations**: Category totals calculation, monthly filtering
- **ID generation uniqueness**: UUID generation should produce unique values

**Primary testing approach for this application**:
- **Unit tests with specific examples** for most functionality
- **Integration tests** for component interactions
- **Manual testing** for visual/UX aspects
- **Limited property-based tests** only for pure logic functions

Given the nature of this application (UI-heavy, browser API dependent, third-party library integration), **property-based testing is NOT the primary testing strategy**. The Correctness Properties section will be **omitted** from this design, and testing will focus on example-based unit tests and integration tests.

### Unit Testing

**Testing Framework**: Use any modern JavaScript testing framework (Jest, Vitest, Mocha + Chai)

**Test Coverage Areas**:

1. **Validator Module**:
   - Valid inputs pass validation
   - Empty/whitespace inputs fail with correct error messages
   - Boundary values (0.01, 999999999.99, 1 char, 100 chars, 50 chars)
   - Invalid inputs (negative amounts, too many decimals, duplicate categories)

2. **DataModel Module**:
   - Adding transaction creates correct object structure
   - Deleting transaction removes from array
   - getTotalBalance() sums amounts correctly (including negatives)
   - getCategoryTotals() aggregates by category
   - getTransactionsByMonth() filters correctly
   - Event emission on data changes

3. **StorageManager Module**:
   - save() and load() round-trip correctly
   - Handles JSON parse errors gracefully
   - Detects storage unavailability
   - Version number included in stored objects

**Example Unit Test**:
```javascript
describe('Validator.validateAmount', () => {
  test('accepts valid amount', () => {
    const result = Validator.validateAmount('45.67');
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });
  
  test('rejects amount below minimum', () => {
    const result = Validator.validateAmount('0.001');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 0.01');
  });
  
  test('rejects more than 2 decimal places', () => {
    const result = Validator.validateAmount('10.999');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2 decimal places');
  });
});
```

### Integration Testing

**Test Scenarios**:

1. **Add Transaction Flow**:
   - Fill form with valid data → Submit → Transaction appears in list → Balance updates → Chart updates → Data saved to storage
   
2. **Delete Transaction Flow**:
   - Click delete on transaction → Confirm removal → Transaction removed from list → Balance recalculates → Chart updates → Storage updated

3. **Category Management Flow**:
   - Add custom category → Category appears in form dropdown → Use category in transaction → Category appears in chart

4. **Monthly Summary Flow**:
   - Add transactions in different months → Select month → Summary shows only transactions from that month → Category totals correct

5. **Theme Toggle Flow**:
   - Toggle theme → All UI components change colors → Preference saved → Reload page → Theme persists

**Integration Test Example** (using Playwright or Cypress):
```javascript
test('add transaction updates all components', async () => {
  // Navigate to app
  await page.goto('http://localhost:3000');
  
  // Fill form
  await page.fill('#item-name', 'Coffee');
  await page.fill('#amount', '5.50');
  await page.selectOption('#category', 'Food');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify transaction list
  const listItem = await page.textContent('#transaction-list');
  expect(listItem).toContain('Coffee');
  expect(listItem).toContain('$5.50');
  
  // Verify balance
  const balance = await page.textContent('#balance-display');
  expect(balance).toContain('5.50');
  
  // Verify chart (check canvas exists and has content)
  const canvas = await page.locator('#pie-chart');
  expect(await canvas.isVisible()).toBe(true);
});
```

### Browser Compatibility Testing

**Manual Test Matrix**:

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Local Storage | ✓ | ✓ | ✓ | ✓ |
| Chart.js Rendering | ✓ | ✓ | ✓ | ✓ |
| CSS Grid Layout | ✓ | ✓ | ✓ | ✓ |
| Dark Mode | ✓ | ✓ | ✓ | ✓ |
| Form Validation | ✓ | ✓ | ✓ | ✓ |

**Testing Checklist**:
- Test in incognito/private mode (storage restrictions)
- Test with browser storage cleared
- Test with JavaScript disabled (graceful degradation message)
- Test with Chart.js CDN blocked (fallback message)
- Test responsive breakpoints (320px, 768px, 1024px, 1920px)

### Performance Testing

**Metrics to Measure**:

1. **Initial Load Time**: App should render within 2 seconds on target hardware
2. **Add Transaction**: < 300ms from submit to UI update
3. **Delete Transaction**: < 300ms from click to removal
4. **Theme Toggle**: < 300ms transition time
5. **Monthly Summary Calculation**: < 2 seconds for any month

**Performance Test Example**:
```javascript
test('add transaction completes within 300ms', async () => {
  const startTime = performance.now();
  
  // Perform add transaction action
  await addTransaction({ name: 'Test', amount: 10, category: 'Food' });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  expect(duration).toBeLessThan(300);
});
```

### Accessibility Testing

**WCAG 2.1 AA Compliance Checklist**:

- [ ] All form inputs have associated labels
- [ ] Error messages linked via `aria-describedby`
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Theme toggle has descriptive `aria-label`
- [ ] Empty states provide informative messages
- [ ] Dynamic content changes announced via `role="alert"`

**Testing Tools**:
- axe DevTools browser extension
- Lighthouse accessibility audit
- Manual keyboard-only navigation testing

---

## Deployment and Distribution

### Deployment Options

**Option 1: Single HTML File (Recommended for `file://` protocol)**:
- Embed CSS and JavaScript directly in `index.html`
- Chart.js loaded via CDN (requires internet connection)
- User can double-click HTML file to open in browser
- No web server required

**Option 2: Static Web Hosting**:
- Upload `index.html`, `css/styles.css`, `js/app.js` to any static host
- Use services like GitHub Pages, Netlify, Vercel, or Cloudflare Pages
- Supports custom domain

**Option 3: Browser Extension**:
- Package as Chrome/Firefox extension with manifest.json
- Same codebase, no modifications needed
- Local Storage works identically in extension context

### Build Process (Optional)

For production deployment, optionally minify assets:

```bash
# Minify CSS
npx clean-css-cli -o styles.min.css styles.css

# Minify JavaScript
npx terser app.js -o app.min.js --compress --mangle

# Inline assets into single HTML (manual step or use build tool)
```

### Browser Extension Manifest (manifest.json)

```json
{
  "manifest_version": 3,
  "name": "Expense & Budget Visualizer",
  "version": "1.0.0",
  "description": "Track personal expenses and visualize spending",
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "permissions": ["storage"],
  "content_security_policy": {
    "extension_pages": "script-src 'self' https://cdn.jsdelivr.net; object-src 'self'"
  }
}
```

### Distribution Checklist

- [ ] Test in all target browsers (Chrome, Firefox, Edge, Safari)
- [ ] Test `file://` protocol (single HTML file)
- [ ] Verify Chart.js CDN link is current and stable
- [ ] Validate HTML, CSS, JavaScript (W3C validator, ESLint)
- [ ] Check accessibility (axe, Lighthouse)
- [ ] Compress assets for faster load
- [ ] Include README with usage instructions
- [ ] Document Local Storage data schema for data export/import

---

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

1. **Data Export/Import**:
   - Export transactions as JSON or CSV
   - Import from CSV for migration from other tools
   - Backup/restore functionality

2. **Recurring Transactions**:
   - Define recurring expenses (e.g., monthly bills)
   - Auto-add on schedule

3. **Budget Limits**:
   - Set monthly budget per category
   - Visual indicators when approaching limit
   - Alerts when exceeded

4. **Multi-Currency Support**:
   - Select currency in settings
   - Convert amounts for display

5. **Advanced Filtering**:
   - Filter transactions by date range, category, amount
   - Search by item name

6. **Data Sync**:
   - Optional cloud sync across devices
   - Requires backend API (breaks client-only constraint)

7. **Receipt Attachments**:
   - Attach images of receipts
   - Store in IndexedDB (larger storage than Local Storage)

8. **Analytics Dashboard**:
   - Spending trends over time (line chart)
   - Compare months side-by-side
   - Average spending per category

---

## Appendices

### A. Color Palette

**Light Theme**:
- Background Primary: `#ffffff`
- Background Secondary: `#f5f5f5`
- Text Primary: `#333333`
- Text Secondary: `#666666`
- Border: `#dddddd`
- Accent: `#4CAF50`
- Error: `#f44336`

**Dark Theme**:
- Background Primary: `#1e1e1e`
- Background Secondary: `#2d2d2d`
- Text Primary: `#e0e0e0`
- Text Secondary: `#a0a0a0`
- Border: `#404040`
- Accent: `#66BB6A`
- Error: `#ef5350`

### B. Browser Support Matrix

| Feature | Chrome | Firefox | Edge | Safari | Min Version |
|---------|--------|---------|------|--------|-------------|
| CSS Grid | ✓ | ✓ | ✓ | ✓ | Chrome 57+ |
| CSS Custom Properties | ✓ | ✓ | ✓ | ✓ | Chrome 49+ |
| Local Storage | ✓ | ✓ | ✓ | ✓ | All modern |
| ES6 Modules (if used) | ✓ | ✓ | ✓ | ✓ | Chrome 61+ |
| Chart.js v4 | ✓ | ✓ | ✓ | ✓ | Last 3 years |

### C. Local Storage Size Limits

- **Chrome**: 10MB
- **Firefox**: 10MB
- **Edge**: 10MB
- **Safari**: 5MB (iOS), 10MB (macOS)

**Estimated Data Usage**:
- 1 transaction: ~200 bytes (including JSON overhead)
- 1000 transactions: ~200KB
- Plenty of headroom for typical personal use

### D. Accessibility Features

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<form>`)
- ARIA labels on icon-only buttons
- ARIA roles on dynamic content (`role="alert"` for errors)
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management (auto-focus on form after submission)
- High contrast mode compatible (uses semantic colors, not hardcoded)
- Screen reader friendly labels and descriptions

### E. References

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/) - Official Chart.js API reference
- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) - Local Storage guide
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Theme implementation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [UUID v4 Specification](https://www.rfc-editor.org/rfc/rfc4122) - ID generation

*Content rephrased for compliance with licensing restrictions.*

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation
