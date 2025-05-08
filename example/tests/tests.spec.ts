import { expect, test } from '@playwright/test'
import { aframe } from 'playwright-aframe'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 1
  })

  await page.goto('/')

  await page.getByTestId('dialog-button').click()
})

test('Look at elements', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const lookAtResult = await aframe.lookAtElement(bottle)

  await page.waitForTimeout(5000)

  expect(lookAtResult).toBe(true)
})

test('Get rotation', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const rotation = await aframe.getRotation(bottle)

  expect(rotation.degrees).toEqual({ x: 0, y: 91, z: 0 })
  expect(rotation.radians).toEqual({ x: 0, y: 1.5882496193148399, z: 0 })
})

test('Get scale', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const scale = await aframe.getScale(bottle)

  expect(scale).toEqual({ x: 0.5, y: 0.5, z: 0.5 })
})

test('Get position', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const position = await aframe.getPosition(bottle)

  expect(position).toEqual({ x: 6.5, y: 0, z: 5.5 })
})

test('Can click on element', async ({ page }) => {
  const score = page.getByTestId('score-correct')
  await expect(score).toHaveAttribute('data-score-correct', '0')

  const bottle = page.locator('#trash-bottle')
  await aframe.clickOnElement(bottle)

  const oldPosition = await aframe.getPosition(bottle)

  await aframe.setCameraPosition(bottle, { x: 7, y: 2, z: 12 })
  await aframe.setCameraRotation(bottle, { x: 0.05, y: 0, z: 0 })

  await page.mouse.click(0, 0)

  await expect(score).toHaveAttribute('data-score-correct', '1')
  expect(await aframe.getPosition(bottle)).not.toEqual(oldPosition)
})

test('Can change camera position and rotation', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  await page.waitForTimeout(2000)

  await aframe.setCameraPosition(bottle, { x: 7, y: 2, z: 12 })
  await aframe.setCameraRotation(bottle, { x: 0.05, y: 1.0, z: 0 })
  await page.waitForTimeout(3000)

  const position = await aframe.getCameraPosition(bottle)
  const rotation = await aframe.getCameraRotation(bottle)
  expect(position).toEqual({ x: 7, y: 2, z: 12 })
  expect(rotation.radians).toEqual({ x: 0.05, y: 1.0, z: 0 })
})

test('Is visible', async ({ page }) => {
  const paper = page.locator('#trash-paper')
  const isVisible = await aframe.isVisible(paper)

  expect(isVisible).toBe(true)
})

test('Is not in FoV', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const isInFoV = await aframe.isInFoV(bottle)

  expect(isInFoV).toBe(false)
})

test('Is in FoV', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  await aframe.setCameraPosition(bottle, { x: 7, y: 2, z: 12 })
  await aframe.setCameraRotation(bottle, { x: 0.05, y: 0, z: 0 })
  const isInFoV = await aframe.isInFoV(bottle)

  expect(isInFoV).toBe(true)
})

test('Are elements nearby by center', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const paper = page.locator('#trash-paper')
  const areNearby = await aframe.areElementsNearbyByCenter(bottle, paper, 2)

  expect(areNearby).toBe(true)
})

test('Are not elements nearby by center', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const paper = page.locator('#trash-paper')
  const areNearby = await aframe.areElementsNearbyByCenter(bottle, paper, 0.01)

  expect(areNearby).toBe(false)
})

test('Are elements near', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const paper = page.locator('#trash-paper')
  const areNear = await aframe.areElementsNear(bottle, paper, 2)

  expect(areNear).toBe(true)
})

test('Are not elements near', async ({ page }) => {
  const bottle = page.locator('#trash-bottle')
  const paper = page.locator('#crate-paper')
  const areNear = await aframe.areElementsNear(bottle, paper, 5)

  expect(areNear).toBe(false)
})

test('Finish line color', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const color = await aframe.getMaterialColor(startLine)

  expect(color.hex).toEqual('#8bc34a')
  expect(color.hexWithAlpha).toEqual('#8bc34a80')
  expect(color.rgb).toEqual({
    b: 74.00157345106649,
    g: 195.00084396116895,
    r: 139.00138139820544,
  })
  expect(color.rgba).toEqual({
    b: 74.00157345106649,
    g: 195.00084396116895,
    r: 139.00138139820544,
    a: 0.5,
  })
})

test('Finish line material', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const material = await aframe.getMaterial(startLine)

  expect(material).toMatchObject({
    transparent: true,
    fog: true,
  })
})

test('Finish line position', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const position = await aframe.getPosition(startLine)
  const rotation = await aframe.getRotation(startLine)
  const scale = await aframe.getScale(startLine)
  const geometry = await aframe.getGeometry(startLine)
  const material = await aframe.getMaterial(startLine)

  expect(position).toEqual({ x: 0, y: 0, z: 5.8 })
  expect(rotation.degrees).toEqual({ x: 0, y: 90, z: 0 })
  expect(rotation.radians).toEqual({ x: 0, y: 1.5707963267948966, z: 0 })
  expect(scale).toEqual({ x: 0.1, y: 0.01, z: 10 })
  expect(geometry).toMatchObject({ type: 'BoxGeometry' })
  expect(material).toMatchObject({
    depthTest: true,
    type: 'MeshStandardMaterial',
  })
})

test('Finish line geometry', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const geometry = await aframe.getGeometry(startLine)

  expect(geometry).toMatchObject({ type: 'BoxGeometry' })
})

test('Finish line geometry attribute', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const geometryAttribute = await aframe.getGeometryAttribute(startLine, 'parameters.depth')

  expect(geometryAttribute).toBe(1)
})

test('Finish line material attribute', async ({ page }) => {
  const startLine = page.locator('#start-line')
  const materialAttribute = await aframe.getMaterialAttribute(startLine, 'color.isColor')

  expect(materialAttribute).toBe(true)
})
