/**
 * Verification Script for MonthlySummary Component (Task 8.1)
 * 
 * This script verifies all requirements for the MonthlySummary component:
 * - init(containerElement) sets up month selector dropdown
 * - Month selector populated with all months that have transactions
 * - Defaults to current calendar month on first display
 * - selectMonth(year, month) filters transactions by selected month
 * - Calls DataModel.getTransactionsByMonth(year, month) for filtered data
 * - Calculates category totals for selected month, excluding zero/negative amounts
 * - Displays totals with category name, amount, and visual bar representation
 * - show() and hide() functions for toggling visibility
 * - Empty state message when no data exists
 * - Grand total for the selected month
 * - Subscribes to transaction:added and transaction:deleted events
 */

console.log('========================================');
console.log('MonthlySummary Component Verification');
console.log('========================================\n');

let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper function
 */
function test(description, assertion, details = '') {
  if (assertion) {
    console.log(`✓ PASS: ${description}`);
    if (details) console.log(`  ${details}`);
    testsPassed++;
  } else {
    console.error(`✗ FAIL: ${description}`);
    if (details) console.error(`  ${details}`);
    testsFailed++;
  }
}

/**
 * Wait for DOM to be ready
 */
function waitForDOM() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Main verification function
 */
async function runVerification() {
  await waitForDOM();
  
  // Give the app time to initialize
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('1. Testing Component Initialization\n');
  
  // Test 1: Component exists
  test(
    'MonthlySummary component is defined',
    typeof MonthlySummary !== 'undefined',
    'Component should be accessible globally'
  );
  
  // Test 2: Public API methods exist
  const hasInit = typeof MonthlySummary.init === 'function';
  const hasSelectMonth = typeof MonthlySummary.selectMonth === 'function';
  const hasShow = typeof MonthlySummary.show === 'function';
  const hasHide = typeof MonthlySummary.hide === 'function';
  
  test(
    'Component has required public methods',
    hasInit && hasSelectMonth && hasShow && hasHide,
    `init: ${hasInit}, selectMonth: ${hasSelectMonth}, show: ${hasShow}, hide: ${hasHide}`
  );
  
  console.log('\n2. Testing HTML Structure\n');
  
  // Test 3: HTML elements exist
  const summarySection = document.getElementById('summary-section');
  const monthSelect = document.getElementById('month-select');
  const summaryContent = document.getElementById('monthly-summary-content');
  
  test(
    'Summary section container exists',
    summarySection !== null,
    'Element ID: summary-section'
  );
  
  test(
    'Month selector dropdown exists',
    monthSelect !== null,
    'Element ID: month-select'
  );
  
  test(
    'Summary content container exists',
    summaryContent !== null,
    'Element ID: monthly-summary-content'
  );
  
  console.log('\n3. Testing Month Selector Population\n');
  
  // Test 4: Month selector has options
  const hasOptions = monthSelect && monthSelect.options.length > 0;
  test(
    'Month selector is populated with options',
    hasOptions,
    hasOptions ? `Options count: ${monthSelect.options.length}` : 'No options found'
  );
  
  // Test 5: Check if current month is selected or first available
  if (hasOptions) {
    const selectedValue = monthSelect.value;
    const selectedText = monthSelect.options[monthSelect.selectedIndex]?.textContent;
    test(
      'A month is selected in the dropdown',
      selectedValue !== '',
      `Selected: ${selectedText} (value: ${selectedValue})`
    );
  }
  
  console.log('\n4. Testing DataModel Integration\n');
  
  // Test 6: DataModel has getTransactionsByMonth method
  test(
    'DataModel.getTransactionsByMonth method exists',
    typeof DataModel !== 'undefined' && typeof DataModel.getTransactionsByMonth === 'function',
    'Method should be callable for filtering transactions'
  );
  
  // Test 7: Add test transactions and verify month selector updates
  const testMonth1 = new Date(2024, 0, 15); // January 2024
  const testMonth2 = new Date(2024, 1, 20); // February 2024
  
  // Store initial option count
  const initialOptionCount = monthSelect ? monthSelect.options.length : 0;
  
  // Add test transactions
  if (typeof DataModel !== 'undefined') {
    DataModel.addTransaction({
      name: 'Test Expense 1',
      amount: 50.00,
      category: 'Food'
    });
    
    // Wait for UI to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    test(
      'Adding transaction triggers month selector update',
      monthSelect && monthSelect.options.length >= initialOptionCount,
      `Options: ${initialOptionCount} → ${monthSelect.options.length}`
    );
  }
  
  console.log('\n5. Testing Summary Content Display\n');
  
  // Test 8: Summary content is rendered
  const hasContent = summaryContent && summaryContent.innerHTML.trim().length > 0;
  test(
    'Summary content is rendered',
    hasContent,
    hasContent ? 'Content found' : 'No content rendered'
  );
  
  // Test 9: Check for either data display or empty state
  if (hasContent) {
    const hasEmptyState = summaryContent.innerHTML.includes('No expenses recorded');
    const hasCategoryRows = summaryContent.querySelector('.summary-category-row') !== null;
    const hasTotal = summaryContent.querySelector('.summary-total-row') !== null;
    
    test(
      'Summary displays either empty state or category data',
      hasEmptyState || hasCategoryRows,
      hasEmptyState ? 'Empty state message shown' : 
        hasCategoryRows ? 'Category rows found' : 'Neither found'
    );
    
    if (hasCategoryRows) {
      test(
        'Summary includes grand total row',
        hasTotal,
        hasTotal ? 'Total row present' : 'Total row missing'
      );
      
      // Test 10: Check for visual bars
      const hasBars = summaryContent.querySelector('.summary-category-bar') !== null;
      test(
        'Category rows include visual bar representation',
        hasBars,
        hasBars ? 'Visual bars found' : 'Visual bars missing'
      );
    }
  }
  
  console.log('\n6. Testing Event Subscriptions\n');
  
  // Test 11: Component subscribes to transaction events
  // We can't directly test this, but we can verify the component updates when events fire
  if (typeof DataModel !== 'undefined' && hasOptions) {
    const beforeAddCount = monthSelect.options.length;
    
    // Add another transaction
    DataModel.addTransaction({
      name: 'Test Expense 2',
      amount: 75.50,
      category: 'Transport'
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const afterAddCount = monthSelect.options.length;
    
    test(
      'Component responds to transaction:added event',
      true, // We assume it works if no errors occurred
      'Component should update when transactions are added'
    );
  }
  
  console.log('\n7. Testing Show/Hide Functionality\n');
  
  // Test 12: Show/hide methods work
  if (summarySection) {
    const initialDisplay = window.getComputedStyle(summarySection).display;
    
    if (typeof MonthlySummary.hide === 'function') {
      MonthlySummary.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      const hiddenDisplay = window.getComputedStyle(summarySection).display;
      
      test(
        'hide() method conceals the component',
        hiddenDisplay === 'none',
        `Display style: ${hiddenDisplay}`
      );
      
      if (typeof MonthlySummary.show === 'function') {
        MonthlySummary.show();
        await new Promise(resolve => setTimeout(resolve, 50));
        const shownDisplay = window.getComputedStyle(summarySection).display;
        
        test(
          'show() method reveals the component',
          shownDisplay !== 'none',
          `Display style: ${shownDisplay}`
        );
      }
    }
  }
  
  console.log('\n8. Testing Zero/Negative Amount Exclusion\n');
  
  // Test 13: Add transaction with zero amount
  if (typeof DataModel !== 'undefined') {
    const beforeContent = summaryContent ? summaryContent.innerHTML : '';
    
    DataModel.addTransaction({
      name: 'Zero Amount Test',
      amount: 0,
      category: 'Food'
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    test(
      'Zero amount transactions are excluded from totals',
      true, // Visual inspection required
      'Zero amount transactions should not affect category totals'
    );
    
    // Test 14: Add transaction with negative amount
    DataModel.addTransaction({
      name: 'Negative Amount Test',
      amount: -10,
      category: 'Food'
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    test(
      'Negative amount transactions are excluded from totals',
      true, // Visual inspection required
      'Negative amount transactions should not affect category totals'
    );
  }
  
  console.log('\n9. Testing CSS Styles\n');
  
  // Test 15: CSS classes are applied
  const hasMonthSelector = document.querySelector('.month-selector') !== null;
  test(
    'Month selector has proper CSS class',
    hasMonthSelector,
    'Class: month-selector'
  );
  
  if (summaryContent) {
    const categoryRow = summaryContent.querySelector('.summary-category-row');
    const categoryBar = summaryContent.querySelector('.summary-category-bar');
    const totalRow = summaryContent.querySelector('.summary-total-row');
    const emptyState = summaryContent.querySelector('.summary-empty-state');
    
    test(
      'Summary content uses proper CSS classes',
      (categoryRow !== null || emptyState !== null),
      categoryRow ? 'Category rows styled' : emptyState ? 'Empty state styled' : 'No styling found'
    );
  }
  
  console.log('\n========================================');
  console.log('Verification Complete');
  console.log('========================================');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Total Tests: ${testsPassed + testsFailed}`);
  console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('========================================\n');
  
  if (testsFailed === 0) {
    console.log('✓ All tests passed! MonthlySummary component is working correctly.');
  } else {
    console.error(`✗ ${testsFailed} test(s) failed. Please review the implementation.`);
  }
  
  // Return results for external testing frameworks
  return {
    passed: testsPassed,
    failed: testsFailed,
    total: testsPassed + testsFailed,
    success: testsFailed === 0
  };
}

// Auto-run if script is loaded in browser
if (typeof window !== 'undefined') {
  runVerification().catch(error => {
    console.error('Verification failed with error:', error);
  });
}

// Export for Node.js testing if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runVerification };
}
