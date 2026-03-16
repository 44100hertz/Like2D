# Like2D TODO

## Bugs 🐛

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

Implementation complete. Canvas sizing system with three modes:
- **fixed**: Fixed internal resolution, CSS-scaled to fit container
- **scaled**: Canvas matches container, content scaled via ctx.transform
- **native**: Full control, programmer handles everything

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
