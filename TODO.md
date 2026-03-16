# Like2D TODO

## Active Work

### 1. Startup Screen as Scene (Scene Adapter)
Move the built-in startup screen from engine.ts into a reusable scene class in the scene adapter:
- Create `StartupScene` class that accepts:
  - `nextScene: Scene` - the scene to load after click
  - `draw?: (ctx: CanvasRenderingContext2D) => void` - optional custom draw function
- Update demo/src/main.ts to use this feature
- For callback adapter: add note "pause until click - future consideration"

### 4. Graphics Simplification ✅ COMPLETED
- Removed transform wrapper methods (`push`, `pop`, `translate`, `rotate`, `scale`, `resetTransform`) from Graphics class
- Added `graphics.getContext()` method for direct canvas API access
- Users should use `ctx.save()`, `ctx.restore()`, `ctx.setTransform()` directly
- `ctx.__baseTransform` hack was removed with scaled mode

### 6. Cut "scaled" Mode, Add Helper ✅ COMPLETED
- Removed "scaled" mode from CanvasConfig (keep only "fixed" and "native")
- Added helper function `calcFixedScale()` in `canvas-config.ts` for fixed-to-native rendering

### BUG: Browser Zoom with Pixel Art Mode
Browser zooming does not update the pixel canvas resolution. When the user zooms the browser (Ctrl +/-), the pixel art canvas needs to recalculate its internal resolution based on the new pixel ratio, but currently it only responds to container resize events, not zoom events.

### 7. Event System: Native Events Pilot
**Status:** Concept documented in `NATIVE_EVENTS.md`, ready for branch `pilot/native-events`  
**Goal:** Replace custom event emitter with native DOM CustomEvents + thin wrappers
**Decision:** Keep explicit callback pattern for adapters, use native events under the hood

### 8. Package.json Exports & Naming (Later)
Remove wildcard exports (`core/*`) from package.json:
- Keep only: `.`, `./callback`, `./scene`
- Root index.ts re-exports pure libraries (`Vec2`, `Rect`, etc.) - this is fine
- Users who want internals must type `like2d/core/...` explicitly
- "Core" in the path acts as the gate into internals

**Naming changes:**
- `V2` → `Vec2` (V2 sounds like "version 2")
- `R` → `Rect` (R conflicts with Ramda library convention)

---

## Completed ✅

### Pixel Art Canvas Stretching ✅ FIXED
The pixel art canvas was getting stretched due to component-wise min() clamping. Fixed by using proportional scale calculation in `canvas-manager.ts:109`.

### Mouse Position in Fixed Modes ✅ FIXED
Mouse coordinates were in CSS pixels instead of canvas resolution. Fixed by:
- Refactored Mouse class to track raw CSS coordinates with optional transform function
- Added `engine.transformMousePosition()` that handles all modes (fixed, scaled, native, pixel art)
- Added `canvas-manager.getDisplayCanvas()` for pixel art mode
- Fixed fullscreen mode to use `document.fullscreenElement.clientWidth/Height` instead of `window.screen`

### Scaled Mode Transform Reset ✅ FIXED
In scaled mode, calling `ctx.setTransform()` directly would lose the automatic scaling. Fixed by:
- Added `graphics.resetTransform()` that preserves scaled mode transform
- CanvasManager stores base transform in `ctx.__baseTransform`
- Added documentation warning against direct ctx manipulation

## Canvas Size System ✅

Implementation complete. Canvas sizing system with two modes:
- **fixed**: Fixed internal resolution, CSS-scaled to fit container
- **native**: Full control, programmer handles everything

Use `calcFixedScale()` helper to implement scaled rendering in native mode.

All modes preserve aspect ratio with letterboxing (no stretch/crop).

## Publishing Preparation
- [ ] Add JSR configuration (`jsr.json`)
- [ ] Set up GitHub Actions for publishing
- [ ] Configure GitHub Pages deployment for website
- [ ] Add LICENSE file to packages/like2d

## Future Ideas

### Multiplayer System Design
The current action system is designed for single-player use. We need a multiplayer input system that:
- Separates controller management from action mapping (already started by removing GP0/GP1 prefixes)
- Supports player assignment: local players bind to specific gamepads
- Handles controller disconnect/reconnect with graceful player reassignment
- Provides clean API for networked multiplayer (input prediction, reconciliation)
- Consider: Should we have a `PlayerManager` that maps physical controllers to logical player slots?

### Custom Startup Screen
The startup screen currently displays simple text. Future versions should support:
- Custom background images for the startup screen
- Custom styling/fonts
- Animation/transitions
