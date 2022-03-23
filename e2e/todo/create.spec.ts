import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import type { Todo } from '../../src/features/todo/todoSlice';

const todos: Todo[] = Array.from({ length: 9 }, () => ({
  id: faker.datatype.uuid(),
  task: faker.lorem.sentence(),
  completed: faker.datatype.boolean(),
}));

test.describe('create a todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.route('**/api/todos?**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(todos),
      }),
    );

    await page.route('**/api/todos', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: route.request().postData(),
      }),
    );
  });

  test('submit the form', async ({ page }) => {
    const task = faker.lorem.sentence();

    await page.locator('[aria-label="Task"]').fill(task);
    await page.locator('[aria-label="Task"]').press('Enter');

    await page.locator('text=Add task').click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[aria-label="Task"]')).toHaveValue('');
    await expect(page.locator(`text=${task}`)).toBeVisible();
  });

  test('click add button', async ({ page }) => {
    const task = faker.company.catchPhrase();

    await page.locator('[aria-label="Task"]').fill(task);

    await page.locator('text=Add task').click();

    await expect(page.locator('[aria-label="Task"]')).toHaveValue('');
    await expect(page.locator(`text=${task}`)).toBeVisible();
  });

  test('avoid to add an empty task', async ({ page }) => {
    await page.locator('text=Add task').click();

    await expect(page.locator('[aria-label="Task"]:invalid')).toBeVisible();
  });
});
