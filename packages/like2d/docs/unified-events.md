# Unified Events

## Philosophy

Multiple event handler callbacks (`keypressed`, `mousepressed`, `actionpressed`, etc.) create several problems:
- Fragmented handling logic spread across many methods
- Difficult to forward events to other systems or scenes
- No unified way to handle "any event" (for logging, blocking, etc.)
- Repetitive callback definitions for every input type

Like2D replaces input event callbacks with a single `handleEvent` method that receives all input events as a tagged union.

## Event Type

Input events share a common discriminated union type:

```typescript
type Event =
  | { type: 'keypressed'; scancode: string; keycode: string }
  | { type: 'keyreleased'; scancode: string; keycode: string }
  | { type: 'mousepressed'; x: number; y: number; button: number }
  | { type: 'mousereleased'; x: number; y: number; button: number }
  | { type: 'actionpressed'; action: string }
  | { type: 'actionreleased'; action: string }
  | { type: 'gamepadpressed'; gamepadIndex: number; buttonIndex: number; buttonName: string }
  | { type: 'gamepadreleased'; gamepadIndex: number; buttonIndex: number; buttonName: string };
```

## Scene Interface

```typescript
interface Scene {
  width: number;
  height: number;
  load?: () => void;
  update: (dt: number) => void;
  draw: () => void;
  handleEvent?: (event: Event) => void;
}
```

## Design Decisions

**Separate lifecycle from input** - `load`, `update`, and `draw` remain as distinct methods. In layered scenes, the parent typically acts as an event filter - choosing which input events to forward while managing lifecycle independently.

**Input events unified** - All input events flow through `handleEvent`. Scenes switch on `event.type` to handle specific input types.

**Event forwarding** - Scenes can forward input events to child scenes by calling `other.handleEvent(event)`. This enables:
- Layered scenes (HUD over gameplay)
- Modal dialogs that selectively forward to background
- Event preprocessing (logging, blocking, transformation)

**Immutable events** - Events are plain objects. Handlers receive them but don't modify them.

**Type-safe discrimination** - TypeScript narrows the event type automatically in switch statements:

```typescript
handleEvent(event: Event) {
  switch (event.type) {
    case 'keypressed':
      // TypeScript knows event.scancode exists here
      console.log(event.scancode);
      break;
    case 'mousepressed':
      // TypeScript knows event.x, event.y, event.button exist here
      this.handleClick(event.x, event.y, event.button);
      break;
  }
}
```

## Benefits

**Composability** - Forwarding input events makes it trivial to layer scenes:

```typescript
class HUDScene implements Scene {
  private gameScene: GameScene;
  
  update(dt: number) {
    this.gameScene.update(dt);
    this.updateUI(dt);
  }
  
  draw() {
    this.gameScene.draw();
    this.drawUI();
  }
  
  handleEvent(event: Event) {
    // Forward most input to game, but intercept menu keys
    if (event.type === 'keypressed' && event.scancode === 'Escape') {
      this.toggleMenu();
      return;
    }
    this.gameScene.handleEvent(event);
  }
}
```

**Reduced boilerplate** - One input method instead of many optional callbacks.

**Testability** - Events are plain objects, easy to construct and inject in tests.

**Interceptability** - Common preprocessing (block all input during pause, log events, etc.):

```typescript
handleEvent(event: Event) {
  if (this.isPaused) {
    return; // Block all input during pause
  }
  // ... normal handling
}
```
