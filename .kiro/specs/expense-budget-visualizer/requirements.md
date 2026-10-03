# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application that allows users to track personal expenses, categorize spending, and visualize their budget distribution. Built entirely with HTML, CSS, and Vanilla JavaScript, the application stores all data in the browser's Local Storage and requires no backend server. It is designed to be minimal, fast, and visually clear — usable as a standalone web page or browser extension.

---

## Glossary

- **App**: The Expense & Budget Visualizer web application.
- **Transaction**: A single expense record consisting of an item name, a monetary amount, and a category.
- **Transaction_List**: The scrollable UI component that displays all saved transactions.
- **Input_Form**: The form UI component used to enter new transaction data.
- **Balance_Display**: The UI component at the top of the App that shows the total balance computed from all transactions.
- **Pie_Chart**: The visual chart component that displays spending distribution by category.
- **Storage**: The browser's Local Storage API used to persist transaction data client-side.
- **Category**: A label assigned to a transaction (e.g., Food, Transport, Fun, or a user-defined custom label).
- **Category_Manager**: The component responsible for managing the list of available categories including defaults and custom ones.
- **Monthly_Summary**: The view that aggregates and displays total spending per category for a selected calendar month.
- **Theme_Toggle**: The UI control that switches the App between dark mode and light mode.
- **Validator**: The component responsible for validating Input_Form field values before submission.

---

## Requirements

### Requirement 1: Transaction Input Form

**User Story:** As a user, I want to enter expense details through a form, so that I can record my spending quickly.

#### Acceptance Criteria

1. THE Input_Form SHALL display fields for Item Name, Amount, and Category, where Item Name is a text input, Amount is a numeric input, and Category is a selection input with at least one predefined option.
2. WHEN the user submits the Input_Form, THE Validator SHALL verify that the Item Name field is not empty and contains between 1 and 100 characters.
3. WHEN the user submits the Input_Form, THE Validator SHALL verify that the Amount field contains a numeric value between 0.01 and 999999999.99.
4. WHEN the user submits the Input_Form, THE Validator SHALL verify that a Category has been selected from the available options.
5. IF any Input_Form field fails validation, THEN THE Validator SHALL display an inline error message adjacent to each invalid field identifying which validation rule was violated, without clearing any previously entered field values.
6. WHEN all fields pass validation, THE Input_Form SHALL add the new Transaction to the Transaction_List within 1 second and clear all form fields to their default empty state.

---

### Requirement 2: Transaction List

**User Story:** As a user, I want to see all my recorded expenses in a list, so that I can review and manage my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display all saved Transactions in a scrollable view.
2. THE Transaction_List SHALL show the Item Name, Amount, and Category for each Transaction.
3. WHEN a Transaction is added or deleted, THE Transaction_List SHALL update its display without requiring a page reload.
4. WHEN the user activates the delete control on a Transaction, THE Transaction_List SHALL remove that Transaction from the list and from Storage.
5. IF no Transactions exist, THE Transaction_List SHALL display an empty state message indicating that no transactions have been recorded.
6. IF a Transaction fails to be deleted from Storage, THEN THE Transaction_List SHALL display an error message and the Transaction SHALL remain visible in the list.

---

### Requirement 3: Total Balance Display

**User Story:** As a user, I want to see my total spending at a glance, so that I can monitor my overall expenditure.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the sum of all Transaction amounts, where the sum equals zero if no Transactions exist.
2. WHEN a Transaction is added, THE Balance_Display SHALL recalculate and update the displayed total within 1 second.
3. WHEN a Transaction is deleted, THE Balance_Display SHALL recalculate and update the displayed total within 1 second.
4. IF a Transaction amount is negative, THEN THE Balance_Display SHALL include that amount in the sum as a deduction from the total.
5. WHEN the Transaction list is empty, THE Balance_Display SHALL show a total of zero.

---

### Requirement 4: Visual Pie Chart

**User Story:** As a user, I want a visual breakdown of my spending by category, so that I can identify where my money is going.

#### Acceptance Criteria

1. THE Pie_Chart SHALL render a chart showing each Category's proportion of total spending, displayed as a percentage rounded to one decimal place.
2. WHEN a Transaction is added, THE Pie_Chart SHALL update to reflect the new spending distribution within 1 second of the transaction being confirmed.
3. WHEN a Transaction is deleted, THE Pie_Chart SHALL update to reflect the revised spending distribution within 1 second of the deletion being confirmed.
4. THE Pie_Chart SHALL display a visually distinct color for each Category segment such that no two segments share the same color.
5. THE Pie_Chart SHALL display a legend mapping each color to its corresponding Category label, with each legend entry showing the Category name and its percentage of total spending rounded to one decimal place.
6. IF total spending across all Categories is zero, THEN THE Pie_Chart SHALL display an empty state message indicating that no spending data is available.
7. IF a Transaction's Category is not matched to any existing Category, THEN THE Pie_Chart SHALL group that Transaction under an "Uncategorized" segment.

---

### Requirement 5: Local Storage Persistence

**User Story:** As a user, I want my expense data to persist between browser sessions, so that I do not lose my records when I close and reopen the App.

#### Acceptance Criteria

1. WHEN a Transaction is added, THE Storage SHALL save the updated Transaction list to Local Storage under a fixed, application-specific key.
2. WHEN a Transaction is deleted, THE Storage SHALL save the updated Transaction list to Local Storage under a fixed, application-specific key.
3. WHEN the App loads, THE App SHALL read all saved Transactions from Local Storage and render them in the Transaction_List within 500 milliseconds.
4. IF Local Storage is empty or contains no valid Transaction data, THEN THE App SHALL initialize with an empty Transaction_List and a zero Balance_Display.
5. IF a Local Storage write operation fails (e.g., quota exceeded or private browsing restriction), THEN THE App SHALL display an error message to the user and the Transaction_List SHALL remain unchanged.

---

### Requirement 6: Custom Categories

**User Story:** As a user, I want to add my own spending categories, so that I can tailor the App to my personal expense types.

#### Acceptance Criteria

1. THE Category_Manager SHALL provide exactly the following default categories on first launch: Food, Transport, and Fun.
2. WHEN the user submits a new category name via the Category_Manager, THE Validator SHALL verify that the name is not empty, does not consist of only whitespace characters, does not exceed 50 characters, and does not duplicate an existing Category name using case-insensitive comparison.
3. IF the new category name fails validation, THEN THE Validator SHALL display an error message indicating the specific reason for rejection and THE Category_Manager SHALL not add the category to the Category selection list.
4. IF the new category name is valid, THEN THE Category_Manager SHALL add it to the Category selection list in the Input_Form within 500 milliseconds.
5. WHEN a custom Category is added, THE Storage SHALL persist the updated Category list to Local Storage before the Category_Manager returns control to the user.
6. WHEN the App loads, THE Category_Manager SHALL restore all previously saved custom categories from Local Storage and make them available in the Category selection list within 1000 milliseconds of App load.
7. IF the Category list in Local Storage is missing or unreadable during App load, THEN THE Category_Manager SHALL fall back to the default categories and display an error message indicating that saved categories could not be restored.

---

### Requirement 7: Monthly Summary View

**User Story:** As a user, I want to see a summary of my spending grouped by month, so that I can track my budget trends over time.

#### Acceptance Criteria

1. THE Monthly_Summary SHALL display the sum of Transaction amounts per Category for a user-selected calendar month, where the sum equals the total of all Transaction amounts whose date falls within that calendar month and whose Category matches.
2. WHEN the user selects a different month, THE Monthly_Summary SHALL recalculate and display totals based only on Transactions whose recorded date falls within the selected calendar month, within 2 seconds of the selection.
3. IF no Transactions exist for the selected month, THEN THE Monthly_Summary SHALL display a message indicating no data is available for that period and no Category rows or totals SHALL be shown.
4. THE Monthly_Summary SHALL be accessible from the main App view without requiring a page reload.
5. WHEN the Monthly_Summary is first displayed, THE Monthly_Summary SHALL default to showing the current calendar month.
6. IF a Transaction amount is zero or negative, THEN THE Monthly_Summary SHALL exclude that Transaction from Category totals.

---

### Requirement 8: Dark/Light Mode Toggle

**User Story:** As a user, I want to switch between dark and light themes, so that I can use the App comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the Theme_Toggle is activated, THE App SHALL switch the visual theme between dark mode and light mode, where dark mode applies a dark background with light foreground text, and light mode applies a light background with dark foreground text.
2. WHEN the theme is changed, THE App SHALL apply the new theme to all visible UI components within 300 milliseconds, with no UI components retaining the previous theme's colors after the transition completes.
3. WHEN the App loads and a theme preference exists in Local Storage, THE App SHALL restore and apply the saved theme preference before rendering any UI components.
4. IF no theme preference exists in Local Storage, THEN THE App SHALL apply light mode as the default theme on load.
5. WHEN the theme is changed, THE Storage SHALL persist the updated theme preference to Local Storage so that the stored value reflects either "dark" or "light" as the active theme.

---

### Requirement 9: Responsive UI Performance

**User Story:** As a user, I want the App to respond immediately to my interactions, so that data entry and visualization feel seamless.

#### Acceptance Criteria

1. WHEN the App is opened in a browser, THE App SHALL render the initial page with all UI components visible and all previously saved Transactions loaded within 2 seconds on a device meeting minimum hardware specifications of 4GB RAM and a modern evergreen browser (Chrome, Firefox, Edge, Safari released within the last 3 years).
2. WHEN the user adds or deletes a Transaction, THE App SHALL update the Balance_Display, Transaction_List, and Pie_Chart within 300 milliseconds of the confirmed action.
3. IF the App fails to render the initial page or load saved Transactions within 2 seconds, THEN THE App SHALL display a loading indicator and complete rendering within 10 seconds before showing an error message indicating a loading failure.
4. WHILE the App is in use, THE App SHALL maintain a layout that adapts to viewport widths from 320px to 1920px without horizontal scrolling, overflow clipping, or overlapping UI components.

---

### Requirement 10: Browser Compatibility

**User Story:** As a developer, I want the App to run in all major modern browsers, so that users are not restricted to a specific browser.

#### Acceptance Criteria

1. THE App SHALL function correctly in the current stable release of Chrome, Firefox, Edge, and Safari, where "function correctly" means all features produce the same visual output and behavior across all four browsers with no feature-specific errors or missing UI elements.
2. THE App SHALL use only Web APIs that are part of the W3C or WHATWG standards and are natively supported in the current stable release of Chrome, Firefox, Edge, and Safari without requiring polyfills, transpilation, or external runtime dependencies beyond Chart.js.
3. THE App SHALL be deployable as a standalone HTML file opened via the `file://` protocol or packaged as a browser extension, and in both cases all features SHALL be fully operational without requiring a backend server or network requests to a remote host.
4. IF the App is opened in a browser other than the current stable release of Chrome, Firefox, Edge, or Safari, THEN the App SHALL display a message indicating that the browser is not supported.
