import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('offline mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos**', (route) =>
      route.abort('internetdisconnected'),
    );

    await page.goto('/', { waitUntil: 'load' });

    await page.context().setOffline(true);
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/api/todos**');

    await page.context().setOffline(false);
  });

  test('show an empty list', async ({ page }) => {
    await expect(
      page.locator('text=The list of tasks will be shown here'),
    ).toBeVisible();
  });

  test('CRUD of a todo', async ({ page }) => {
    await test.step('add a new todo', async () => {
      const task = faker.hacker.phrase();

      await page.locator('[aria-label="Task"]').fill(task);

      await page.locator('text=Add task').click();

      await expect(page.locator(`text=${task}`)).toBeVisible();
    });

    await test.step('mark as complete', async () => {
      await page.locator('[aria-label="Mark done"]').check();

      await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    });

    await test.step('edit the todo', async () => {
      const task = faker.company.catchPhrase();

      await page.locator('text=Edit').click();

      await page.locator('#task').type(task);

      await page.locator('text=Save').click();

      await expect(page.locator(`text=${task}`)).toBeVisible();
    });

    await test.step('toggle to pending', async () => {
      await page.locator('[aria-label="Mark pending"]').uncheck();

      await expect(page.locator('input[type="checkbox"]')).not.toBeChecked();
    });

    await test.step('remove the todo', async () => {
      await page.locator('text=Remove').click();

      await expect(page.locator('[data-testid="list-todo"] li')).toHaveCount(0);
    });
  });
});
