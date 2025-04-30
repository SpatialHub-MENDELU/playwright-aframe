import { expect, test } from '@playwright/test'
import { aframe } from 'playwright-aframe'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 1
  })

  await page.goto('/')
})

test('Test...', async ({ page }) => {
  // ...
})
