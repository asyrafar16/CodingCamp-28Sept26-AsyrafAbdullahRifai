// Integration Verification Script
// This script verifies all components are properly integrated in the application

const fs = require('fs');

// Read the index.html file
const indexHtml = fs.readFileSync('index.html', 'utf8');

console.log('='.repeat(60));
console.log('INTEGRATION VERIFICATION REPORT');
console.log('Task 11: Checkpoint - Ensure all components are integrated');
console.log('='.repeat(60));
console.log('');

// Test 1: Check all modules are defined
console.log('TEST 1: Verify all core modules exist');
console.log('-'.repeat(60));

const modules = [
  'StorageManager',
  'Validator',
  'DataModel',
  'TransactionForm',
  'TransactionList',
  'BalanceDisplay',
  'PieChart',
  'CategoryManager',
  'MonthlySummary',
  'ThemeToggle',
  'AppController'
];

let allModulesPresent = true;
modules.forEach(moduleName => {
  const pattern = new RegExp(`const ${moduleName} = \\(function\\(\\)`);
  const exists = pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${moduleName} module`);
  if (!exists) allModulesPresent = false;
});

console.log('');
console.log(`Result: ${allModulesPresent ? 'PASS' : 'FAIL'} - All modules ${allModulesPresent ? 'present' : 'missing'}`);
console.log('');

// Test 2: Check initialization sequence
console.log('TEST 2: Verify AppController initialization sequence');
console.log('-'.repeat(60));

const initChecks = [
  { name: 'DataModel.loadData()', pattern: /DataModel\.loadData\(\)/ },
  { name: 'ThemeToggle.init()', pattern: /ThemeToggle\.init\(/ },
  { name: 'TransactionForm.init()', pattern: /TransactionForm\.init\(/ },
  { name: 'BalanceDisplay.init()', pattern: /BalanceDisplay\.init\(/ },
  { name: 'TransactionList.init()', pattern: /TransactionList\.init\(/ },
  { name: 'PieChart.init()', pattern: /PieChart\.init\(/ },
  { name: 'CategoryManager.init()', pattern: /CategoryManager\.init\(/ },
  { name: 'MonthlySummary.init()', pattern: /MonthlySummary\.init\(/ }
];

let allInitsPresent = true;
initChecks.forEach(check => {
  const exists = check.pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${check.name}`);
  if (!exists) allInitsPresent = false;
});

console.log('');
console.log(`Result: ${allInitsPresent ? 'PASS' : 'FAIL'} - All components ${allInitsPresent ? 'initialized' : 'not initialized'}`);
console.log('');

// Test 3: Check event subscriptions
console.log('TEST 3: Verify event subscriptions (component communication)');
console.log('-'.repeat(60));

const eventSubscriptions = [
  { component: 'AppController', event: 'transaction:added', pattern: /DataModel\.on\('transaction:added', handleTransactionAdded\)/ },
  { component: 'AppController', event: 'transaction:deleted', pattern: /DataModel\.on\('transaction:deleted', handleTransactionDeleted\)/ },
  { component: 'AppController', event: 'category:added', pattern: /DataModel\.on\('category:added', handleCategoryAdded\)/ },
  { component: 'TransactionForm', event: 'category:added', pattern: /DataModel\.on\('category:added', refreshCategories\)/ },
  { component: 'TransactionList', event: 'transaction:added', pattern: /DataModel\.on\('transaction:added'/ },
  { component: 'TransactionList', event: 'transaction:deleted', pattern: /DataModel\.on\('transaction:deleted'/ },
  { component: 'BalanceDisplay', event: 'transaction:added', pattern: /BalanceDisplay[\s\S]{0,200}DataModel\.on\('transaction:added'/ },
  { component: 'PieChart', event: 'transaction:added', pattern: /PieChart[\s\S]{0,500}DataModel\.on\('transaction:added'/ }
];

let allEventsSubscribed = true;
eventSubscriptions.forEach(sub => {
  const exists = sub.pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${sub.component} subscribes to ${sub.event}`);
  if (!exists) allEventsSubscribed = false;
});

console.log('');
console.log(`Result: ${allEventsSubscribed ? 'PASS' : 'FAIL'} - Event system ${allEventsSubscribed ? 'properly wired' : 'incomplete'}`);
console.log('');

// Test 4: Check DOM element references
console.log('TEST 4: Verify DOM element references in HTML');
console.log('-'.repeat(60));

const domElements = [
  { id: 'theme-toggle', description: 'Theme toggle button' },
  { id: 'transaction-form', description: 'Transaction form' },
  { id: 'item-name', description: 'Item name input' },
  { id: 'amount', description: 'Amount input' },
  { id: 'category', description: 'Category select' },
  { id: 'balance-display', description: 'Balance display' },
  { id: 'transaction-list', description: 'Transaction list container' },
  { id: 'pie-chart', description: 'Pie chart canvas' },
  { id: 'category-section', description: 'Category manager section' },
  { id: 'new-category', description: 'New category input' },
  { id: 'add-category-btn', description: 'Add category button' },
  { id: 'summary-section', description: 'Monthly summary section' },
  { id: 'month-select', description: 'Month selector' }
];

let allElementsPresent = true;
domElements.forEach(elem => {
  const pattern = new RegExp(`id="${elem.id}"`);
  const exists = pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${elem.description} (id="${elem.id}")`);
  if (!exists) allElementsPresent = false;
});

console.log('');
console.log(`Result: ${allElementsPresent ? 'PASS' : 'FAIL'} - All DOM elements ${allElementsPresent ? 'present' : 'missing'}`);
console.log('');

// Test 5: Check DOMContentLoaded initialization
console.log('TEST 5: Verify DOMContentLoaded initialization');
console.log('-'.repeat(60));

const domReadyPattern = /document\.readyState === 'loading'/;
const appControllerInitPattern = /AppController\.init\(\)/;

const hasDOMReady = domReadyPattern.test(indexHtml);
const hasAppControllerInit = appControllerInitPattern.test(indexHtml);

console.log(`  ${hasDOMReady ? '✓' : '✗'} DOMContentLoaded event listener check`);
console.log(`  ${hasAppControllerInit ? '✓' : '✗'} AppController.init() call`);

const initializationComplete = hasDOMReady && hasAppControllerInit;
console.log('');
console.log(`Result: ${initializationComplete ? 'PASS' : 'FAIL'} - Initialization ${initializationComplete ? 'properly configured' : 'incomplete'}`);
console.log('');

// Test 6: Check data persistence methods
console.log('TEST 6: Verify data persistence implementation');
console.log('-'.repeat(60));

const persistenceChecks = [
  { name: 'StorageManager.save()', pattern: /StorageManager\.save\('ebv_transactions_v1'/ },
  { name: 'StorageManager.load()', pattern: /StorageManager\.load\('ebv_transactions_v1'/ },
  { name: 'DataModel.saveData()', pattern: /function saveData\(\)/ },
  { name: 'DataModel.loadData()', pattern: /function loadData\(\)/ }
];

let allPersistencePresent = true;
persistenceChecks.forEach(check => {
  const exists = check.pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${check.name}`);
  if (!exists) allPersistencePresent = false;
});

console.log('');
console.log(`Result: ${allPersistencePresent ? 'PASS' : 'FAIL'} - Data persistence ${allPersistencePresent ? 'implemented' : 'incomplete'}`);
console.log('');

// Test 7: Check Chart.js CDN link
console.log('TEST 7: Verify Chart.js dependency');
console.log('-'.repeat(60));

const chartJsCdnPattern = /https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js/;
const hasChartJs = chartJsCdnPattern.test(indexHtml);

console.log(`  ${hasChartJs ? '✓' : '✗'} Chart.js CDN link present`);
console.log('');
console.log(`Result: ${hasChartJs ? 'PASS' : 'FAIL'} - Chart.js ${hasChartJs ? 'included' : 'missing'}`);
console.log('');

// Test 8: Check CSS theming system
console.log('TEST 8: Verify CSS theming system');
console.log('-'.repeat(60));

const themingChecks = [
  { name: 'CSS custom properties (:root)', pattern: /:root\s*{/ },
  { name: 'Dark theme variables', pattern: /\[data-theme="dark"\]/ },
  { name: 'Theme transition CSS', pattern: /transition.*var\(--transition-speed\)/ }
];

let allThemingPresent = true;
themingChecks.forEach(check => {
  const exists = check.pattern.test(indexHtml);
  console.log(`  ${exists ? '✓' : '✗'} ${check.name}`);
  if (!exists) allThemingPresent = false;
});

console.log('');
console.log(`Result: ${allThemingPresent ? 'PASS' : 'FAIL'} - Theming system ${allThemingPresent ? 'implemented' : 'incomplete'}`);
console.log('');

// Final summary
console.log('='.repeat(60));
console.log('OVERALL INTEGRATION STATUS');
console.log('='.repeat(60));

const allTestsPassed = 
  allModulesPresent &&
  allInitsPresent &&
  allEventsSubscribed &&
  allElementsPresent &&
  initializationComplete &&
  allPersistencePresent &&
  hasChartJs &&
  allThemingPresent;

console.log('');
console.log(`Module Structure:        ${allModulesPresent ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Initialization:          ${allInitsPresent ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Event Communication:     ${allEventsSubscribed ? '✓ PASS' : '✗ FAIL'}`);
console.log(`DOM Elements:            ${allElementsPresent ? '✓ PASS' : '✗ FAIL'}`);
console.log(`App Startup:             ${initializationComplete ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Data Persistence:        ${allPersistencePresent ? '✓ PASS' : '✗ FAIL'}`);
console.log(`External Dependencies:   ${hasChartJs ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Theming System:          ${allThemingPresent ? '✓ PASS' : '✗ FAIL'}`);
console.log('');
console.log('='.repeat(60));
console.log(`FINAL RESULT: ${allTestsPassed ? '✓✓✓ ALL TESTS PASSED ✓✓✓' : '✗✗✗ SOME TESTS FAILED ✗✗✗'}`);
console.log('='.repeat(60));
console.log('');

if (allTestsPassed) {
  console.log('✅ All components are properly integrated and ready for use!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open index.html in a web browser to manually test functionality');
  console.log('  2. Run individual component test files (test-*.html) for detailed verification');
  console.log('  3. Test responsive design at different viewport sizes (320px, 768px, 1920px)');
  console.log('  4. Test in different browsers (Chrome, Firefox, Edge, Safari)');
  process.exit(0);
} else {
  console.log('⚠️  Some integration issues were found. Please review the failures above.');
  process.exit(1);
}
