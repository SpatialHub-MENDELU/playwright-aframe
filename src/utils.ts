import type { RGB, RGBA } from './types'

const color = (
  c: Partial<RGBA> & RGB
): {
  rgb: RGB
  rgba: RGBA
  hex: string
  hexWithAlpha: string
} => ({
  rgb: {
    r: c.r * 255,
    g: c.g * 255,
    b: c.b * 255,
  },
  rgba: {
    r: c.r * 255,
    g: c.g * 255,
    b: c.b * 255,
    a: c.a ?? 1,
  },
  hex: `#${Math.round(c.r * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(c.g * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(c.b * 255)
    .toString(16)
    .padStart(2, '0')}`,
  hexWithAlpha: `#${Math.round(c.r * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(c.g * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(c.b * 255)
    .toString(16)
    .padStart(2, '0')}${
    c.a
      ? Math.round(c.a * 255)
          .toString(16)
          .padStart(2, '0')
      : 'ff'
  }`,
})

const object = {
  traverse: (obj: unknown, path: string) =>
    path.split('.').reduce((acc, part) => (acc as Record<string, unknown>)?.[part], obj),
}

const rotation = ({ _x, _y, _z }: { _x: number; _y: number; _z: number }) => ({
  degrees: {
    x: (_x * 180) / Math.PI,
    y: (_y * 180) / Math.PI,
    z: (_z * 180) / Math.PI,
  },
  radians: { x: _x, y: _y, z: _z },
})

export { color, rotation, object }
