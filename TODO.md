# Like2D TODO

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

### Canvas Size and Resolution Handling
Replace the current width/height init parameters with a runtime-configurable canvas sizing system.

**Design**:
```typescript
type CanvasConfig = 
  | { resize: 'fixed', size: Vector2, sharp: boolean }  // Fixed internal resolution
  | { resize: 'scaled', size: Vector2 }                  // Aspect preserved, pixel-for-pixel with scale transform
  | { resize: 'native' };                                // Full size, programmer handles everything
```

- `fixed`: Game renders at fixed internal resolution, canvas is scaled to fit container
- `scaled`: Canvas resolution matches container pixel-for-pixel, content is scaled via transform before drawing, aspect ratio preserved
- `native`: Canvas is always full sized pixel-for-pixel, no automatic handling

**Changes**:
- Remove width/height from init parameters
- Add `setCanvasConfig(config: CanvasConfig)` method to Engine/SceneRunner
- Remove `width`/`height` from Scene interface
- Scenes should call `setCanvasConfig()` in their `load()` method if they need specific sizing
- Default is `native` mode (backwards compatible behavior)

### Custom Startup Screen
The startup screen currently displays simple text. Future versions should support:
- Custom background images for the startup screen
- Custom styling/fonts
- Animation/transitions
