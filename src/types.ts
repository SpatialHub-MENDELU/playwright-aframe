import type { Entity, THREE } from 'aframe'

export type RGB = {
  r: number
  g: number
  b: number
}

export type RGBA = {
  r: number
  g: number
  b: number
  a: number
}

type EulerRotation = {
  _x: number
  _y: number
  _z: number
}

export type ElementWithObject3D = HTMLElement &
  Pick<Entity, 'object3D' | 'sceneEl'> & {
    object3D: THREE.Camera & {
      rotation: EulerRotation
      el: ElementWithObject3D & {
        sceneEl: {
          camera: {
            el: ElementWithObject3D & {
              components: Record<
                string,
                {
                  yawObject: {
                    rotation: EulerRotation & {
                      set: (x: number, y: number, z: number) => void
                    }
                  }
                }
              >
            }
          }
        }
      }
    }
  }

export type ElementWithObject3DMap = HTMLElement &
  Pick<Entity, 'object3DMap'> & {
    object3DMap: {
      mesh: {
        material: THREE.Material & {
          color: {
            r: number
            g: number
            b: number
            a?: number
            clone: () => {
              convertLinearToSRGB: () => RGB
            }
          }
          opacity: number
        }
        geometry: THREE.BufferGeometry
      }
    }
  }

declare global {
  interface Window {
    THREE: typeof THREE
  }
}
