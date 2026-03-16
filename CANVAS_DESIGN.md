# Canvas Size Design

## Philosophy
Like2D is a minimal framework. Canvas sizing should be simple and predictable.

## Three Modes

### `fixed` (default)
Game has fixed internal resolution. Canvas is CSS-scaled to fit container with letterboxing.

```typescript
{ mode: 'fixed', width: 320, height: 240, pixelArt: true }
```

Use case: Pixel art games, retro games. Game always uses 320x240 coordinates.

**Pixel Art Scaling**: When `pixelArt: true`, canvas is scaled in two steps:
1. Sharp (nearest-neighbor) scaling to the largest integer multiple that fits
2. Linear scaling from there to the final container size

This keeps pixels crisp while allowing smooth fractional scaling for the remainder.

### `scaled`
Canvas pixel resolution matches container. Content is scaled via ctx.transform before drawing.

```typescript
{ mode: 'scaled', width: 1920, height: 1080 }
```

Use case: High-res games. Game uses 1920x1080 coordinates, rendered sharply at any size.

### `native`
Canvas matches container size exactly. Programmer handles everything.

```typescript
{ mode: 'native' }
```

Use case: Responsive layouts, custom scaling logic.

## API

```typescript
type CanvasConfig = 
  | { mode: 'fixed'; width: number; height: number; pixelArt?: boolean }
  | { mode: 'scaled'; width: number; height: number }
  | { mode: 'native' };

// Set in scene load (NOT in constructor - removed from SceneRunner)
const scene: Scene = {
  load() {
    runner.setCanvasConfig({ mode: 'fixed', width: 320, height: 240, pixelArt: true });
  }
};

// Change at runtime
runner.setCanvasConfig({ mode: 'scaled', width: 1920, height: 1080 });
```

## Behavior

All modes preserve aspect ratio with letterboxing. Never stretch. Never crop.

**Fixed mode:**
- Canvas width/height = game resolution
- CSS scales canvas to fit container
- CSS centers with black bars (letterbox)

**Scaled mode:**
- Canvas width/height = container size × pixelRatio
- ctx.setTransform() scales game coordinates to canvas pixels
- Draws centered with black bars

**Native mode:**
- Canvas width/height = container size × pixelRatio
- No automatic scaling
- Programmer calls ctx.scale() if needed

## Implementation

Engine owns CanvasManager:
- Manages canvas element creation
- Applies CSS sizing for fixed mode
- Applies transform for scaled mode
- Handles ResizeObserver for responsive updates

Graphics draws without knowing the mode:
- Fixed: draws at game res, browser scales
- Scaled: Engine applies transform, Graphics draws normally
- Native: Graphics sees actual canvas size

## Mouse Coordinates

Mouse events converted from screen pixels to game coordinates:
```typescript
// Fixed: simple scale
const gameX = screenX * (gameWidth / canvasWidth);

// Scaled: account for transform
const gameX = (screenX - offsetX) / scale;
```

## Breaking Changes

- Remove `width`/`height` from Scene interface
- **Remove width/height/config parameters from SceneRunner constructor** - canvas config is now set per-scene in `load()`
- Old API: `new SceneRunner(container, 800, 600)` → New: `new SceneRunner(container)` then `setCanvasConfig()` in scene `load()`
