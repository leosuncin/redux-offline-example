import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import type { Todo } from '../../src/features/todo/todoSlice';

let db: Todo[] = Array.from({ length: 34 }, (_, index) => ({
  id: faker.datatype.uuid(),
  task: `${String(index + 1).padStart(2, '0')} ${faker.lorem.sentence()}`,
  completed: faker.datatype.boolean(),
}));

test.describe('delete a todo', () => {
  let todo: Todo;

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos?**', (route) => {
      const url = new URL(route.request().url());
      const page = Number.parseInt(url.searchParams.get('_page')) || 1;
      const limit = 10;
      const todos = db.slice(limit * (page - 1), limit * page);
      todo = faker.random.arrayElement(todos);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(todos),
        headers: {
          'x-total-count': String(db.length),
        },
      });
    });

    await page.route('**/api/todos/**', (route) => {
      const result =
        /\/api\/todos\/(?<id>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/.exec(
          route.request().url(),
        );
      const { id } = result.groups;

      db = db.filter((todo) => todo.id !== id);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      });
    });

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

    for (let i = 0; i < 4; i++) {
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
