import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import db from '../../db.json';

const byPageRoute = /\/api\/todos(?:\?_page=\d+)?$/;
const byIdRoute =
  /\/api\/todos\/(?<id>[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/;

test.describe('delete a todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(byPageRoute, (route) => {
      const url = new URL(route.request().url());
      const page = Number.parseInt(url.searchParams.get('_page')) || 1;
      const limit = 10;
      const slice = db.todos.slice(limit * (page - 1), limit * page);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(slice),
        headers: {
          'x-total-count': String(db.todos.length),
        },
      });
    });

    await page.route(byIdRoute, (route) => {
      const result = byIdRoute.exec(route.request().url());
      const { id } = result.groups;

      db.todos = db.todos.filter((todo) => todo.id !== id);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('click the remove button', async ({ page }) => {
    const itemIndex = faker.datatype.number({ min: 0, max: 9 });
    const $todo = page.locator('[data-testid="list-todo"] li').nth(itemIndex);
    const task = await $todo.locator('*:nth-child(2)').nth(0).innerText();

    await $todo.locator('text=Remove').click();

    await page.waitForLoadState('networkidle');

    await expect(page.locator(`text="${task}"`)).not.toBeVisible();
  });

  test('empty the last page', async ({ page }) => {
    const $lastPage = page.locator(
      '[aria-label="Todos navigation"] li:nth-last-child(2)',
    );
    const lastPage = Number(await $lastPage.innerText());

    await $lastPage.click();

    await page.waitForLoadState('networkidle');

    const $list = page.locator('[data-testid="list-todo"] li');
    const count = await $list.count();

    for (let i = 0; i < count; i++) {
      await $list.last().locator('text=Remove').click();

      await page.waitForLoadState('networkidle');
    }

    const newLastPage = Number(await $lastPage.innerText());

    expect(newLastPage).toBeLessThanOrEqual(lastPage - 1);
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
