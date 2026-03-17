# Like2D TODO

## V2.6.0 - Non-Global Graphics Module

### Architecture Change

- **Graphics module** - static, only `newImage()` for asset loading
- **GraphicsContext** - bound to canvas, passed to `draw()` callback

```typescript
import { graphics } from 'like2d/callback';
const image = graphics.newImage('sprite.png');  // static

like.draw = (g) => {
  g.circle('fill', 'red', [100, 100], 50);  // bound context
};
```

### Status: ✅ Complete

All implementation tasks completed for V2.6.0. Build and type checking pass.

---

## After V2

### Publishing Preparation

- [ ] Configure GitHub Pages deployment for website

### Website Work

Discuss homepage contents:
- Introduction
- Docs
- Code Sandbox with interactive tutorial?

Logo: spade in circle (Love2D-style)

---

## Future Ideas

### Multiplayer System Design

- Separates controller management from action mapping
- Supports player assignment: local players bind to specific gamepads
- Handles controller disconnect/reconnect gracefully
- Provides clean API for networked multiplayer
- Consider: `PlayerManager` mapping physical controllers to logical player slots?

### Camera System with Mouse Transform

```typescript
graphics.setCamera(translate, rotate, scale);
const worldPos = mouse.getWorldPosition(); // Applies inverse transform
```

Research needed: Study Love2D camera libraries (gamera, STALKER-X, hump.camera) for patterns.

Decision: Only implement if clear "winner" pattern emerges.
