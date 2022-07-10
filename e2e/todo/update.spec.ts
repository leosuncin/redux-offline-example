import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import db from '../../db.json';

let list = faker.helpers.arrayElements(
  db.todos.filter(({ completed }) => !completed),
  7,
);
let todo = faker.helpers.arrayElement(list);

test.describe('update a todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos?**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(list),
      }),
    );

    await page.route('**/api/todos/**', (route) => {
      list = list.map((item) => {
        if (item.id !== todo.id) return todo;

        todo = {
          ...item,
          ...route.request().postDataJSON(),
        };

        return todo;
      });

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(todo),
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
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
