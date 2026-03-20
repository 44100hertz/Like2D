# TSDoc Documentation Tasks

## Overview

## Completed: Priority 1 - Public API Surface

### Core Entry Points
- [x] **index.ts** - Cozy introduction, links to EventMap for callbacks
- [x] **core/like.ts** - Subsystem overview, toned down philosophy
- [x] **engine.ts** - Architecture docs, links to EventMap
- [x] **scene.ts** - Scene pattern, links to EventMap
- [x] **scenes/startup.ts** - Autoplay workaround guide

### Consolidated Callback Documentation
- [x] **core/events.ts** - **Single source of truth** for all callbacks
  - Complete EventMap documentation with descriptions
  - Usage examples (scenes, global callbacks, handleEvent)
  - Event flow documentation
  - Reference table of all 16 events

## Priority 2: Core Systems (High Impact)

### core/graphics.ts
- [ ] Add `@module` tag with graphics system overview
- [ ] Document all exported types: `Color`, `Quad`, `Canvas`, `ShapeProps`, `DrawProps`, `PrintProps`
- [ ] Document `ImageHandle` class comprehensively
- [ ] Add `@param` and `@returns` for all graphics functions
- [ ] Add `@example` for common patterns (drawing images, shapes, text)
- [ ] Document `BoundGraphics` type

### core/input.ts
- [ ] Add `@module` tag with input mapping overview
- [ ] Document `InputType` and `InputBinding`
- [ ] Document `Input` class with `@description`
- [ ] Add `@param` and `@returns` for all methods
- [ ] Add `@example` for mapping actions
- [ ] Document supported input string formats

### core/canvas-manager.ts
- [ ] Add `@module` tag
- [ ] Document `CanvasManager` class
- [ ] Add `@param` for constructor
- [ ] Document pixel mode vs native mode in `@remarks`

### core/canvas-config.ts
- [ ] Add `@module` tag
- [x] `calcFixedScale()` already documented - verify only

## Priority 3: Input Handling (Medium Impact)

### core/keyboard.ts
- [ ] Add `@module` tag
- [ ] Document `Keyboard` class
- [ ] Document `isDown()`, `isAnyDown()`, `dispose()`
- [ ] Add `@remarks` about scroll key prevention

### core/mouse.ts
- [x] Class has good documentation - add `@module` tag
- [ ] Document type exports: `MousePositionTransform`, `MouseMoveHandler`, `MouseButtonHandler`
- [ ] Add missing `@param`/`@returns` where needed

### core/gamepad.ts
- [x] Some methods documented - complete the rest
- [ ] Add `@module` tag
- [ ] Document `StickPosition` interface
- [ ] Document `ButtonCallback` type
- [ ] Add `@param`/`@returns` for undocumented methods
- [ ] Add `@example` for gamepad usage

### core/gamepad-mapping.ts
- [ ] Add `@module` tag
- [ ] Document `ButtonMapping` interface fully
- [ ] Document `GamepadMapping` class
- [ ] Add implementation notes in `@remarks`

### core/gamepad-buttons.ts
- [ ] Add `@module` tag
- [ ] Convert inline comments to TSDoc
- [ ] Document `GP_NAMES`, `GP_NAME_MAP`
- [ ] Add `@example` for button checking

### core/input-state.ts
- [ ] Add `@module` tag
- [ ] Document `InputStateTracker` class
- [ ] Add `@typeparam` for generic T
- [ ] Document all methods

## Priority 4: Utilities (Low Impact)

### core/timer.ts
- [ ] Add `@module` tag
- [ ] Document `Timer` class
- [ ] Document all methods with `@param`/`@returns`

### core/vector2.ts
- [ ] Add `@module` tag
- [ ] Document `Vector2` type
- [ ] Document `Vec2` namespace
- [ ] Add `@example` for common operations

### core/rect.ts
- [ ] Add `@module` tag
- [ ] Document `Rect` type
- [ ] Document `Rect` namespace
- [ ] Add `@example` for rect operations

### core/audio.ts
- [x] Already well documented - verify completeness only

## Documentation Patterns

### Callback References
All callback documentation lives in {@link EventMap}. Other files link to it:

```typescript
 * @see {@link EventMap} for all available callbacks
```

### Tone Guidelines
- Cozy and elegant, not philosophical
- Practical examples over theory
- "See X for details" patterns to avoid duplication

## Cross-Cutting Concerns

- [ ] Ensure consistent use of `@public`/`@internal` tags
- [ ] Add `@since 2.8.1` to new APIs (if any)
- [ ] Standardize example code formatting
- [ ] Verify all public exports are documented

## Files Already Complete

1. `core/like.ts` - Subsystem overview
2. `core/audio.ts` - Module and class documentation
3. `core/events.ts` - **Source of truth for all callbacks**
4. `scenes/startup.ts` - Autoplay workaround
5. `index.ts` - Cozy entry point
6. `engine.ts` - Architecture docs
7. `scene.ts` - Scene pattern with EventMap links
