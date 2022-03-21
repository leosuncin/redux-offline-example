import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import type { Todo } from '../../src/features/todo/todoSlice';

test.describe('delete a todo', () => {
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

  test('click the remove button', async ({ page }) => {
    await page
      .locator(`[data-testid="todo-${todo.id}"] >> text=Remove`)
      .click();

    await expect(page.locator(`text=${todo.task}`)).not.toBeVisible();
  });

  test('empty the last page', async ({ page }) => {
    const lastPage = await page.$eval(
      '[aria-label="Todos navigation"] li:nth-last-child(2)',
      (el: HTMLLIElement) => el.innerText,
    );
    const $list = await page.locator('[data-testid="list-todo"] li');

    while ((await $list.count()) > 0) {
      await $list.last().locator('text=Remove').click();
    }

    await page.waitForLoadState('networkidle');

    await expect(
      page.locator(`button:has-text("${lastPage}")`),
    ).not.toBeVisible();
    await expect(
      page.$eval(
        '[aria-label="Todos navigation"] li:nth-last-child(2)',
        (item: HTMLLIElement) => Number(item.innerText),
      ),
    ).resolves.toBeLessThanOrEqual(Number(lastPage) - 1);
  });

  test('fetch todos from next page', async ({ page }) => {
    await page.locator('text="2"').click();

    await page.waitForLoadState('networkidle');

    const itemIndex = faker.datatype.number({ min: 0, max: 9 });

    await page
      .locator('[data-testid="list-todo"] li')
      .nth(itemIndex)
      .locator('text=Remove')
      .click();

    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(10);
  });
});
