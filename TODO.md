# Like2D Implementation TODO

## Phase 1: Core Refactor - Scene System ✓

- [x] Redesign Like class to support Scene-based architecture
- [x] Implement Scene interface with width/height resolution setting
- [x] Create `like.setScene(scene)` for scene switching
- [x] Remove old callback-based system
- [x] Update entry point to instantiate and run scenes
- [x] Ensure canvas resizes when switching to scene with different resolution

## Phase 2: Asset Loading Refactor ✓

- [x] Convert to fire-and-forget loading model
- [x] Create `ImageHandle` class with `isReady()` and `ready()` methods
- [x] Modify `newImage()` to return `ImageHandle` synchronously
- [x] Cache `ImageHandle` instances by path
- [x] Update `draw()`/`drawq()` to skip silently if not ready
- [x] Make `newSource()` synchronous (no await)
- [x] Update `play()` to return false silently if not loaded
- [x] Remove `preload` from Scene interface
- [x] Remove preload call from `Like.start()`
- [x] Update demo to use new loading pattern
- [x] Update SPEC.md documentation
- [x] Export `ImageHandle` type from index.ts

## Phase 3: Input Mapping System ✓

Use scancodes for actions, but pass both keycodes and scancodes into callbacks.

- [x] Create `like.input` module
- [x] Implement `like.input.map(action, inputs[])`
- [x] Implement `like.input.isDown(action)` - checks if any mapped input is held
- [x] Implement `like.input.justPressed(action)` - true on first frame of press
- [x] Implement `like.input.justReleased(action)` - true on first frame of release
- [x] Support keyboard keys in mapping (scancodes)
- [x] Support mouse buttons in mapping
- [ ] Support gamepad buttons, axes, and D-pad in mapping
- [x] Maintain low-level `like.keyboard`, `like.mouse` access
- [x] Update demo to use input mapping system

## Phase 4: Modernize Existing Modules

- [ ] Refactor Graphics module to use 0-1 color range consistently
- [ ] Update Audio module API for consistency
- [ ] Ensure Timer module works with Scene lifecycle
- [ ] Rename `localstorage.ts` to `storage.ts` with cleaner API
- [ ] Update all module imports/exports

## Future Considerations (Post-Game Object Model)

- Camera system
- Tweening/animation
- Entity systems
- Particle systems
- Collision detection
