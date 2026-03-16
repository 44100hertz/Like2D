# Like2D TODO

## V2 Release! ✅ COMPLETED

Execution order: naming cleanup → bug fix → unified event dispatch → tests → docs → publishing infra → version bump + tag.

### 1. API Naming Cleanup ✅
- [x] `V2` → `Vec2` (V2 sounds like "version 2") — `vector2.ts`, `index.ts`, both adapters, both demos
- [x] `R` → `Rect` (R conflicts with Ramda convention) — `rect.ts`, `index.ts`, both adapters, both demos
- [x] Remove wildcard `"./core/*"` export from package.json — keep only `.`, `./callback`, `./scene`
- [x] Root index.ts re-exports pure libraries (`Vec2`, `Rect`, etc.) — users who want internals type `like2d/core/...` explicitly

### 2. Fix Browser Zoom Bug with Pixel Art ✅
- [x] `CanvasManager` only recalculates resolution on container resize, not on browser zoom
- [x] Add `window` resize listener + check for `devicePixelRatio` changes
- [x] Recalculate pixel art canvas internal resolution when ratio changes

### 3. Automated Tests ✅
- [x] Add Vitest (zero config, ESM-native, TypeScript)
- [x] Unit tests for `Timer`: sleep, time tracking, FPS calc
- [x] Unit tests for `Vector2`: all ops
- [x] Unit tests for `Rect`: create, contains, intersect
- [x] Unit tests for `InputState`: action mapping
- [x] No canvas/DOM tests — those are covered by the demo

### 4. README & Docs ✅
- [x] Complete `packages/like2d/README.md` (currently has TODO placeholder)
- [x] Structure: what it is, install, quick start (both patterns), API overview, link to PHILOSOPHY.md
- [x] Add inline JSDoc to public API types in `index.ts` exports

### 5. Publishing Infrastructure ✅
- [x] Add `LICENSE` file (MIT) to `packages/like2d/`
- [x] Add `jsr.json` config for JSR publishing
- [x] Add GitHub Actions workflow: typecheck → build → publish on tag
- [x] Update `package.json` version to `2.0.0`

### 6. Unified Event Dispatch API ✅
- [x] Engine: add `onEvent` callback to `start()`, dispatch all events through it (lifecycle + input + actions)
- [x] Engine: remove `onKey()`, `onMouse()`, `onGamepad()` — engine owns input listening
- [x] Engine: remove separate `update`/`draw` callbacks from `start()`
- [x] Events: define unified `Like2DEvent` discriminated union with `{ type, args, timestamp }`
- [x] Callback adapter: implement `like[type]?.(...args)` dispatch + `handleEvent` pre-processing
- [x] Scene adapter: implement same dispatch over scene object + `handleEvent` first
- [x] Update both demos to new API

### 7. Release ✅
- [x] Tag `v2.0.0`
- [x] Publish to JSR

---

## After V2

### Publishing Preparation
- [ ] Configure GitHub Pages deployment for website

### Website work

Discuss what a homepage should look like. It should contain:
 - Introduction
 - Docs
 - Code Sandbox with interactive tutorial?

The logo is planned to be a spade in a circle, similar to LOVE2D.

## Future Ideas

### Multiplayer System Design
The current action system is designed for single-player use. We need a multiplayer input system that:
- Separates controller management from action mapping (already started by removing GP0/GP1 prefixes)
- Supports player assignment: local players bind to specific gamepads
- Handles controller disconnect/reconnect with graceful player reassignment
- Provides clean API for networked multiplayer (input prediction, reconciliation)
- Consider: Should we have a `PlayerManager` that maps physical controllers to logical player slots?

### Camera System with Mouse Transform
Tenuous idea for camera systems with automatic mouse coordinate transformation:
```typescript
graphics.setCamera(translate, rotate, scale);
const worldPos = mouse.getWorldPosition(); // Applies inverse transform
```
**Research needed:** Study existing Love2D camera libraries (e.g., gamera, STALKER-X, hump.camera) to understand:
- Most popular API patterns
- Common features (follow targets, smooth movement, bounds, zoom)
- Whether users prefer camera-as-separate-object vs graphics-integrated
- Trade-offs between simplicity and flexibility

Decision: Only implement if a clear " winner" pattern emerges from the ecosystem.
