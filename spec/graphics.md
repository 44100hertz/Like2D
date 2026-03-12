# Graphics API

2D rendering API. All drawing functions are on `like.graphics`.

## Types

- `Color = [number, number, number, number?] | string` - RGBA array (0-1) or CSS color string
- `Vector2 = [number, number]` - See [vector2.md](./vector2.md)
- `Rect = [number, number, number, number]` - See [rect.md](./rect.md)
- `Canvas` - Offscreen render target handle

## Design Principles

- **Required args first**: Required values are positional arguments
- **Optional values in props**: Optional values in a trailing props object
- **Color first when required**: Color is the first argument for shape drawing; optional in props for images/text
- **Tuple types for positions**: Use `Vector2` for positions and `Rect` for rectangles instead of loose coordinates
- **Simplified functions**: Combined functions where semantics are similar

## Shape Drawing

- `rectangle(mode, color, rect, props?)` - Draw rectangle (fill or line)
- `circle(mode, color, position, radii, props?)` - Draw circle or ellipse
- `ellipse(mode, color, position, radii, rotation, props?)` - Draw rotated ellipse
- `line(color, points, props?)` - Draw polyline
- `polygon(mode, color, points, props?)` - Draw polygon
- `arc(mode, color, position, radii, angles, props?)` - Draw arc
- `points(color, points)` - Draw individual pixels

Props: `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`

Points are `Vector2[]`: `[[x1, y1], [x2, y2], ...]`
Radii: `number` for circle, `Vector2` for ellipse `[rx, ry]`
Angles: `[angle1, angle2]` tuple

## Image Drawing

- `draw(handle, position, props?)` - Draw image or sub-region
- `newImage(path)` - Load image, returns `ImageHandle`
- `newCanvas(size)` - Create offscreen render target
- `setCanvas(canvas?)` - Set render target (null for screen)

Props: `color` (tint), `quad`, `r` (rotation), `sx`, `sy`, `ox`, `oy`

ImageHandle: `path`, `isReady()`, `ready()`, `size` (Vector2)
Canvas: `size` (Vector2), internal canvas handle

## Text Rendering

- `print(color, text, position, props?)` - Draw text
- `setFont(size, font?)` - Set default font
- `getFont()` - Get current font string

Props: `font`, `limit` (wrap width), `align`

## Coordinate Transformations

- `push()` / `pop()` - Save/restore transform state
- `translate(delta)` - Translate by Vector2
- `rotate(angle)` - Rotate (radians)
- `scale(s)` - Scale (number or Vector2)

## Clipping

- `clip(rect?)` - Clip to rect, or reset if no rect

## State Management

- `clear()` - Clear canvas with background color
- `setBackgroundColor(color)` - Set background color
- `getCanvasSize()` - Canvas dimensions as Vector2
