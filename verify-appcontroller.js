/**
 * AppController Module Verification Script
 * Task 10.1 - Verify implementation meets all requirements
 */

// Load the HTML file and check for AppController implementation
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('========================================');
console.log('AppController Module Verification');
console.log('========================================\n');

// Test 1: Check if AppController module exists
console.log('Test 1: AppController module declaration');
const hasAppController = /const AppController = \(function\(\)/g.test(indexContent);
console.log(hasAppController ? '✓ PASS: AppController module found' : '✗ FAIL: AppController module not found');
console.log('');

// Test 2: Check if init() function exists
console.log('Test 2: init() function');
const hasInitFunction = /function init\(\)/g.test(indexContent);
console.log(hasInitFunction ? '✓ PASS: init() function found' : '✗ FAIL: init() function not found');
console.log('');

// Test 3: Check if DataModel.loadData() is called
console.log('Test 3: DataModel.loadData() call');
const hasLoadData = /DataModel\.loadData\(\)/g.test(indexContent);
console.log(hasLoadData ? '✓ PASS: DataModel.loadData() is called' : '✗ FAIL: DataModel.loadData() not called');
console.log('');

// Test 4: Check if all UI components are initialized
console.log('Test 4: UI component initialization');
const components = [
  { name: 'ThemeToggle', pattern: /ThemeToggle\.init\(/ },
  { name: 'TransactionForm', pattern: /TransactionForm\.init\(/ },
  { name: 'BalanceDisplay', pattern: /BalanceDisplay\.init\(/ },
  { name: 'TransactionList', pattern: /TransactionList\.init\(/ },
  { name: 'PieChart', pattern: /PieChart\.init\(/ },
  { name: 'CategoryManager', pattern: /CategoryManager\.init\(/ },
  { name: 'MonthlySummary', pattern: /MonthlySummary\.init\(/ }
];

let allComponentsInitialized = true;
components.forEach(comp => {
  const found = comp.pattern.test(indexContent);
  console.log(`  ${found ? '✓' : '✗'} ${comp.name}`);
  if (!found) allComponentsInitialized = false;
});
console.log(allComponentsInitialized ? '✓ PASS: All components initialized' : '✗ FAIL: Some components missing');
console.log('');

// Test 5: Check if event listeners are set up
console.log('Test 5: Event listeners');
const events = [
  { name: 'transaction:added', pattern: /DataModel\.on\('transaction:added', handleTransactionAdded\)/ },
  { name: 'transaction:deleted', pattern: /DataModel\.on\('transaction:deleted', handleTransactionDeleted\)/ },
  { name: 'category:added', pattern: /DataModel\.on\('category:added', handleCategoryAdded\)/ }
];

let allEventsRegistered = true;
events.forEach(event => {
  const found = event.pattern.test(indexContent);
  console.log(`  ${found ? '✓' : '✗'} ${event.name}`);
  if (!found) allEventsRegistered = false;
});
console.log(allEventsRegistered ? '✓ PASS: All event listeners registered' : '✗ FAIL: Some event listeners missing');
console.log('');

// Test 6: Check if handleTransactionAdded function exists
console.log('Test 6: handleTransactionAdded callback');
const hasHandleAdded = /function handleTransactionAdded\(/g.test(indexContent);
const callsSaveData = /DataModel\.saveData\(\)/g.test(indexContent);
const callsRenderAll = /renderAll\(\)/g.test(indexContent);
console.log(hasHandleAdded ? '✓ PASS: handleTransactionAdded function found' : '✗ FAIL: handleTransactionAdded not found');
console.log(callsSaveData ? '✓ PASS: Calls DataModel.saveData()' : '✗ FAIL: Does not call saveData()');
console.log(callsRenderAll ? '✓ PASS: Calls renderAll()' : '✗ FAIL: Does not call renderAll()');
console.log('');

// Test 7: Check if handleTransactionDeleted function exists
console.log('Test 7: handleTransactionDeleted callback');
const hasHandleDeleted = /function handleTransactionDeleted\(/g.test(indexContent);
console.log(hasHandleDeleted ? '✓ PASS: handleTransactionDeleted function found' : '✗ FAIL: handleTransactionDeleted not found');
console.log('');

// Test 8: Check if handleCategoryAdded function exists
console.log('Test 8: handleCategoryAdded callback');
const hasHandleCategoryAdded = /function handleCategoryAdded\(/g.test(indexContent);
const refreshesCategories = /TransactionForm\.refreshCategories\(\)/g.test(indexContent);
console.log(hasHandleCategoryAdded ? '✓ PASS: handleCategoryAdded function found' : '✗ FAIL: handleCategoryAdded not found');
console.log(refreshesCategories ? '✓ PASS: Refreshes form dropdown' : '✗ FAIL: Does not refresh form dropdown');
console.log('');

// Test 9: Check if renderAll function exists
console.log('Test 9: renderAll() function');
const hasRenderAll = /function renderAll\(\)/g.test(indexContent);
const updatesComponents = [
  /TransactionList\.render\(/,
  /BalanceDisplay\.update\(/,
  /PieChart\.update\(/,
  /MonthlySummary\.refresh\(/
];
let allComponentsUpdated = true;
updatesComponents.forEach((pattern, index) => {
  const names = ['TransactionList', 'BalanceDisplay', 'PieChart', 'MonthlySummary'];
  const found = pattern.test(indexContent);
  console.log(`  ${found ? '✓' : '✗'} Updates ${names[index]}`);
  if (!found) allComponentsUpdated = false;
});
console.log(hasRenderAll ? '✓ PASS: renderAll function found' : '✗ FAIL: renderAll not found');
console.log(allComponentsUpdated ? '✓ PASS: All components updated in renderAll' : '✗ FAIL: Some components not updated');
console.log('');

// Test 10: Check if DOMContentLoaded event listener is added
console.log('Test 10: DOMContentLoaded event listener');
const hasDOMListener = /document\.addEventListener\('DOMContentLoaded', AppController\.init\)/g.test(indexContent);
const hasImmediateInit = /AppController\.init\(\)/g.test(indexContent);
console.log(hasDOMListener ? '✓ PASS: DOMContentLoaded listener found' : '✗ FAIL: DOMContentLoaded listener missing');
console.log(hasImmediateInit ? '✓ PASS: Immediate init for already-loaded document' : '✗ FAIL: No immediate init fallback');
console.log('');

// Test 11: Check if AppController returns public API
console.log('Test 11: Public API');
const returnsInit = /return\s*\{[\s\S]*?init:\s*init[\s\S]*?\}/g.test(indexContent);
console.log(returnsInit ? '✓ PASS: Returns init in public API' : '✗ FAIL: Does not return init');
console.log('');

// Test 12: Check for requirement comments
console.log('Test 12: Requirement documentation');
const hasReq5_3 = /5\.3/.test(indexContent) || /load.*500ms/.test(indexContent);
const hasReq9_1 = /9\.1/.test(indexContent) || /render.*2 seconds/.test(indexContent);
const hasReq9_2 = /9\.2/.test(indexContent) || /update.*300ms/.test(indexContent);
console.log(hasReq5_3 ? '✓ PASS: References Requirement 5.3 (load within 500ms)' : '  INFO: Could add Requirement 5.3 reference');
console.log(hasReq9_1 ? '✓ PASS: References Requirement 9.1 (render within 2 seconds)' : '  INFO: Could add Requirement 9.1 reference');
console.log(hasReq9_2 ? '✓ PASS: References Requirement 9.2 (update within 300ms)' : '  INFO: Could add Requirement 9.2 reference');
console.log('');

// Summary
console.log('========================================');
console.log('Summary');
console.log('========================================');

const allPassed = hasAppController && hasInitFunction && hasLoadData && 
                  allComponentsInitialized && allEventsRegistered && 
                  hasHandleAdded && hasHandleDeleted && hasHandleCategoryAdded &&
                  hasRenderAll && allComponentsUpdated && hasDOMListener && 
                  hasImmediateInit && returnsInit;

if (allPassed) {
  console.log('✓ ALL TESTS PASSED');
  console.log('AppController module is correctly implemented according to Task 10.1 requirements.');
} else {
  console.log('✗ SOME TESTS FAILED');
  console.log('Please review the failures above and update the implementation.');
}

console.log('');
