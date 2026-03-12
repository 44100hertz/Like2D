# Graphics API

2D rendering API available via `like.graphics`.

## Core Design Principles

### 1. Type Safety with Tuple Types
All geometric data uses tuple types rather than loose coordinates:
- `Vector2 = [number, number]` for positions, directions, and 2D values
- `Rect = [number, number, number, number]` for rectangles `[x, y, w, h]`
- These types are lightweight arrays that work well with destructuring

### 2. Consistent Parameter Ordering
- **Required arguments** come first as positional parameters
- **Optional arguments** are grouped in a trailing `props` object
- **Color** is the first argument for shape drawing when required

### 3. Unified Scale and Origin
Drawing operations use unified parameters:
- `scale: number | Vector2` - Single number for uniform scale, tuple for non-uniform
- `origin: number | Vector2` - Single number for both axes, tuple for separate values

### 4. State Isolation
Each drawing operation resets relevant canvas state before executing:
- Stroke properties (`lineWidth`, `lineCap`, `lineJoin`, `miterLimit`) are always set to defaults first
- No state leakage between drawing calls

### 5. Handle-Based Resources
Images and canvases use handle objects:
- `ImageHandle` - Reference to loaded image with `size` property
- `Canvas` - Offscreen render target with `size` property

## Color Representation

`Color = [number, number, number, number?] | string`

- RGBA array with values 0-1: `[r, g, b, a]`
- Alpha defaults to 1 if omitted
- CSS color strings also accepted: `"red"`, `"#ff0000"`, `"rgb(255,0,0)"`

## Drawing Modes

Shape drawing uses explicit modes:
- `"fill"` - Filled shape
- `"line"` - Outlined shape

## Coordinate System

- Origin (0, 0) at top-left
- X increases right
- Y increases down
- Angles in radians, 0 is right, positive is clockwise

## API Categories

### Shapes
Rectangle, circle/ellipse, line, polygon, arc, points - using `Vector2` and `Rect` types throughout.

### Images
Drawing with rotation, scaling, origin offset, and optional sub-region (quad).

### Text
Single function for text rendering with optional wrapping and alignment.

### Transformations
Stack-based coordinate transformations: push/pop, translate, rotate, scale.

### State
Background color, canvas sizing, clipping, and render target management.

## See Also

- [vector2.md](./vector2.md) - Vector2 type and V2 namespace
- [rect.md](./rect.md) - Rect type and R namespace
