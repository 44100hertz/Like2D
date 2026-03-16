# Native Events (Experimental)

**Status:** Pilot concept - work in progress on dedicated branch  
**Goal:** Replace custom event system with native CustomEvents while preserving ergonomics

## The Idea

Instead of a custom `EventEmitter` class that maintains callback arrays, we dispatch native DOM `CustomEvent` objects on the canvas element. This gives us:

1. **Native debugging** - DevTools shows events, can breakpoint on dispatch
2. **Platform features** - `{ once: true }`, `{ passive: true }`, capture/bubble phases
3. **Zero framework code** - No custom event infrastructure to maintain
4. **Multiple listeners** - Natural, no array management required

## Proposed API

### Core (Internal)

```typescript
// Engine dispatches native events
const canvas: HTMLCanvasElement;
canvas.dispatchEvent(new CustomEvent('like2d:update', { detail: { dt: 0.016 } }));
canvas.dispatchEvent(new CustomEvent('like2d:draw', { detail: {} }));
canvas.dispatchEvent(new CustomEvent('like2d:keypressed', { 
  detail: { scancode: 'Space', keycode: ' ' } 
}));
```

### Thin Wrappers (Exported)

```typescript
// Type-safe wrappers over addEventListener
export const onUpdate = (
  canvas: HTMLCanvasElement, 
  fn: (dt: number) => void,
  options?: AddEventListenerOptions
): () => void => {
  const handler = (e: CustomEvent<{ dt: number }>) => fn(e.detail.dt);
  canvas.addEventListener('like2d:update', handler as EventListener, options);
  return () => canvas.removeEventListener('like2d:update', handler as EventListener, options);
};

// Similar for other events...
export const onDraw: (canvas: HTMLCanvasElement, fn: () => void, options?) => Unsubscribe;
export const onKeyPressed: (canvas: HTMLCanvasElement, fn: (scancode: string, keycode: string) => void, options?) => Unsubscribe;
export const onMousePressed: (canvas: HTMLCanvasElement, fn: (x: number, y: number, button: number) => void, options?) => Unsubscribe;
// etc
```

### Adapter Usage (Unchanged)

Scene adapter and callback adapter use the thin wrappers internally. User-facing API remains identical:

```typescript
// Scene pattern - unchanged
const scene: Scene = {
  update(dt) { /* ... */ },
  draw() { /* ... */ },
  handleEvent(event) { /* ... */ }
};

// Callback pattern - unchanged  
love.update = (dt) => { /* ... */ };
love.draw = () => { /* ... */ };
```

## Benefits

| Aspect | Custom System | Native Events |
|--------|--------------|---------------|
| Lines of code | ~100 (EventEmitter) | ~30 (thin wrappers) |
| Debugging | Custom logging needed | DevTools shows all events |
| Event order | Framework-defined | DOM-defined (predictable) |
| Multiple listeners | Manual array management | Native support |
| Cleanup | Manual unsubscribe | Native `removeEventListener` |
| Platform features | Reimplement or miss | `{ once }`, `{ passive }`, bubbling |
| Tree-shaking | Harder | Better (dead code elimination) |

## Trade-offs

1. **String event names** - Still used internally, but hidden from users
2. **Requires canvas ref** - Wrappers hide this from adapters
3. **CustomEvent typing** - Verbose in TypeScript (one-time cost in wrappers)
4. **DOM dependency** - Requires HTMLCanvasElement (not a problem for web framework)

## Open Questions

1. **Expose raw API?** Should users get direct access to `addEventListener` on canvas?
2. **Event bubbling?** Should events bubble to container for parent-level handlers?
3. **Custom user events?** Allow `canvas.dispatchEvent(new CustomEvent('game:explosion'))`?
4. **Performance?** Is `dispatchEvent` slower than function calls? (Measure!)
5. **Migration path?** Gradual or breaking change?

## Event Types

```typescript
type Like2DEvents = {
  'like2d:load': {};
  'like2d:update': { dt: number };
  'like2d:draw': {};
  'like2d:keypressed': { scancode: string; keycode: string };
  'like2d:keyreleased': { scancode: string; keycode: string };
  'like2d:mousepressed': { x: number; y: number; button: number };
  'like2d:mousereleased': { x: number; y: number; button: number };
  'like2d:gamepadpressed': { gamepadIndex: number; buttonIndex: number; buttonName: string };
  'like2d:gamepadreleased': { gamepadIndex: number; buttonIndex: number; buttonName: string };
  'like2d:resize': { size: Vector2; pixelSize: Vector2; wasFullscreen: boolean; fullscreen: boolean };
  'like2d:actionpressed': { action: string };
  'like2d:actionreleased': { action: string };
};
```

## Philosophy Alignment

- **III** (Beautiful simplicity) - Less code, uses platform
- **VII** (Remove labor) - No custom event system to learn/debug
- **IX** (Verbs not nouns) - `dispatch` and `listen` are platform verbs
- **X** (Strict laws) - Defined event types, no `[key: string]: any` anarchy

## Implementation Plan

1. **Branch:** `pilot/native-events`
2. **Phase 1:** Implement core dispatching in Engine
3. **Phase 2:** Create thin wrapper exports
4. **Phase 3:** Migrate adapters to use wrappers
5. **Phase 4:** Update demos
6. **Phase 5:** Benchmark vs custom system
7. **Phase 6:** Decision - merge or abandon

## Related Work

- This could inform the design of point 7 (event system anarchy) in TODO.md
- May affect point 1 (StartupScene) if we use native click events
- Could simplify adapter architecture significantly
