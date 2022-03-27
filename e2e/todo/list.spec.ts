import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import db from '../../db.json';

test.describe('list and paginate', () => {
  let countTotal: number;

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos?**', async (route) => {
      const todos = faker.random.arrayElements(db.todos, 10);
      countTotal = faker.datatype.number({ min: 42, max: 104 });

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(todos),
        headers: {
          'x-total-count': countTotal.toString(),
        },
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('list all todo', async ({ page }) => {
    await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(10);

    await expect(
      page.locator('[aria-label="Todos navigation"] li:nth-last-child(2)'),
    ).toHaveText(Math.ceil(countTotal / 10).toString());
  });

  test('first page is active', async ({ page }) => {
    await expect(page.locator('[aria-label="Previous"]')).toBeDisabled();

    await expect(
      page.locator('[aria-label="Todos navigation"] li:nth-child(2)'),
    ).toHaveClass(/active/);
    await expect(page.locator('text="1"')).toBeDisabled();
  });

  test('navigate to the next page', async ({ page }) => {
    await page.locator('[aria-label="Next"]').click();

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('[aria-label="Todos navigation"] li:nth-child(3)'),
    ).toHaveClass(/active/);
    await expect(page.locator('text="2"')).toBeDisabled();
    await expect(page.locator('[aria-label="Previous"]')).toBeEnabled();
  });

  test('navigate to a specific page', async ({ page }) => {
    await page.locator('text="4"').click();

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator('[aria-label="Todos navigation"] li:nth-child(5)'),
    ).toHaveClass(/active/);
    await expect(page.locator('text="4"')).toBeDisabled();
  });

  test('navigate to the previous page', async ({ page }) => {
    await page.locator('text="4"').click();

    await page.waitForLoadState('networkidle');

    await expect(page.locator('[aria-label="Previous"]')).toBeEnabled();

    await page.locator('[aria-label="Previous"]').click();

    await expect(
      page.locator('[aria-label="Todos navigation"] li:nth-child(4)'),
    ).toHaveClass(/active/);
    await expect(page.locator('text="3"')).toBeDisabled();
  });
});
