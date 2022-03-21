import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import type { Todo } from '../../src/features/todo/todoSlice';

test.describe('update a todo', () => {
  let todo: Todo;

  test.beforeEach(async ({ page, request }) => {
    const response = await request.post('/api/todos', {
      data: {
        id: faker.datatype.uuid(),
        task: faker.company.catchPhrase(),
        completed: false,
      },
    });
    todo = await response.json();

    await page.goto('/', { waitUntil: 'networkidle' });

    await page
      .locator('[aria-label="Todos navigation"] li:nth-last-child(2)')
      .click();

    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`/api/todos/${todo.id}`, { failOnStatusCode: false });
  });

  test('mark as complete', async ({ page }) => {
    const $todo = page.locator(`[data-testid="todo-${todo.id}"]`);

    await $todo.locator(`[aria-label="Mark done"]`).check();

    await expect($todo.locator(`input[type="checkbox"]`)).toBeChecked();
  });

  test('edit the task', async ({ page }) => {
    const task = faker.hacker.phrase();
    const $todo = page.locator(`[data-testid="todo-${todo.id}"]`);

    await $todo.locator(`text=Edit`).click();

    await $todo.locator('input').fill(task);

    await $todo.locator('text=Save').click();

    await expect($todo.locator(`text=${task}`)).toBeVisible();
  });

  test('cancel the edition of a task', async ({ page }) => {
    const task = faker.hacker.phrase();
    const $todo = page.locator(`[data-testid="todo-${todo.id}"]`);

    await $todo.locator(`text=Edit`).click();

    await $todo.locator('input').fill(task);

    await $todo.locator('text=Cancel').click();

    await expect($todo.locator(`text=${todo.task}`)).toBeVisible();
  });
});
