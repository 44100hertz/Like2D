import { bench, describe } from 'vitest';
import { Rect, type Rectangle } from '../math/rect';

const AABB_COUNT = 1000;

function makeRects(count: number): Rectangle[] {
  const rects: Rectangle[] = [];
  for (let i = 0; i < count; i++) {
    rects.push([
      Math.random() * 1920,
      Math.random() * 1080,
      Math.random() * 100 + 1,
      Math.random() * 100 + 1,
    ]);
  }
  return rects;
}

describe('AABB Collision', () => {
  const rects = makeRects(AABB_COUNT);
  const OPS = AABB_COUNT * AABB_COUNT;

  describe('many-to-many', () => {
    bench(`raw O(N^2) intersection check (${OPS} checks)`, () => {
      let collisions = 0;
      for (let i = 0; i < rects.length; i++) {
        for (let j = 0; j < rects.length; j++) {
          if (Rect.intersects(rects[i], rects[j])) {
            collisions++;
          }
        }
      }
      if (collisions === AABB_COUNT**2) console.log(collisions);
    });
  });
});
