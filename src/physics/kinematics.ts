/**
 * Calculates displacement for uniform motion
 * x = v * t
 */
export function uniformDisplacement(v: number, t: number): number {
  return v * t;
}

/**
 * Calculates velocity for uniform acceleration
 * v = v0 + a * t
 */
export function velocityTime(v0: number, a: number, t: number): number {
  return v0 + a * t;
}

/**
 * Calculates displacement for uniform acceleration
 * x = v0 * t + 0.5 * a * t^2
 */
export function displacementTime(v0: number, a: number, t: number): number {
  return v0 * t + 0.5 * a * t * t;
}
