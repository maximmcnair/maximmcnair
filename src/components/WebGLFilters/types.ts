// TODO this should be the same format!!!!
export type Vec3 = { x: number; y: number; z: number };
export type Vec4 = [number, number, number, number];

export interface Position {
  x: number;
  y: number;
}


export interface Config {
  // View
  FOVAngle: number;
  FOVRadius: number;
  'photo-x-top': number;
  'photo-x-bottom': number;
  'photo-y-left': number;
  'photo-y-right': number;
  model: Vec3;
  camera: Vec3;
  zoom: number;
  // filters
  Brightness: number;
  Contrast: number;
  Exposure: number;
  Saturation: number;
  Hue: number;
  // effects
  Grain: number;
  Pixelate: number;
  Vignette: number;
  Duotone: number;
  Blur: number;
  // duotone
  DuotoneHigh: Vec4;
  DuotoneLow: Vec4;
}
