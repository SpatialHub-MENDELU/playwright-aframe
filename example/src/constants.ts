import { generateRandomNumber } from './utils'

type WasteCategory = 'paper' | 'plastic' | 'glass' | 'general'
type Coordinates = { x: number; y: number; z: number }
type Orientation = { x: number; y: number; z: number }
type TrashObject = {
  name: string
  size: string
  position: Coordinates
  rotation: Orientation
  correctWasteCategory: WasteCategory
}
type WasteBinConfig = {
  position: Coordinates
  stepDistance: number
  dimensions: string
  supportedCategories: WasteCategory[]
  rotation: string
}
type WasteBinLabelConfig = {
  position: Coordinates
  stepDistance: number
  dimensions: string
  supportedCategories: WasteCategory[]
}

export const wasteBinConfiguration: WasteBinConfig = {
  position: { x: -7, y: 0.15, z: 4 },
  stepDistance: 3,
  dimensions: '4 4 4',
  supportedCategories: ['paper', 'plastic', 'glass', 'general'],
  rotation: '0 160 0',
}
export const wasteBinLabelConfiguration: WasteBinLabelConfig = {
  position: { x: -2.88, y: 0.2, z: 2.07 },
  stepDistance: 3,
  dimensions: '4 4 4',
  supportedCategories: ['paper', 'plastic', 'glass', 'general'],
}

export const trashItems: TrashObject[] = [
  {
    name: 'banana',
    size: '0.008 0.008 0.008',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0, z: generateRandomNumber(3, 5) },
    rotation: { x: 0, y: generateRandomNumber(0, 180), z: 90 },
    correctWasteCategory: 'general',
  },
  {
    name: 'can',
    size: '2 2 2',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0.1, z: generateRandomNumber(4, 5) },
    rotation: { x: 0, y: generateRandomNumber(-45, 90), z: 0 },
    correctWasteCategory: 'plastic',
  },
  {
    name: 'pet',
    size: '0.08 0.08 0.08',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0.35, z: generateRandomNumber(2.5, 4) },
    rotation: { x: 0, y: generateRandomNumber(0, 180), z: 0 },
    correctWasteCategory: 'plastic',
  },
  {
    name: 'paper',
    size: '0.007 0.007 0.007',
    position: { x: generateRandomNumber(-5, 5), y: 0, z: generateRandomNumber(2.5, 5) },
    rotation: { x: 0, y: generateRandomNumber(0, 180), z: 0 },
    correctWasteCategory: 'paper',
  },
  {
    name: 'bottle',
    size: '0.5 0.5 0.5',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0, z: generateRandomNumber(3.5, 5) },
    rotation: { x: 0, y: generateRandomNumber(-45, 90), z: 0 },
    correctWasteCategory: 'glass',
  },
  {
    name: 'box',
    size: '2 2 2',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0, z: generateRandomNumber(2.5, 3) },
    rotation: { x: 0, y: generateRandomNumber(0, 180), z: 0 },
    correctWasteCategory: 'paper',
  },
  {
    name: 'trash',
    size: '2 2 2',
    position: { x: generateRandomNumber(-5.5, 5.5), y: 0.35, z: generateRandomNumber(2.5, 3) },
    rotation: { x: 0, y: generateRandomNumber(0, 180), z: generateRandomNumber(-45, 45) },
    correctWasteCategory: 'general',
  },
]
