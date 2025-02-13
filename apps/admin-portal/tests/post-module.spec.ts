import { test, expect } from '@playwright/test';

test.describe.serial('Post Module Tests', () => {
    const baseURL = 'http://localhost:5173/en-us';
    const email = 'monorepo@abcdigital.io';
    const password = 'monorepoTemplate2024@';

    const selectors = {
        emailInput: 'input[name="email"]',
        passwordInput: 'input[name="password"]',
        loginButton: 'button:has-text("Login")',
        saveButton: 'button:has-text("Save")',
        searchInput: 'input[placeholder="Keyword..."]',
        postNameInput: 'input[name="nameLocalized"]',
        postDescriptionInput: 'textarea:below(:text("Description"))',
        postContentInput: 'textarea:below(:text("Content"))',
    };

    // Test Data
    const testData = {
        newPostName: 'Test Posts 1',
        newPostDescription: 'Test Descriptions 1',
        newPostContent: 'Test Contents 1',
        updatedPostName: 'Updated Post Names 1',
        searchKeyword: 'Test',
    };

    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/login`);
        await page.fill(selectors.emailInput, email);
        await page.fill(selectors.passwordInput, password);
        await page.click(selectors.loginButton);
        await page.click('text=Posts');
    });

    test('TC_001 Verify navigation to Posts List', async ({ page }) => {
        await expect(page).toHaveURL(/.*posts/);
    });

    test('TC_002 Verify creation of a new post', async ({ page }) => {
        await page.click('text= Create new post');
        await page.fill(selectors.postNameInput, testData.newPostName);
        await page.fill(selectors.postDescriptionInput, testData.newPostDescription);
        await page.fill(selectors.postContentInput, testData.newPostContent);
        await page.click(selectors.saveButton);
        await expect(page.locator('table')).toContainText(testData.newPostName);
    });

    test('TC_003 Verify editing an existing post', async ({ page }) => {
        await page.click(`text=${testData.newPostName}`);
        await page.fill(selectors.postNameInput, testData.updatedPostName);
        await page.click(selectors.saveButton);
        await expect(page.locator('table')).toContainText(testData.updatedPostName);
    });

    test('TC_004 Verify deleting a post', async ({ page }) => {
        await page.click('tbody tr:first-child td:last-child button');
        await page.click('role=menuitem[name="Delete"]');
        await page.click('button:has-text("Yes")');
        const statusLocator = page.locator('tbody tr:first-child td:nth-child(5)');
        await expect(statusLocator).toHaveText('Deleted');
    });

    test('TC_005 Verify filtering posts by status', async ({ page }) => {
        await page.getByTestId('filter-btn').click();
        await page.click('role=menuitem[name="Status"]');
        await page.click('role=option[name="Published"]');
        await expect(page.locator('table')).toContainText('Published');
    });

    test('TC_006 Verify searching for a post', async ({ page }) => {
        await page.fill(selectors.searchInput, testData.searchKeyword);
        await page.getByTestId('search-btn').click();
        await expect(page.locator('table')).toContainText(testData.searchKeyword);
    });

    test('TC_007 Verify post status update', async ({ page }) => {
        await page.click(`text=${testData.updatedPostName}`);
        await page.click('text=Deleted');
        await page.getByRole('option', { name: 'Published' }).click();
        await page.click(selectors.saveButton);
        await expect(page.locator('table')).toContainText('Published');
    });

    test('TC_008 Verify post detail view', async ({ page }) => {
        const postRow = page.locator('tr', { hasText: testData.updatedPostName });
        await postRow.locator('text=Detail').click();
        await expect(page.locator('h2')).toHaveText(new RegExp(testData.updatedPostName));
    });
});
