# v2.8.0 TODO - Focus & Event Handling

## Refactor canvas
 - [x] Make the canvas manager always display the same in-browser canvas, only changing the render target.
 - [x] Use algebra to fix and/or simplify mouse coord transform logic, broken by this change.

## Mouse API updates
 - [x] Replace setVisible and getPointerLock with lockPointer and isPointerLocked
 - [x] replace mouse getX and getY with getPosition in API
 - [x] test pointer lock in feature demo
 - [ ] Add mousemoved event with Vector2 position and relative flag
 - [ ] BREAKING: Update mousepressed/mousereleased to use Vector2 for position
 - [ ] Add hideCursor/showCursor methods (without pointer lock)

### Mouse Event Semantics with Pointer Lock
**Design rationale:** Clicks answer "where?", movement answers "how much?". Pointer lock only affects movement interpretation.

- **mousepressed/mousereleased**: Always use absolute position (where on canvas). Even when locked, clicks fire at the lock position. Games need absolute position for UI interactions.
  - Signature: `[pos: Vector2, button: number]`

- **mousemoved**: Position meaning depends on lock state
  - `relative=false`: pos is absolute canvas coordinates [x, y] - use for UI hover
  - `relative=true`: pos is relative movement [dx, dy] - use for FPS controls
  - Signature: `[pos: Vector2, relative: boolean]`
  - Games check the flag to handle both cases appropriately

## Focus Blur (in progress?)
 - [x] Add 'focus' and 'blur' events in the engine.
 - [x] (refactor) Make sure all event listeners are cleaned up on dispose.


## Adding PreventDefault to avoid scrolling the page etc while game is focused. (in progress?)
 - [x] Bind mouse movement and click events to the canvas element
 - [x] Add tabindex="0" to make canvas focusable
 - [x] Add wheel event with preventDefault to stop scrolling
 - [x] Simplify mouse transform logic (offsetX/Y already relative to canvas)
 - [x] Move keyboard events to canvas with preventDefault on scroll keys

