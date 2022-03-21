import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import type { Todo } from '../../src/features/todo/todoSlice';

test.describe('create a todo', () => {
  let todo: Todo;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.route('**/api/todos', (route) => {
      if (route.request().method() === 'POST') {
        todo = route.request().postDataJSON();
      }

      return route.continue();
    });
  });

  test.afterEach(async ({ request }) => {
    if (todo) {
      await request.delete(`/api/todos/${todo.id}`);
    }
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
