# Like2D TODO

## Publishing Preparation
- [ ] Add JSR configuration (`jsr.json`)
- [ ] Set up GitHub Actions for publishing
- [ ] Configure GitHub Pages deployment for website
- [ ] Add LICENSE file to packages/like2d

## Scene Adapter State Management

### Centralize Event Listeners
**Task**: Move global `window.addEventListener()` calls from Keyboard, Mouse, and Engine into a centralized system.
- Investigate approach: Should Engine own all DOM events and dispatch to Keyboard/Mouse (simple state containers), or keep current structure with centralized setup/teardown?
- **Goal**: Single point of cleanup, no scattered global side effects

### Add Dispose/Cleanup Pattern
**Task**: Implement proper lifecycle cleanup for SceneRunner and Engine.
- Add `Engine.dispose()`: Remove all window event listeners, stop loop
- Add `SceneRunner.dispose()`: Stop engine, cleanup references
- Add dispose support to callback adapter (`like.dispose()`)
- **Goal**: Enable tests to clean up, prevent memory leaks in SPAs

### Initialize Context References at Construction
**Task**: Make Graphics.ctx and Mouse.canvas non-nullable by initializing in constructor.
- Pass context/canvas as constructor parameters instead of using setX() methods post-construction
- **Goal**: Eliminate null checks, clearer ownership

### Gamepad Listener Cleanup
**Task**: Apply the same centralized listener approach to Gamepad module.
- Ensure Gamepad global listeners are included in centralized cleanup
- **Goal**: Consistent cleanup across all input modules

## Future Ideas

### Multiplayer System Design
The current action system is designed for single-player use. We need a multiplayer input system that:
- Separates controller management from action mapping (already started by removing GP0/GP1 prefixes)
- Supports player assignment: local players bind to specific gamepads
- Handles controller disconnect/reconnect with graceful player reassignment
- Provides clean API for networked multiplayer (input prediction, reconciliation)
- Consider: Should we have a `PlayerManager` that maps physical controllers to logical player slots?

### Canvas Resolution Handling
Current implementation passes width/height to `like.init()`. We should handle canvas resolution setting/updating in a more Love2D-like manner (similar to `love.window.setMode()`). This is deferred to a future version.

### Custom Startup Screen
The startup screen currently displays simple text. Future versions should support:
- Custom background images for the startup screen
- Custom styling/fonts
- Animation/transitions
