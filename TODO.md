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
- [x] `rectangle(mode, color, rect, props?)` - takes Rect instead of x,y,w,h
- [x] `circle(mode, color, position, radii, props?)` - takes Vector2 position, radii as number or Vector2, and add optional `angle` to props for rotated ellipse. Add optional `arc` to props, which takes [angle1, angle2].
- [x] `line(color, points, props?)` - points as Vector2[]
- [x] `polygon(mode, color, points, props?)` - points as Vector2[]
- [x] `points(color, points)` - points as Vector2[]

Shape drawing props: add `lineCap`, `lineJoin`, `miterLimit`

Keep optional color in props for:
- [x] `draw(handle, position, props?)` - color optional (tinting), takes Vector2 position

Require color as first argument, use Vector2:
- [x] `print(color, text, position, props?)` - color required (no default), takes Vector2 position

Update transformation functions:
- [x] `translate(delta)` - takes Vector2 instead of x, y
- [x] `scale(s)` - takes number or Vector2 instead of x, y?

Replace canvas dimension functions:
- [x] Remove `getWidth()` / `getHeight()`
- [x] Add `getCanvasSize()` returning Vector2

Update ImageHandle:
- [x] Replace `width`, `height` with `size` returning Vector2

Add canvas/render target support:
- [x] `newCanvas(size)` - Create offscreen render target, takes Vector2
- [x] `setCanvas(canvas?)` - Set render target (null for screen)
- [x] `Canvas` type with `size` property

Add clipping:
- [x] `clip(rect?)` - Clip to rect, or reset if no rect

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

### 8. Graphics State Cleanup
**File:** `src/like/graphics.ts`

- [x] Fix optional properties that could affect state - ensure browser doesn't "remember" last shape's properties, library should remove excess state from drawing
- [x] Remove `width` and `height` props from image type; `size` is all that's required
- [x] Use spread operator more often to make code more concise

### 9. Update main.ts Examples
**File:** `src/main.ts`

- [x] Use `Vector2` and `Rect` helper functions to demonstrate the library

### 10. Flatten Vector2 and Rect Exports
**File:** `src/like/index.ts`

- [x] Export all Vector2 constants and functions in a flat namespace (e.g., `V2.zero`, `V2.up`, `V2.down`, `V2.left`, `V2.right` instead of separate `zero`, `up`, etc. exports)
- [x] Export all Rect constants and functions in a flat namespace (e.g., `R.empty` if applicable)
- [x] Update main.ts to use the flat namespace (e.g., `V2.zero` instead of importing `zero` separately)

### 11. Simplify Graphics draw() API
**File:** `src/like/graphics.ts`

- [x] Remove string-based image handles from `like.graphics.draw()` - only accept `ImageHandle` objects
- [x] Replace separate `sx` and `sy` parameters with a single `scale` parameter that accepts `number | Vector2`
- [x] Replace separate `ox` and `oy` parameters with a single `origin` parameter that accepts `number | Vector2`
- [x] Update main.ts to use the new API (e.g., `scale: 0.5` or `scale: [0.5, 0.5]`, `origin: [imgWidth/2, imgHeight/2]`)

---

# Unified Events Implementation

## Overview
Replace multiple input event callbacks with a single `handleEvent` method using a tagged union type.

## TODO

### 1. Create Event type
**File:** `src/like/events.ts`
**Spec:** `spec/unified-events.md`

- [x] Export `Event` discriminated union type with all input events:
  - [x] `keypressed` - `{ type: 'keypressed'; scancode: string; keycode: string }`
  - [x] `keyreleased` - `{ type: 'keyreleased'; scancode: string; keycode: string }`
  - [x] `mousepressed` - `{ type: 'mousepressed'; x: number; y: number; button: number }`
  - [x] `mousereleased` - `{ type: 'mousereleased'; x: number; y: number; button: number }`
  - [x] `actionpressed` - `{ type: 'actionpressed'; action: string }`
  - [x] `actionreleased` - `{ type: 'actionreleased'; action: string }`
  - [x] `gamepadpressed` - `{ type: 'gamepadpressed'; gamepadIndex: number; buttonIndex: number; buttonName: string }`
  - [x] `gamepadreleased` - `{ type: 'gamepadreleased'; gamepadIndex: number; buttonIndex: number; buttonName: string }`

### 2. Update Scene interface
**File:** `src/like/scene.ts`
**Spec:** `spec/unified-events.md`

- [x] Remove old callback methods: `keypressed`, `keyreleased`, `mousepressed`, `mousereleased`, `actionpressed`, `actionreleased`, `gamepadpressed`, `gamepadreleased`
- [x] Add optional `handleEvent?: (event: Event) => void` method
- [x] Keep `load`, `update`, `draw` as separate methods (not part of unified events)

### 3. Update main loop to dispatch events
**File:** `src/like/index.ts`
**Spec:** `spec/unified-events.md`

- [x] Import `Event` type from events module
- [x] Replace individual callback invocations with `handleEvent` calls:
  - [x] Keyboard events → `handleEvent({ type: 'keypressed'/'keyreleased', ... })`
  - [x] Mouse events → `handleEvent({ type: 'mousepressed'/'mousereleased', ... })`
  - [x] Action events → `handleEvent({ type: 'actionpressed'/'actionreleased', ... })`
  - [x] Gamepad events → `handleEvent({ type: 'gamepadpressed'/'gamepadreleased', ... })`
- [x] Check if `handleEvent` exists before calling (it's optional)

### 4. Export Event type
**File:** `src/like/index.ts`

- [x] Re-export `Event` type from events module
- [x] Re-export `Event` type from scene module (if needed for circular imports)

### 5. Update main.ts examples
**File:** `src/main.ts`
**Spec:** `spec/unified-events.md`

- [x] Replace individual callback methods with `handleEvent` method
- [x] Use switch statement on `event.type` to handle different input types
- [x] Show example of event forwarding to demonstrate composability
