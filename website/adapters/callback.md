# Callback Adapter

Love2D-style callback pattern for Like2D. This adapter provides a singleton-based API familiar to Love2D users.

## Quick Start

```typescript
import { like, graphics } from 'like2d/callback';

// Assign callbacks
like.load = () => {
  console.log('Game loaded!');
};

like.update = (dt) => {
  // Update logic here
};

like.draw = () => {
  graphics.print('Hello, World!', [100, 100]);
};

like.keypressed = (scancode, keycode) => {
  console.log('Key pressed:', keycode);
};

// Start the game
const container = document.getElementById('game-container');
await like.init(container);
like.setMode({ pixelResolution: [800, 600] });
```

See the [Callbacks documentation](/callbacks) for a complete list of available callbacks.

## Singleton Modules

All core modules are exported as singletons:

- `graphics` - 2D rendering (images, shapes, text)
- `audio` - Audio playback and management
- `timer` - Time tracking, FPS, delta time
- `input` - Action mapping system
- `keyboard` - Direct keyboard access
- `mouse` - Direct mouse access
- `gamepad` - Direct gamepad access

## Love2D Compatibility

For even more compatibility, import as `love`:

```typescript
import { love as like } from 'like2d/callback';

love.load = () => { ... };
love.update = (dt) => { ... };
love.draw = () => { ... };
```

## API Methods

### like.init(container)

Initialize and start the game loop. The canvas is created and attached to the container.

### like.setMode(mode)

Set the canvas display mode. Mode is partial - only specified fields are updated.

```typescript
// Set resolution
like.setMode({ pixelResolution: [800, 600] });

// Toggle fullscreen (preserves other settings)
like.setMode({ fullscreen: true });
```

## When to Use This Adapter

Use the callback adapter when:
- You're porting from Love2D
- You prefer a simple, global-state approach
- You're building a quick prototype
- You want minimal boilerplate

For class-based scene management, consider the [Scene Adapter](./scene) instead.

## Full API Reference

For detailed type information and all available methods, see the [Callback Adapter API Documentation](/api/adapters/callback).
