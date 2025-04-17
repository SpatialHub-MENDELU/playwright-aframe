import type { THREE } from 'aframe'

declare global {
  interface Window {
    THREE: typeof THREE
  }
}
