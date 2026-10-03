// Verification script for Validator module
// Run with: node verify-validator.js

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
    
    // Check for max 2 decimal places using regex
    const amountStr = amount.toString();
    if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) {
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
    
    // Check if empty or only whitespace
    if (trimmed.length === 0 || /^\s+$/.test(name)) {
      return { valid: false, error: 'Category name cannot be empty or only whitespace' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: 'Category name cannot exceed 50 characters' };
    }
    
    // Case-insensitive duplicate check
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

// Test suite
console.log('=== Validator Module Verification ===\n');

let passed = 0;
let failed = 0;

function test(name, condition, message) {
  if (condition) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}: ${message}`);
    failed++;
  }
}

// Test validateTransactionName
console.log('\n--- validateTransactionName ---');
test('Valid name', Validator.validateTransactionName('Coffee').valid, 'Should accept valid name');
test('Empty name', !Validator.validateTransactionName('').valid, 'Should reject empty');
test('Whitespace only', !Validator.validateTransactionName('   ').valid, 'Should reject whitespace');
test('Name too long', !Validator.validateTransactionName('a'.repeat(101)).valid, 'Should reject >100 chars');
test('Name exactly 100 chars', Validator.validateTransactionName('a'.repeat(100)).valid, 'Should accept 100 chars');
test('Name with spaces', Validator.validateTransactionName('  Coffee  ').valid, 'Should trim and accept');

// Test validateAmount
console.log('\n--- validateAmount ---');
test('Valid amount', Validator.validateAmount('45.67').valid, 'Should accept valid amount');
test('Minimum amount', Validator.validateAmount('0.01').valid, 'Should accept 0.01');
test('Below minimum', !Validator.validateAmount('0.001').valid, 'Should reject below 0.01');
test('Maximum amount', Validator.validateAmount('999999999.99').valid, 'Should accept maximum');
test('Above maximum', !Validator.validateAmount('1000000000').valid, 'Should reject above max');
test('Two decimals', Validator.validateAmount('10.99').valid, 'Should accept 2 decimals');
test('One decimal', Validator.validateAmount('10.5').valid, 'Should accept 1 decimal');
test('Three decimals', !Validator.validateAmount('10.999').valid, 'Should reject 3 decimals');
test('Whole number', Validator.validateAmount('100').valid, 'Should accept whole number');
test('Non-numeric', !Validator.validateAmount('abc').valid, 'Should reject non-numeric');
test('Negative', !Validator.validateAmount('-10').valid, 'Should reject negative');

// Test validateCategory
console.log('\n--- validateCategory ---');
const categories = ['Food', 'Transport', 'Fun'];
test('Valid category', Validator.validateCategory('Food', categories).valid, 'Should accept valid');
test('Empty category', !Validator.validateCategory('', categories).valid, 'Should reject empty');
test('Whitespace category', !Validator.validateCategory('   ', categories).valid, 'Should reject whitespace');
test('Non-existent', !Validator.validateCategory('Shopping', categories).valid, 'Should reject unlisted');

// Test validateCategoryName
console.log('\n--- validateCategoryName ---');
const existing = ['Food', 'Transport', 'Fun'];
test('Valid new name', Validator.validateCategoryName('Shopping', existing).valid, 'Should accept new name');
test('Empty name', !Validator.validateCategoryName('', existing).valid, 'Should reject empty');
test('Whitespace only', !Validator.validateCategoryName('   ', existing).valid, 'Should reject whitespace');
test('Name too long', !Validator.validateCategoryName('a'.repeat(51), existing).valid, 'Should reject >50 chars');
test('Name exactly 50 chars', Validator.validateCategoryName('a'.repeat(50), existing).valid, 'Should accept 50 chars');
test('Duplicate', !Validator.validateCategoryName('Food', existing).valid, 'Should reject duplicate');
test('Case-insensitive dup', !Validator.validateCategoryName('food', existing).valid, 'Should reject case-insensitive dup');
test('Uppercase dup', !Validator.validateCategoryName('TRANSPORT', existing).valid, 'Should reject uppercase dup');
test('Name with spaces', Validator.validateCategoryName('  Shopping  ', existing).valid, 'Should trim and accept');

// Summary
console.log(`\n=== Summary ===`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failed} test(s) failed`);
  process.exit(1);
}
