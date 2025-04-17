import type { Object3D } from 'three'

export const generateRandomNumber = (minValue: number, maxValue: number) =>
  Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue

export type HTMLElementWithObject3D = HTMLElement & {
  object3D: Object3D
}

export const isHtmlElementWithObject3D = (
  element: EventTarget | null
): element is HTMLElementWithObject3D => element instanceof HTMLElement && 'object3D' in element
