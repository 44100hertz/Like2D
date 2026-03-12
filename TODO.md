# Geometric Data Types Implementation

## Overview
Implement Vector2 and Rect tuple types with pure function libraries.

## TODO

### 1. Create Vector2 type and V2 module
**File:** `src/like/vector2.ts`
**Spec:** `spec/vector2.md`

- [x] Export `Vector2` type alias: `type Vector2 = [number, number]`
- [x] Export `V2` namespace with operations:
  - [x] `add(a, b)`, `sub(a, b)`, `mul(v, s)`, `div(v, s)`
  - [x] `dot(a, b)`, `cross(a, b)`
  - [x] `length(v)`, `lengthSq(v)`, `normalize(v)`
  - [x] `distance(a, b)`, `lerp(a, b, t)`
  - [x] `angle(v)`, `rotate(v, angle)`, `perpendicular(v)`
  - [x] `negate(v)`, `floor(v)`, `ceil(v)`, `round(v)`
  - [x] `min(a, b)`, `max(a, b)`, `clamp(v, min, max)`
  - [x] `fromAngle(angle, length?)`
- [x] Export constants: `zero`, `one`, `up`, `down`, `left`, `right`

### 2. Create Rect type and R module
**File:** `src/like/rect.ts`
**Spec:** `spec/rect.md`

- [x] Export `Rect` type alias: `type Rect = [number, number, number, number]`
- [x] Export `R` namespace with operations:
  - [x] `create(x, y, w, h)`, `fromPoints(a, b)`, `fromCenter(center, size)`
  - [x] `position(r)`, `size(r)`, `center(r)`
  - [x] `topLeft(r)`, `topRight(r)`, `bottomLeft(r)`, `bottomRight(r)`
  - [x] `area(r)`, `isEmpty(r)`
  - [x] `containsPoint(r, point)`, `containsRect(r, other)`, `intersects(r, other)`
  - [x] `intersection(r, other)`, `union(r, other)`
  - [x] `inflate(r, amount)`, `offset(r, delta)`
  - [x] `setPosition(r, pos)`, `setSize(r, size)`, `setCenter(r, center)`

### 3. Update Graphics module
**File:** `src/like/graphics.ts`
**Spec:** `spec/graphics.md`

- [x] Import and re-export `Vector2` and `Rect` types
- [x] Update `Quad` type to be alias of `Rect`
- [x] No API changes needed - internal only

### 4. Update Graphics API - Color as first argument, Vector2/Rect for positions
**File:** `src/like/graphics.ts`
**Spec:** `spec/graphics.md`

Update all shape drawing functions to require color as the first argument and use Vector2/Rect:
- [ ] `rectangle(mode, color, rect, props?)` - takes Rect instead of x,y,w,h
- [ ] `circle(mode, color, position, radii, props?)` - takes Vector2 position, radii as number or Vector2, and add optional `angle` to props for rotated ellipse. Add optional `arc` to props, which takes [angle1, angle2].
- [ ] `line(color, points, props?)` - points as Vector2[]
- [ ] `polygon(mode, color, points, props?)` - points as Vector2[]
- [ ] `points(color, points)` - points as Vector2[]

Shape drawing props: add `lineCap`, `lineJoin`, `miterLimit`

Keep optional color in props for:
- [ ] `draw(handle, position, props?)` - color optional (tinting), takes Vector2 position

Require color as first argument, use Vector2:
- [ ] `print(color, text, position, props?)` - color required (no default), takes Vector2 position

Update transformation functions:
- [ ] `translate(delta)` - takes Vector2 instead of x, y
- [ ] `scale(s)` - takes number or Vector2 instead of x, y?

Replace canvas dimension functions:
- [ ] Remove `getWidth()` / `getHeight()`
- [ ] Add `getCanvasSize()` returning Vector2

Update ImageHandle:
- [ ] Replace `width`, `height` with `size` returning Vector2

Add canvas/render target support:
- [ ] `newCanvas(size)` - Create offscreen render target, takes Vector2
- [ ] `setCanvas(canvas?)` - Set render target (null for screen)
- [ ] `Canvas` type with `size` property

Add clipping:
- [ ] `clip(rect?)` - Clip to rect, or reset if no rect

### 5. Update Mouse module  
**File:** `src/like/mouse.ts`
**Spec:** (none - internal change)

- [x] Import `Vector2` type
- [x] Change `getPosition()` return type from `{ x, y }` to `Vector2`

### 6. Export from index
**File:** `src/like/index.ts`

- [x] Export `Vector2` and `V2` from vector2 module
- [x] Export `Rect` and `R` from rect module

### 7. Update PHASES.md
**File:** `PHASES.md`

- [x] Move "Consideration: Geometric Data Types" to DONE section
