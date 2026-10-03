/**
 * Automated Cross-Browser Tests for Expense & Budget Visualizer
 * 
 * This script can be used with Playwright or Puppeteer to automate
 * cross-browser testing. It simulates user interactions and verifies
 * that the application functions correctly across different browsers.
 * 
 * To use with Playwright:
 * 1. Install: npm install -D @playwright/test
 * 2. Run: npx playwright test automated-browser-tests.js
 * 
 * To use with Puppeteer:
 * 1. Install: npm install puppeteer
 * 2. Modify script to use Puppeteer API
 */

// Playwright Test Configuration
// This is a reference implementation - adapt as needed

const { test, expect } = require('@playwright/test');
const path = require('path');

// Configuration
const APP_URL = `file://${path.resolve(__dirname, 'index.html')}`;
const BROWSERS = ['chromium', 'firefox', 'webkit']; // webkit = Safari engine

// Test Data
const TEST_TRANSACTIONS = [
  { name: 'Grocery Shopping', amount: '125.50', category: 'Food' },
  { name: 'Gas Station', amount: '45.00', category: 'Transport' },
  { name: 'Movie Tickets', amount: '28.50', category: 'Fun' }
];

const EXPECTED_TOTAL = 199.00;

// ============================================================================
// TEST SUITE
// ============================================================================

test.describe('Cross-Browser Functionality Tests', () => {
  
  // Run tests in each browser
  BROWSERS.forEach(browserType => {
    
    test.describe(`Browser: ${browserType}`, () => {
      
      // ======================================================================
      // TC-001: Initial Page Load
      // ======================================================================
      test(`TC-001: Initial page load in ${browserType}`, async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto(APP_URL);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        console.log(`${browserType} load time: ${loadTime}ms`);
        
        // Verify load time < 2 seconds
        expect(loadTime).toBeLessThan(2000);
        
        // Verify all major UI elements are visible
        await expect(page.locator('h1')).toContainText('Expense & Budget Visualizer');
        await expect(page.locator('#transaction-form')).toBeVisible();
        await expect(page.locator('#balance-display')).toBeVisible();
        await expect(page.locator('#transaction-list')).toBeVisible();
        await expect(page.locator('#pie-chart')).toBeVisible();
        await expect(page.locator('#theme-toggle')).toBeVisible();
        
        // Check for JavaScript errors
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        expect(errors.length).toBe(0);
      });
      
      // ======================================================================
      // TC-002: Transaction Form Validation
      // ======================================================================
      test(`TC-002: Form validation in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Test empty name validation
        await page.fill('#item-name', '');
        await page.fill('#amount', '100');
        await page.selectOption('#category', 'Food');
        await page.click('button[type="submit"]');
        
        const nameError = await page.locator('#item-name-error').textContent();
        expect(nameError).toContain('cannot be empty');
        
        // Test invalid amount validation
        await page.fill('#item-name', 'Test Item');
        await page.fill('#amount', '0');
        await page.click('button[type="submit"]');
        
        const amountError = await page.locator('#amount-error').textContent();
        expect(amountError).toContain('must be at least');
        
        // Test missing category validation
        await page.fill('#amount', '50');
        await page.selectOption('#category', '');
        await page.click('button[type="submit"]');
        
        const categoryError = await page.locator('#category-error').textContent();
        expect(categoryError).toContain('select a category');
      });
      
      // ======================================================================
      // TC-003: Add Transaction
      // ======================================================================
      test(`TC-003: Add transaction in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        const startTime = Date.now();
        
        // Fill form with valid data
        await page.fill('#item-name', TEST_TRANSACTIONS[0].name);
        await page.fill('#amount', TEST_TRANSACTIONS[0].amount);
        await page.selectOption('#category', TEST_TRANSACTIONS[0].category);
        await page.click('button[type="submit"]');
        
        const responseTime = Date.now() - startTime;
        console.log(`${browserType} add transaction time: ${responseTime}ms`);
        
        // Verify response time < 1 second
        expect(responseTime).toBeLessThan(1000);
        
        // Verify form clears
        await expect(page.locator('#item-name')).toHaveValue('');
        await expect(page.locator('#amount')).toHaveValue('');
        
        // Verify transaction appears in list
        await expect(page.locator('#transaction-list')).toContainText(TEST_TRANSACTIONS[0].name);
        
        // Verify balance updates
        const balance = await page.locator('#balance-display').textContent();
        expect(balance).toContain('125.50');
      });
      
      // ======================================================================
      // TC-004: Transaction List Display
      // ======================================================================
      test(`TC-004: Transaction list in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Add multiple transactions
        for (const tx of TEST_TRANSACTIONS) {
          await page.fill('#item-name', tx.name);
          await page.fill('#amount', tx.amount);
          await page.selectOption('#category', tx.category);
          await page.click('button[type="submit"]');
          await page.waitForTimeout(100); // Small delay between adds
        }
        
        // Verify all transactions display
        for (const tx of TEST_TRANSACTIONS) {
          await expect(page.locator('#transaction-list')).toContainText(tx.name);
          await expect(page.locator('#transaction-list')).toContainText(tx.amount);
        }
        
        // Verify transaction count
        const transactionItems = await page.locator('.transaction-item').count();
        expect(transactionItems).toBe(TEST_TRANSACTIONS.length);
      });
      
      // ======================================================================
      // TC-005: Delete Transaction
      // ======================================================================
      test(`TC-005: Delete transaction in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Add a transaction
        await page.fill('#item-name', 'Test Delete');
        await page.fill('#amount', '50.00');
        await page.selectOption('#category', 'Food');
        await page.click('button[type="submit"]');
        
        // Get initial balance
        const initialBalance = await page.locator('#balance-display').textContent();
        
        const startTime = Date.now();
        
        // Delete the transaction
        await page.click('.transaction-delete');
        
        const deleteTime = Date.now() - startTime;
        console.log(`${browserType} delete transaction time: ${deleteTime}ms`);
        
        // Verify response time < 1 second
        expect(deleteTime).toBeLessThan(1000);
        
        // Verify transaction is removed
        await expect(page.locator('#transaction-list')).not.toContainText('Test Delete');
        
        // Verify balance updates to $0.00
        await expect(page.locator('#balance-display')).toContainText('$0.00');
      });
      
      // ======================================================================
      // TC-006: Balance Calculation
      // ======================================================================
      test(`TC-006: Balance calculation in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Verify initial zero balance
        await expect(page.locator('#balance-display')).toContainText('$0.00');
        
        // Add transactions and verify balance updates
        let runningTotal = 0;
        for (const tx of TEST_TRANSACTIONS) {
          await page.fill('#item-name', tx.name);
          await page.fill('#amount', tx.amount);
          await page.selectOption('#category', tx.category);
          await page.click('button[type="submit"]');
          
          runningTotal += parseFloat(tx.amount);
          await page.waitForTimeout(200);
        }
        
        // Verify final balance
        const balance = await page.locator('#balance-display').textContent();
        const balanceValue = parseFloat(balance.replace(/[^0-9.]/g, ''));
        expect(balanceValue).toBeCloseTo(EXPECTED_TOTAL, 2);
        
        // Delete all transactions
        const deleteButtons = await page.locator('.transaction-delete').count();
        for (let i = 0; i < deleteButtons; i++) {
          await page.locator('.transaction-delete').first().click();
          await page.waitForTimeout(100);
        }
        
        // Verify balance returns to zero
        await expect(page.locator('#balance-display')).toContainText('$0.00');
      });
      
      // ======================================================================
      // TC-007: Chart.js Rendering
      // ======================================================================
      test(`TC-007: Chart rendering in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Check if Chart.js loaded
        const chartJsLoaded = await page.evaluate(() => typeof Chart !== 'undefined');
        expect(chartJsLoaded).toBe(true);
        
        // Add transactions
        for (const tx of TEST_TRANSACTIONS) {
          await page.fill('#item-name', tx.name);
          await page.fill('#amount', tx.amount);
          await page.selectOption('#category', tx.category);
          await page.click('button[type="submit"]');
        }
        
        // Wait for chart to render
        await page.waitForTimeout(500);
        
        // Verify canvas element exists and has content
        const canvasExists = await page.locator('#pie-chart').isVisible();
        expect(canvasExists).toBe(true);
        
        // Check if chart instance was created
        const hasChartInstance = await page.evaluate(() => {
          const canvas = document.getElementById('pie-chart');
          return canvas && canvas.__chartjs__;
        });
        expect(hasChartInstance).toBe(true);
      });
      
      // ======================================================================
      // TC-008: Local Storage Persistence
      // ======================================================================
      test(`TC-008: Local Storage in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Add a transaction
        await page.fill('#item-name', 'Persistence Test');
        await page.fill('#amount', '75.25');
        await page.selectOption('#category', 'Food');
        await page.click('button[type="submit"]');
        
        // Verify data is stored
        const storageData = await page.evaluate(() => {
          return {
            transactions: localStorage.getItem('ebv_transactions_v1'),
            categories: localStorage.getItem('ebv_categories_v1'),
            theme: localStorage.getItem('ebv_theme_v1')
          };
        });
        
        expect(storageData.transactions).not.toBeNull();
        expect(storageData.categories).not.toBeNull();
        
        // Reload page
        const reloadStartTime = Date.now();
        await page.reload();
        await page.waitForLoadState('networkidle');
        const reloadTime = Date.now() - reloadStartTime;
        
        console.log(`${browserType} reload time: ${reloadTime}ms`);
        expect(reloadTime).toBeLessThan(500);
        
        // Verify data persisted
        await expect(page.locator('#transaction-list')).toContainText('Persistence Test');
        await expect(page.locator('#balance-display')).toContainText('75.25');
      });
      
      // ======================================================================
      // TC-009: Theme Toggle
      // ======================================================================
      test(`TC-009: Theme toggle in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Verify default light theme
        const initialTheme = await page.locator('html').getAttribute('data-theme');
        expect(initialTheme).toBe('light');
        
        const startTime = Date.now();
        
        // Toggle to dark theme
        await page.click('#theme-toggle');
        
        const toggleTime = Date.now() - startTime;
        console.log(`${browserType} theme toggle time: ${toggleTime}ms`);
        
        // Verify transition time < 300ms
        expect(toggleTime).toBeLessThan(300);
        
        // Verify theme changed
        await page.waitForTimeout(100);
        const newTheme = await page.locator('html').getAttribute('data-theme');
        expect(newTheme).toBe('dark');
        
        // Verify theme persists in storage
        const storedTheme = await page.evaluate(() => {
          const data = localStorage.getItem('ebv_theme_v1');
          return data ? JSON.parse(data).data : null;
        });
        expect(storedTheme).toBe('dark');
        
        // Reload and verify theme persists
        await page.reload();
        const persistedTheme = await page.locator('html').getAttribute('data-theme');
        expect(persistedTheme).toBe('dark');
      });
      
      // ======================================================================
      // TC-010: Category Management
      // ======================================================================
      test(`TC-010: Category management in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Verify default categories
        const categoryOptions = await page.locator('#category option').allTextContents();
        expect(categoryOptions).toContain('Food');
        expect(categoryOptions).toContain('Transport');
        expect(categoryOptions).toContain('Fun');
        
        // Add custom category
        await page.fill('#new-category', 'Shopping');
        await page.click('#add-category-btn');
        
        await page.waitForTimeout(200);
        
        // Verify new category appears in dropdown
        const updatedOptions = await page.locator('#category option').allTextContents();
        expect(updatedOptions).toContain('Shopping');
        
        // Test duplicate validation
        await page.fill('#new-category', 'shopping'); // lowercase
        await page.click('#add-category-btn');
        
        const error = await page.locator('#new-category-error').textContent();
        expect(error.toLowerCase()).toContain('already exists');
        
        // Test empty validation
        await page.fill('#new-category', '');
        await page.click('#add-category-btn');
        
        const emptyError = await page.locator('#new-category-error').textContent();
        expect(emptyError.toLowerCase()).toContain('empty');
      });
      
      // ======================================================================
      // TC-011: Monthly Summary
      // ======================================================================
      test(`TC-011: Monthly summary in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Add transactions
        for (const tx of TEST_TRANSACTIONS) {
          await page.fill('#item-name', tx.name);
          await page.fill('#amount', tx.amount);
          await page.selectOption('#category', tx.category);
          await page.click('button[type="submit"]');
        }
        
        await page.waitForTimeout(500);
        
        // Verify monthly summary shows current month by default
        const summaryVisible = await page.locator('#monthly-summary-content').isVisible();
        expect(summaryVisible).toBe(true);
        
        // Verify category totals appear
        await expect(page.locator('#monthly-summary-content')).toContainText('Food');
        await expect(page.locator('#monthly-summary-content')).toContainText('Transport');
      });
      
      // ======================================================================
      // TC-012: Keyboard Navigation
      // ======================================================================
      test(`TC-012: Keyboard navigation in ${browserType}`, async ({ page }) => {
        await page.goto(APP_URL);
        
        // Tab through form elements
        await page.keyboard.press('Tab'); // Focus on first input
        await page.keyboard.type('Keyboard Test');
        
        await page.keyboard.press('Tab'); // Move to amount
        await page.keyboard.type('25.50');
        
        await page.keyboard.press('Tab'); // Move to category
        await page.keyboard.press('ArrowDown'); // Select category
        
        await page.keyboard.press('Tab'); // Move to submit button
        await page.keyboard.press('Enter'); // Submit form
        
        await page.waitForTimeout(200);
        
        // Verify transaction was added
        await expect(page.locator('#transaction-list')).toContainText('Keyboard Test');
      });
      
      // ======================================================================
      // TC-013: Console Error Check
      // ======================================================================
      test(`TC-013: No console errors in ${browserType}`, async ({ page }) => {
        const errors = [];
        const warnings = [];
        
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
          if (msg.type() === 'error') errors.push(msg.text());
          if (msg.type() === 'warning') warnings.push(msg.text());
        });
        
        await page.goto(APP_URL);
        
        // Perform various actions
        await page.fill('#item-name', 'Error Test');
        await page.fill('#amount', '50');
        await page.selectOption('#category', 'Food');
        await page.click('button[type="submit"]');
        
        await page.click('#theme-toggle');
        await page.waitForTimeout(500);
        
        // Check for errors
        expect(errors.length).toBe(0);
        console.log(`${browserType} - Errors: ${errors.length}, Warnings: ${warnings.length}`);
      });
      
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Clear all Local Storage data
 */
async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Add sample transactions for testing
 */
async function addSampleTransactions(page, transactions) {
  for (const tx of transactions) {
    await page.fill('#item-name', tx.name);
    await page.fill('#amount', tx.amount);
    await page.selectOption('#category', tx.category);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(100);
  }
}

/**
 * Get computed style of element
 */
async function getComputedStyle(page, selector, property) {
  return await page.evaluate(({ sel, prop }) => {
    const element = document.querySelector(sel);
    return window.getComputedStyle(element).getPropertyValue(prop);
  }, { sel: selector, prop: property });
}

// ============================================================================
// EXPORT FOR USE
// ============================================================================

module.exports = {
  APP_URL,
  TEST_TRANSACTIONS,
  EXPECTED_TOTAL,
  clearStorage,
  addSampleTransactions,
  getComputedStyle
};
