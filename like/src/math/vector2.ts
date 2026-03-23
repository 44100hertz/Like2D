import { mod as mmod } from "./index.js";

/** A pair of numbers `[x, y]`
 * representing for example:
 *  - position in 2D space
 *  - width and height
 *  - velocity
 * 
 * See {@link Vec2} for full library.
 * 
 * ## Examples
 * 
 * #### Constructing a Vector2
 * ```ts
 * const onionSize: Vector2 = [width, height];
 * ```
 * 
 * #### Deconstructing a Vector2
 * ```ts
 * const [width, height] = onionSize;
 * ```
 * 
 * #### Making math less repetitive.
 * ```ts
 * x += dx * speed;
 * y += dy * speed;
 * // becomes...
 * pos = Vec2.add(pos, Vec2.mul(delta, speed))
 * ```
 * 
 * #### Summing an array of Vector2
 * ```ts
 * const nums: Vector2[] = [[50, 100], [-5, -5], [0, 99]];
 * const sum = nums.reduce(Vec2.add);
 * ```
 * 
 * #### Using LIKE graphics API
 * ```ts
 * // Draw a circle in the center of the canvas.
 * const pos = Vec2.div(
 *   like.canvas.getSize(),
 *   2,
 * )
 * like.graphics.circle('fill', 'blue', pos, 20); 
 * ```
 * */
export type Vector2 = [number, number];

export const Vec2 = {
  add(a: Vector2, b: Vector2): Vector2 {
    return [a[0] + b[0], a[1] + b[1]];
  },

  sub(a: Vector2, b: Vector2): Vector2 {
    return [a[0] - b[0], a[1] - b[1]];
  },

  mul(v: Vector2, other: Vector2 | number): Vector2 {
    if (typeof other === 'number') {
      return [v[0] * other, v[1] * other];
    }
    return [v[0] * other[0], v[1] * other[1]];
  },

  div(v: Vector2, other: Vector2 | number): Vector2 {
    if (typeof other === 'number') {
      return [v[0] / other, v[1] / other];
    }
    return [v[0] / other[0], v[1] / other[1]];
  },

  mod(v: Vector2, other: Vector2 | number): Vector2 {
    if (typeof other === 'number') {
      return [mmod(v[0], other), mmod(v[1], other)]
    }
    return [mmod(v[0], other[0]), mmod(v[1], other[1])]
  },

  eq(v: Vector2, other: Vector2): boolean {
    return v[0] == other[0] && v[1] == other[1];
  },

  dot(a: Vector2, b: Vector2): number {
    return a[0] * b[0] + a[1] * b[1];
  },

  cross(a: Vector2, b: Vector2): number {
    return a[0] * b[1] - a[1] * b[0];
  },

  lengthSq(v: Vector2): number {
    return v[0] * v[0] + v[1] * v[1];
  },

  length(v: Vector2): number {
    return Math.sqrt(this.lengthSq(v));
  },

  normalize(v: Vector2): Vector2 {
    const len = this.length(v);
    if (len === 0) return [0, 0];
    return this.div(v, len);
  },

  distance(a: Vector2, b: Vector2): number {
    return this.length(this.sub(a, b));
  },

  lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  },

  toPolar(v: Vector2): { r: number, angle: number } {
    return {
      r: this.length(v),
      angle: this.angle(v),
    }
  },

  fromPolar(r: number, angle: number): Vector2 {
    return [ r * Math.cos(angle), r * Math.sin(angle) ]
  },

  angle(v: Vector2): number {
    return Math.atan2(v[1], v[0]);
  },

  rotate(v: Vector2, angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [v[0] * cos - v[1] * sin, v[0] * sin + v[1] * cos];
  },

  negate(v: Vector2): Vector2 {
    return [-v[0], -v[1]];
  },

  floor(v: Vector2): Vector2 {
    return [Math.floor(v[0]), Math.floor(v[1])];
  },

  ceil(v: Vector2): Vector2 {
    return [Math.ceil(v[0]), Math.ceil(v[1])];
  },

  round(v: Vector2): Vector2 {
    return [Math.round(v[0]), Math.round(v[1])];
  },

  min(a: Vector2, b: Vector2): Vector2 {
    return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
  },

  max(a: Vector2, b: Vector2): Vector2 {
    return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
  },

  clamp(v: Vector2, min: Vector2, max: Vector2): Vector2 {
    return [
      Math.max(min[0], Math.min(v[0], max[0])),
      Math.max(min[1], Math.min(v[1], max[1])),
    ];
  },

  fromAngle(angle: number, len: number = 1): Vector2 {
    return [Math.cos(angle) * len, Math.sin(angle) * len];
  },

  zero(): Vector2 {
    return [0, 0];
  },
};
