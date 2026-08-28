import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const entry of [
  { name: 'landing desktop', path: '/', viewport: { width: 1440, height: 900 } },
  { name: 'demo mobile', path: '/?demo=1', viewport: { width: 390, height: 844 } },
  { name: 'privacy', path: '/privacy', viewport: { width: 390, height: 844 } },
  { name: 'terms', path: '/terms', viewport: { width: 390, height: 844 } },
  { name: 'not found', path: '/missing-page', viewport: { width: 390, height: 844 } },
]) test(`accessibility: ${entry.name}`, async ({ page }) => {
  await page.setViewportSize(entry.viewport);
  await page.goto(entry.path);
  if (entry.path.includes('demo')) await expect(page.getByRole('heading', { level: 1, name: 'boot' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('browser smoke: no console errors, metadata and legal links are present', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://code-graph-explorer.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /graphite-social\.jpg$/);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Terms' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('first screen keeps the sample action in view on desktop and phone', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const action = page.getByRole('link', { name: 'Try it with sample data' });
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  }
});

test('Team dialog is labelled, axe-clean, and returns focus to its opener', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'View Team export' }).first();
  await opener.focus(); await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Share the path you traced' });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close Team export dialog' })).toBeFocused();
  const results = await new AxeBuilder({ page }).include('.team-dialog').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
});

test('reduced motion removes smooth scrolling and long transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1, name: 'boot' })).toBeVisible();
  const values = await page.evaluate(() => ({ scroll: getComputedStyle(document.documentElement).scrollBehavior, transition: getComputedStyle(document.querySelector('.graph-node')!).transitionDuration }));
  expect(values.scroll).toBe('auto');
  expect(Number.parseFloat(values.transition)).toBeLessThanOrEqual(.01);
});
