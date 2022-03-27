import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

const todos = Array.from({ length: 10 }, () => ({
  id: faker.datatype.uuid(),
  task: faker.lorem.sentence(),
  completed: faker.datatype.boolean(),
}));
const activeCount = todos.filter(({ completed }) => !completed).length;
const completedCount = todos.length - activeCount;

test.describe('Filter todos by', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos?**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(todos),
      }),
    );

    await page.route('**/api/todos/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      }),
    );

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('show all by default', async ({ page }) => {
    await expect(page.locator('#all')).toBeChecked();

    await expect(
      page.locator(`text=Showing 10 of ${todos.length} tasks`),
    ).toBeVisible();

    await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(
      todos.length,
    );
  });

  test('filter only active', async ({ page }) => {
    await page.locator('label:has-text("Active")').click();

    await expect(page.locator('#active')).toBeChecked();

    await expect(
      page.locator(`text=Showing ${activeCount} of ${todos.length} tasks`),
    ).toBeVisible();

    await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(
      activeCount,
    );
  });

  test('filter only completed', async ({ page }) => {
    await page.locator('label:has-text("Completed")').click();

    await expect(page.locator('#completed')).toBeChecked();

    await expect(
      page.locator(`text=Showing ${completedCount} of ${todos.length} tasks`),
    ).toBeVisible();

    await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(
      completedCount,
    );
  });

  test('clear all of the completed ones', async ({ page }) => {
    await page.locator('text=Clear completed').click();

    await expect(
      page.locator(`text=Showing ${activeCount} of ${activeCount} tasks`),
    ).toBeVisible();
  });
});
