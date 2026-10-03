# Implementation Plan: Expense & Budget Visualizer

## Overview

This plan implements a client-side web application for tracking personal expenses using vanilla HTML, CSS, and JavaScript. The application uses the Revealing Module Pattern for JavaScript architecture, Chart.js for visualizations, and Local Storage for data persistence. All implementation follows the single-file deployment strategy for `file://` protocol compatibility.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create `index.html` with semantic HTML5 structure
  - Add meta tags for viewport and charset
  - Include Chart.js CDN link in head section
  - Create placeholder sections for all UI components (balance, form, list, chart, summary)
  - Add theme toggle button with sun/moon icons in header
  - Set up basic HTML structure with app-container, header, main, and footer
  - _Requirements: 10.3 (deployable as standalone HTML), 9.1 (render initial page)_

- [x] 2. Implement CSS theming system
  - [x] 2.1 Create CSS custom properties for theme variables
    - Define root-level CSS variables for light theme colors (bg-primary, bg-secondary, text-primary, text-secondary, border-color, accent-color, error-color)
    - Define spacing variables (xs, sm, md, lg) and typography variables (font-family, font-sizes)
    - Create dark theme overrides using `[data-theme="dark"]` selector
    - Set transition speed variable for smooth theme switching
    - _Requirements: 8.1 (dark/light mode), 8.2 (apply theme within 300ms)_

  - [x] 2.2 Implement responsive layout with CSS Grid
    - Create two-column grid layout for desktop (≥768px) with grid-template-areas
    - Implement single-column stack layout for mobile (<768px)
    - Add card component styles with border, padding, shadow, and border-radius
    - Ensure touch targets are minimum 44px for mobile
    - _Requirements: 9.4 (responsive 320px-1920px viewport), 10.1 (cross-browser compatibility)_

  - [x] 2.3 Style form components and buttons
    - Style form-group, labels, inputs, select, and error-message elements
    - Create btn-primary and btn-secondary button styles with hover and active states
    - Add focus indicators for keyboard navigation (accessibility)
    - Style transaction list items with delete buttons
    - Add smooth transitions for all interactive elements
    - _Requirements: 1.1 (form display), 2.1 (transaction list display)_

- [x] 3. Implement core JavaScript modules
  - [x] 3.1 Create StorageManager module
    - Implement IIFE wrapper for module encapsulation
    - Create `checkStorageAvailability()` function to detect private browsing mode
    - Implement `save(key, data)` function with JSON serialization and version wrapper
    - Implement `load(key)` function with JSON parsing and error handling
    - Add `isAvailable()` function to check storage status
    - Use storage keys: `ebv_transactions_v1`, `ebv_categories_v1`, `ebv_theme_v1`
    - Handle quota exceeded errors with try-catch blocks
    - _Requirements: 5.1 (save on add), 5.2 (save on delete), 5.5 (handle storage failures)_

  - [x] 3.2 Create Validator module
    - Implement `validateTransactionName(name)` function with 1-100 character validation
    - Implement `validateAmount(amount)` function with 0.01-999999999.99 range validation
    - Add regex check for maximum 2 decimal places in amount
    - Implement `validateCategory(category, categories)` function to verify selection exists
    - Implement `validateCategoryName(name, existingCategories)` with 1-50 character limit and case-insensitive duplicate check
    - Return `{ valid: boolean, error: string }` objects for all validation functions
    - _Requirements: 1.2 (validate name), 1.3 (validate amount), 1.4 (validate category), 6.2 (validate category name)_

  - [x] 3.3 Create DataModel module with state management
    - Initialize state with `transactions` array and `categories` array (defaults: Food, Transport, Fun)
    - Implement event system with `listeners` object, `emit(eventName, data)`, and `on(eventName, callback)` functions
    - Create `generateId()` function for UUID v4 generation
    - Implement `addTransaction(transaction)` to create transaction object with id, timestamp, and ISO date
    - Implement `deleteTransaction(id)` to remove transaction by id
    - Implement `getAllTransactions()` to return transactions sorted by timestamp (newest first)
    - Implement `getTransactionsByMonth(year, month)` to filter by date range
    - Implement `addCategory(name)` to add unique categories
    - Implement `getTotalBalance()` to sum all transaction amounts
    - Implement `getCategoryTotals()` to aggregate spending by category
    - Implement `loadData()` to restore from StorageManager
    - Implement `saveData()` to persist to StorageManager
    - Emit events: `transaction:added`, `transaction:deleted`, `category:added`, `data:loaded`
    - _Requirements: 2.3 (update without reload), 3.1 (sum calculation), 3.2 (recalculate on add), 6.5 (persist categories)_

- [x] 4. Checkpoint - Ensure core modules are tested
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement UI component modules
  - [x] 5.1 Create TransactionForm component
    - Implement `init(containerElement)` to attach form submission handler
    - Add event listener for form submit with `preventDefault()`
    - Call Validator functions for name, amount, and category fields
    - Display inline error messages using `showError(fieldName, message)` function
    - Clear all errors with `clearErrors()` on field focus events
    - On successful validation, call `DataModel.addTransaction()` with form data
    - Implement `reset()` function to clear form fields after successful submission
    - Disable submit button during validation to prevent double-submission
    - _Requirements: 1.2 (validate on submit), 1.5 (display inline errors), 1.6 (add transaction and clear form)_

  - [x] 5.2 Create TransactionList component
    - Implement `init(containerElement)` to set up list container
    - Implement `render(transactions)` to generate list items with delete buttons
    - Create delete button click handlers that call `DataModel.deleteTransaction(id)`
    - Implement `showEmpty()` to display "No transactions recorded" message when list is empty
    - Add smooth fade-out animation for deleted items using CSS transitions
    - Auto-scroll to bottom when new transaction is added
    - Subscribe to `transaction:added` and `transaction:deleted` events from DataModel
    - _Requirements: 2.1 (display all transactions), 2.2 (show item, amount, category), 2.3 (update without reload), 2.4 (delete functionality), 2.5 (empty state message)_

  - [x] 5.3 Create BalanceDisplay component
    - Implement `init(containerElement)` to set up balance display element
    - Implement `update(total)` function to format and display total with currency formatting
    - Format numbers with 2 decimal places and thousands separators using `toLocaleString()`
    - Add brief highlight animation when balance changes (CSS transition)
    - Display negative amounts in red color if total is negative
    - Subscribe to `transaction:added` and `transaction:deleted` events from DataModel
    - _Requirements: 3.1 (show sum of all amounts), 3.2 (update on add), 3.3 (update on delete), 3.4 (include negative amounts), 3.5 (show zero when empty)_

- [ ] 6. Implement Chart.js integration
  - [x] 6.1 Create PieChart component
    - Implement `init(canvasElement)` to store canvas reference and get 2D context
    - Define color palette array with 20 distinct colors for category differentiation
    - Implement `update(categoryTotals)` function to render or update pie chart
    - Destroy existing chart instance before creating new one to handle updates
    - Configure Chart.js with type: 'pie', responsive: true, maintainAspectRatio: false
    - Customize legend to show category name and percentage (rounded to 1 decimal place)
    - Customize tooltip to show category, dollar amount, and percentage
    - Implement `showEmptyState()` to display "No spending data available" when total is zero
    - Handle "Uncategorized" segment for transactions without matching categories
    - Subscribe to `transaction:added` and `transaction:deleted` events from DataModel
    - _Requirements: 4.1 (render chart with percentages), 4.2 (update on add), 4.3 (update on delete), 4.4 (distinct colors), 4.5 (legend with percentages), 4.6 (empty state), 4.7 (uncategorized segment)_

- [x] 7. Implement category management
  - [x] 7.1 Create CategoryManager component
    - Implement `init(containerElement)` to set up category input and add button
    - Display current categories list in UI
    - Add event listener for "Add Category" button click
    - Call `Validator.validateCategoryName()` with existing categories for duplicate check
    - Display error message using `showError(message)` if validation fails
    - On successful validation, call `DataModel.addCategory(name)`
    - Implement `refresh()` function to update category dropdown in TransactionForm
    - Update form select element options when new category is added
    - Load default categories (Food, Transport, Fun) on first run if storage is empty
    - Subscribe to `category:added` event from DataModel
    - _Requirements: 6.1 (default categories), 6.2 (validate category name), 6.3 (error message on fail), 6.4 (add to selection list), 6.5 (persist to storage), 6.6 (restore from storage)_

- [x] 8. Implement monthly summary view
  - [x] 8.1 Create MonthlySummary component
    - Implement `init(containerElement)` to set up month selector dropdown
    - Populate month selector with all months that have transactions
    - Default to current calendar month on first display
    - Implement `selectMonth(year, month)` to filter transactions by selected month
    - Call `DataModel.getTransactionsByMonth(year, month)` for filtered data
    - Calculate category totals for selected month, excluding zero/negative amounts
    - Display totals with category name, amount, and visual bar representation
    - Implement `show()` and `hide()` functions for toggling visibility
    - Display "No expenses recorded for this month" empty state message when no data exists
    - Display grand total for the selected month
    - Subscribe to `transaction:added` and `transaction:deleted` events to refresh available months
    - _Requirements: 7.1 (sum per category per month), 7.2 (recalculate on month selection), 7.3 (empty state message), 7.4 (accessible without reload), 7.5 (default to current month), 7.6 (exclude zero/negative)_

- [x] 9. Implement theme toggle functionality
  - [x] 9.1 Create ThemeToggle component
    - Implement `init(buttonElement)` to set up theme toggle button handler
    - Load saved theme preference from StorageManager on initialization
    - Implement `setTheme(theme)` to set `data-theme` attribute on `<html>` element
    - Implement `toggleTheme()` function to switch between "light" and "dark"
    - Update sun/moon icon visibility based on current theme
    - Save theme preference to Local Storage using `StorageManager.save('ebv_theme_v1', theme)`
    - Apply saved theme before first render to prevent flash of unstyled content
    - Default to "light" theme if no preference exists in storage
    - _Requirements: 8.1 (switch between themes), 8.2 (apply within 300ms), 8.3 (restore from storage), 8.4 (default to light), 8.5 (persist to storage)_

- [x] 10. Implement AppController and initialization
  - [x] 10.1 Create AppController module
    - Implement `init()` function to orchestrate application startup
    - Call `DataModel.loadData()` to restore saved transactions and categories
    - Initialize all UI components with their DOM element references
    - Set up event listeners by subscribing to DataModel events
    - Create `handleTransactionAdded()` callback to save data and trigger re-render
    - Create `handleTransactionDeleted()` callback to save data and trigger re-render
    - Create `handleCategoryAdded()` callback to save data and refresh form dropdown
    - Implement `renderAll()` function to update all UI components (list, balance, chart, summary)
    - Add DOMContentLoaded event listener to call `AppController.init()` when document is ready
    - _Requirements: 5.3 (load on app load within 500ms), 9.1 (render within 2 seconds), 9.2 (update UI within 300ms)_

- [x] 11. Checkpoint - Ensure all components are integrated
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Add error handling and edge cases
  - [x] 12.1 Implement storage error handling
    - Add toast notification system for displaying storage errors
    - Display "Storage full. Please delete old transactions." message on quota exceeded
    - Display "Storage unavailable. Data will not persist." banner on private browsing detection
    - Preserve form input when storage save fails (don't clear form)
    - Add console error logging for storage failures with error details
    - _Requirements: 5.5 (display error on storage failure), 5.4 (initialize with empty state)_

  - [x] 12.2 Handle Chart.js loading failures
    - Add try-catch wrapper around Chart.js initialization
    - Display "Chart library could not load" message if Chart.js CDN fails
    - Hide chart section gracefully when Chart.js is unavailable
    - Ensure rest of application continues to function without chart
    - _Requirements: 10.2 (use standard Web APIs), 10.3 (function without network for non-CDN features)_

  - [x] 12.3 Handle data corruption and migration
    - Add version checking when loading data from storage
    - Implement try-catch in `StorageManager.load()` for JSON parse errors
    - Fall back to default categories if category list is corrupted
    - Fall back to empty transactions if transaction list is corrupted
    - Log corruption errors to console for debugging
    - Display error message to user when saved data cannot be restored
    - _Requirements: 5.4 (initialize with empty state on invalid data), 6.7 (fall back to defaults on corruption)_

- [x] 13. Add accessibility features
  - [x] 13.1 Implement ARIA attributes and labels
    - Add `aria-label` to theme toggle button for screen readers
    - Add `aria-invalid` to form inputs when validation fails
    - Add `aria-describedby` to link error messages to form fields
    - Add `role="alert"` to error message elements for dynamic announcements
    - Ensure all form inputs have associated `<label>` elements
    - Add descriptive labels to delete buttons for screen readers
    - _Requirements: 9.1 (render accessible UI), 10.1 (function correctly across browsers)_

  - [x] 13.2 Implement keyboard navigation support
    - Ensure all interactive elements are keyboard accessible (Tab navigation)
    - Add Enter key handler for delete buttons
    - Add Escape key handler to close error messages and reset focus
    - Ensure focus indicators are visible on all focusable elements (CSS)
    - Auto-focus on first error field when validation fails
    - Maintain focus management when dynamically adding/removing elements
    - _Requirements: 9.1 (render functional UI), accessibility best practices_

- [x] 14. Optimize performance
  - [x] 14.1 Implement debouncing and efficient rendering
    - Add debounce function for real-time validation on input fields (300ms delay)
    - Use documentFragment for batch DOM updates when rendering transaction list
    - Minimize reflows by batching style changes
    - Cache DOM element references in component initialization
    - Avoid unnecessary chart re-renders by checking if data actually changed
    - _Requirements: 9.1 (render within 2 seconds), 9.2 (update within 300ms)_

  - [x] 14.2 Add loading states and performance monitoring
    - Display loading indicator during initial data load if it takes >500ms
    - Add performance.now() timestamps to measure critical operations
    - Log warnings to console if operations exceed time budgets (add: 1s, delete: 1s, update: 300ms)
    - Implement timeout for initial load (10 seconds) with error message
    - _Requirements: 9.1 (render within 2s, fallback within 10s), 9.3 (display loading indicator)_

- [x] 15. Browser compatibility verification
  - [x] 15.1 Test cross-browser functionality
    - Test application in Chrome stable (verify all features work)
    - Test application in Firefox stable (verify all features work)
    - Test application in Edge stable (verify all features work)
    - Test application in Safari stable (verify all features work)
    - Verify Chart.js renders correctly in all four browsers
    - Test Local Storage persistence in all four browsers
    - Test theme toggle in all four browsers
    - _Requirements: 10.1 (function correctly in Chrome, Firefox, Edge, Safari)_

  - [x] 15.2 Test responsive design on multiple viewport sizes
    - Test layout at 320px viewport width (mobile minimum)
    - Test layout at 768px viewport width (tablet breakpoint)
    - Test layout at 1024px viewport width (desktop)
    - Test layout at 1920px viewport width (large desktop)
    - Verify no horizontal scrolling or overflow at any viewport size
    - Test touch targets on mobile devices (minimum 44px)
    - _Requirements: 9.4 (responsive 320px-1920px without scrolling/clipping)_

  - [x] 15.3 Test deployment scenarios
    - Test opening `index.html` via `file://` protocol (all features functional)
    - Verify Chart.js CDN loads when internet connection is available
    - Test in private browsing/incognito mode (storage unavailable warning displayed)
    - Test with browser storage cleared (app initializes with defaults)
    - Test with JavaScript disabled (graceful degradation or error message)
    - _Requirements: 10.3 (deployable via file:// protocol), 10.2 (use only standard APIs)_

- [x] 16. Final checkpoint - Complete validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This implementation uses vanilla JavaScript (ES6+) with the Revealing Module Pattern for organization
- All code is embedded in a single `index.html` file for `file://` protocol compatibility
- Chart.js is the only external dependency, loaded via CDN
- Local Storage API is used for all data persistence with error handling for quota and availability
- CSS custom properties enable theme switching without JavaScript color manipulation
- The application is fully client-side with no backend requirements
- All time budgets from requirements are enforced: 300ms UI updates, 1s operations, 2s initial load
- Accessibility features ensure WCAG 2.1 AA compliance
- Testing covers four major browsers (Chrome, Firefox, Edge, Safari) and responsive breakpoints

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3"] },
    { "id": 5, "tasks": ["6.1", "7.1", "8.1", "9.1"] },
    { "id": 6, "tasks": ["10.1"] },
    { "id": 7, "tasks": ["12.1", "12.2", "12.3", "13.1"] },
    { "id": 8, "tasks": ["13.2", "14.1"] },
    { "id": 9, "tasks": ["14.2", "15.1"] },
    { "id": 10, "tasks": ["15.2", "15.3"] }
  ]
}
```

