# Like2D TODO

## Canvas Size System (In Progress)

Implementation of the canvas sizing system per CANVAS_DESIGN.md.

### Implementation Tasks
- [ ] Create `CanvasConfig` type with three modes: `fixed`, `scaled`, `native`
- [ ] Create `CanvasManager` class in `packages/like2d/src/core/canvas-manager.ts`
- [ ] Implement `fixed` mode with CSS scaling and letterboxing
- [ ] Implement `pixelArt` two-step scaling (sharp integer scale, then linear)
- [ ] Implement `scaled` mode with ctx.setTransform()
- [ ] Implement `native` mode (no automatic scaling)
- [ ] Add `setCanvasConfig()` to Engine class
- [ ] Add `setCanvasConfig()` to SceneRunner class  
- [ ] Remove width/height from Scene interface
- [ ] Remove width/height/config parameters from SceneRunner constructor
- [ ] Update mouse coordinate conversion for all modes
- [ ] Update demos to use new API (set config in load())
- [ ] Add ResizeObserver for responsive updates

### Breaking Changes Required
- SceneRunner constructor: `new SceneRunner(container)` only (no width/height)
- Scene interface: remove `width` and `height` properties
- Scenes must call `runner.setCanvasConfig()` in `load()`

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
