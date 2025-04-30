import type { Locator } from '@playwright/test'
import type { Entity, THREE } from 'aframe'
import type { ElementWithObject3D, ElementWithObject3DMap } from './types'
import { color, object, rotation } from './utils'

const getMaterial = (element: ElementWithObject3DMap): THREE.Material | null =>
  element?.object3DMap.mesh.material

const getGeometry = (
  element: ElementWithObject3DMap
): THREE.BufferGeometry | Record<string, unknown> | null => element?.object3DMap.mesh.geometry

const getMaterialColor = (element: ElementWithObject3DMap) =>
  element?.object3DMap?.mesh?.material?.color.clone().convertLinearToSRGB()
const getMaterialOpacity = (element: ElementWithObject3DMap) =>
  element?.object3DMap?.mesh?.material?.opacity

const getRotation = (element: ElementWithObject3D) => element?.object3D?.rotation
const getScale = (element: ElementWithObject3D) => element?.object3D?.scale
const getPosition = (element: ElementWithObject3D) => element?.object3D?.position
const getVisible = (element: ElementWithObject3D) => element?.object3D?.visible

const clickOnElement = (element: ElementWithObject3D) =>
  element.dispatchEvent(new Event('click', { bubbles: true }))

const setCameraPosition = (
  element: ElementWithObject3D,
  { x, y, z }: { x: number; y: number; z: number }
) => element?.object3D.el?.sceneEl?.camera?.el?.object3D?.position.set(x, y, z)

const setCameraRotation = (
  element: ElementWithObject3D,
  { x, y, z }: { x: number; y: number; z: number }
) =>
  element?.object3D.el?.sceneEl?.camera?.el?.components?.[
    'look-controls'
  ]?.yawObject?.rotation?.set?.(x, y, z)

const getCameraPosition = (element: ElementWithObject3D) =>
  element?.object3D.el?.sceneEl?.camera?.el?.object3D?.position
const getCameraRotation = (element: ElementWithObject3D) =>
  element?.object3D.el?.sceneEl?.camera?.el?.components?.['look-controls']?.yawObject?.rotation ?? {
    _x: 0,
    _y: 0,
    _z: 0,
  }

const lookAtElement = async (element: Locator) => {
  // simple lookAt can be achieved with: element?.sceneEl?.camera?.lookAt(element.object3D.position)
  const page = element.page()

  const isLookedAt = await page.evaluate(
    element => {
      const THREE = window['THREE']

      const camera = (element as ElementWithObject3D)?.object3D.el?.sceneEl?.camera?.el?.object3D

      if (!camera) {
        return false
      }

      const box = new THREE.Box3()
      const target = (element as ElementWithObject3D).object3D
      const center = new THREE.Vector3()
      const sphere = new THREE.Sphere()
      let distance = 1

      box.setFromObject(target)

      if (box.isEmpty() === false && !isNaN(box.min.x)) {
        box.getCenter(center)
        distance = box.getBoundingSphere(sphere).radius
      } else {
        center.setFromMatrixPosition(target.matrixWorld)
        distance = 0.1
      }

      camera.position.copy(
        target.localToWorld(new THREE.Vector3(0, center.y + distance * 0.25, distance * 2))
      )

      const position = target.getWorldPosition(new THREE.Vector3())
      position.y = center.y
      camera.lookAt(position)

      return true
    },
    await element.evaluateHandle(el => el)
  )

  return isLookedAt
}

const isInFoV = async (element: Locator) => {
  const page = element.page()

  const isVisible: boolean = await page.evaluate(
    element => {
      const THREE = window['THREE']

      const boundingBox = new THREE.Box3().setFromObject((element as ElementWithObject3D).object3D)

      const frustum = new THREE.Frustum()
      const camera = (element as Entity)?.sceneEl?.camera

      if (!camera) {
        return false
      }

      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      )

      return frustum.intersectsBox(boundingBox)
    },
    await element.evaluateHandle(el => el)
  )

  return isVisible
}

const areElementsNearbyByCenter = async (
  element: Locator,
  otherElement: Locator,
  distance: number
) => {
  const [position, otherPosition] = await Promise.all([
    element.evaluate(getPosition),
    otherElement.evaluate(getPosition),
  ])

  const dx = position.x - otherPosition.x
  const dy = position.y - otherPosition.y
  const dz = position.z - otherPosition.z

  return Math.sqrt(dx * dx + dy * dy + dz * dz) < distance
}

const getMaterialColorWithOpacity = async (element: Locator) => {
  const [color, opacity] = await Promise.all([
    element.evaluate(getMaterialColor),
    element.evaluate(getMaterialOpacity),
  ])

  return {
    ...color,
    a: opacity,
  }
}

const aframe = {
  getGeometry: (element: Locator) => element.evaluate(getGeometry),
  getGeometryAttribute: async <T>(element: Locator, attribute: string) =>
    object.traverse(await element.evaluate(getGeometry), attribute) as T,

  getMaterial: (element: Locator) => element.evaluate(getMaterial),
  getMaterialAttribute: async <T>(element: Locator, attribute: string) =>
    object.traverse(await element.evaluate(getMaterial), attribute) as T,

  getMaterialColor: async (element: Locator) => color(await getMaterialColorWithOpacity(element)),
  getRotation: async (element: Locator) => rotation(await element.evaluate(getRotation)),
  getScale: (element: Locator) => element.evaluate(getScale),
  getPosition: (element: Locator) => element.evaluate(getPosition),

  isVisible: (element: Locator) => element.evaluate(getVisible),
  isInFoV: (element: Locator) => isInFoV(element),

  lookAtElement,
  setCameraPosition: (element: Locator, position: { x: number; y: number; z: number }) =>
    element.evaluate(setCameraPosition, position),
  setCameraRotation: (element: Locator, rotation: { x: number; y: number; z: number }) =>
    element.evaluate(setCameraRotation, rotation),
  getCameraPosition: (element: Locator) => element.evaluate(getCameraPosition),
  getCameraRotation: async (element: Locator) =>
    rotation(await element.evaluate(getCameraRotation)),
  clickOnElement: (element: Locator) => element.evaluate(clickOnElement),

  areElementsNearbyByCenter,

  areElementsNear: async (firstElement: Locator, secondElement: Locator, distance: number) => {
    const [firstPosition, secondPosition] = await Promise.all([
      firstElement.evaluate(getPosition),
      secondElement.evaluate(getPosition),
    ])

    const dx = firstPosition.x - secondPosition.x
    const dy = firstPosition.y - secondPosition.y
    const dz = firstPosition.z - secondPosition.z
    const distanceBetween = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const size = await firstElement.evaluate(el => {
      const THREE = window['THREE']

      const obj = (el as ElementWithObject3DMap).object3DMap.mesh
      return obj instanceof THREE.Object3D ? new THREE.Box3().setFromObject(obj) : null
    })
    const otherSize = await secondElement.evaluate(el => {
      const THREE = window['THREE']

      const obj = (el as ElementWithObject3DMap).object3DMap.mesh
      return obj instanceof THREE.Object3D ? new THREE.Box3().setFromObject(obj) : null
    })

    if (!size || !otherSize) {
      return false
    }

    const sizeDistance =
      Math.sqrt(
        Math.pow(size.max.x - size.min.x, 2) +
          Math.pow(size.max.y - size.min.y, 2) +
          Math.pow(size.max.z - size.min.z, 2)
      ) +
      Math.sqrt(
        Math.pow(otherSize.max.x - otherSize.min.x, 2) +
          Math.pow(otherSize.max.y - otherSize.min.y, 2) +
          Math.pow(otherSize.max.z - otherSize.min.z, 2)
      )

    return distanceBetween < distance + sizeDistance
  },
}

export { aframe }
