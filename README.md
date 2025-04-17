# Playwright A-Frame E2E Testing Library

## Overview
`playwright-aframe` is a Node.js library designed to simplify end-to-end (E2E) testing of A-Frame-based applications using Playwright. It provides a collection of utilities for interacting with 3D objects, manipulating camera positions, and verifying object properties in a 3D scene.

## Installation
Install the library using npm:

```bash
npm install playwright-aframe
```

yarn:
```bash
yarn add playwright-aframe
```

or pnpm:

```bash
pnpm add playwright-aframe
```

## Usage

### Example
```typescript
import { aframe } from 'playwright-aframe'

// Example: Check if an element is visible
const isVisible = await aframe.isVisible(elementLocator)

// Example: Set camera position
await aframe.setCameraPosition(cameraLocator, { x: 0, y: 1, z: 5 })

// Example: Look at an element
await aframe.lookAtElement(targetLocator)

// Example: Get the geometry of an element - second argument is dot notation path
await aframe.getMaterialAttribute(elementLocator, 'color.isColor')
```

## API Reference

### High-Level Functions
- **`getGeometry(element: Locator): Promise<THREE.BufferGeometry<THREE.NormalBufferAttributes> | Record<string, unknown> | null>`**
  - Retrieves the geometry of a 3D object.

- **`getGeometryAttribute<T>(element: Locator, attribute: string): Promise<T>`**
  - Retrieves a specific geometry attribute of a 3D object.

- **`getMaterial(element: Locator): Promise<THREE.Material | null>`**
  - Retrieves the material of a 3D object.

- **`getMaterialAttribute<T>(element: Locator, attribute: string): Promise<T>`**
  - Retrieves a specific material attribute of a 3D object.

- **`getMaterialColor(element: Locator): Promise<{ rgb: RGB; rgba: RGBA; hex: string; hexWithAlpha: string }>`**
  - Retrieves the color of a material in various formats.

- **`getRotation(element: Locator): Promise<{ degrees: { x: number; y: number; z: number }; radians: { x: number; y: number; z: number } }>`**
  - Retrieves the rotation of a 3D object in both degrees and radians.

- **`getScale(element: Locator): Promise<THREE.Vector3>`**
  - Retrieves the scale of a 3D object.

- **`getPosition(element: Locator): Promise<THREE.Vector3>`**
  - Retrieves the position of a 3D object.

- **`isVisible(element: Locator): Promise<boolean>`**
  - Checks if a 3D object is visible.

- **`isInFoV(element: Locator): Promise<boolean>`**
  - Checks if a 3D object is within the camera's field of view.

- **`lookAtElement(element: Locator): Promise<boolean>`**
  - Adjusts the camera to look at a specific 3D object.

- **`setCameraPosition(element: Locator, position: { x: number; y: number; z: number }): Promise<THREE.Vector3>`**
  - Sets the camera position in the scene.

- **`setCameraRotation(element: Locator, rotation: { x: number; y: number; z: number }): Promise<void | undefined>`**
  - Sets the camera rotation in the scene.

- **`getCameraPosition(element: Locator): Promise<THREE.Vector3>`**
  - Retrieves the current camera position.

- **`getCameraRotation(element: Locator): Promise<{ degrees: { x: number; y: number; z: number }; radians: { x: number; y: number; z: number } }>`**
  - Retrieves the current camera rotation in both degrees and radians.

- **`clickOnElement(element: Locator): Promise<boolean>`**
  - Simulates a click event on a 3D object.

- **`areElementsNearbyByCenter(element: Locator, otherElement: Locator, distance: number): Promise<boolean>`**
  - Checks if two 3D objects are within a specified distance of each other by their centers.

- **`areElementsNear(firstElement: Locator, secondElement: Locator, distance: number): Promise<boolean>`**
  - Checks if two 3D objects are near each other within a specified distance.

## Requirements
- [Playwright](https://playwright.dev/) as a dependency (this library has Playwright as a peer dependency).
- [A-Frame](https://aframe.io/)

## License
This library is licensed under the MIT License.

## TODO
- [ ] Change the TypeScript build process from `tsc` to Vite to improve efficiency and support additional module formats.
