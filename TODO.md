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
- [x] Maintain low-level `like.keyboard`, `like.mouse` access
- [x] Update demo to use input mapping system
- [x] Use SDL's game controller DB to unify controller mappings
- [x] Make sure that gamepad.ts is using our unified input mapping library in input-state.ts.
- [x] Fix bugs with the game controller DB GUID (below)
- [x] Circumvent the GUID limitation somehow (below)

- **GUID Limitation**: The last 8 bytes of the GUID are always zeros because browsers only expose vendor and product IDs (16-bit each), not the full 16 bytes of data that SDL typically includes (version, driver info, etc.). This may cause incorrect mappings if two controllers have the same vendor/product but different capabilities.
  - **Solution**: Match controllers by vendor/product ID only, ignoring the rest of the GUID. The `vendorProductIndex` in gamepad-db.ts allows lookups by just these 4 bytes.

Common mistakes:
 - GUIDs do NOT all end in all zeroes. The first few ones end in zeros, but later on in the db file that's not the case.
 - Name matching is NOT reliable and WILL NOT be used.

Plan:
 - We will match entirely based on vendor and product ID alone.
 - In some edge cases, this may cause problems. We will gather that data from our users in the long run.

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
