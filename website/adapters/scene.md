# Scene Adapter

Class-based scene pattern for Like2D. This adapter provides an instance-based API with explicit scene management.

## Quick Start

```typescript
import { SceneRunner, Scene } from 'like2d/scene';

class MyScene implements Scene {
  load() {
    console.log('Scene loaded!');
  }

  update(dt: number) {
    // Update logic here
  }

  draw() {
    graphics.print('Hello, World!', [100, 100]);
  }
}

// Create runner and start
const runner = new SceneRunner(document.body);
runner.setMode({ pixelResolution: [800, 600] });
await runner.start(new MyScene());
```

See the [Callbacks documentation](/callbacks) for a complete list of available callback methods.

## Scene Interface

A scene is a class that implements the `Scene` interface. All callbacks are optional methods:

```typescript
interface Scene {
  load?(): void;
  update?(dt: number): void;
  draw?(g: GraphicsContext): void;
  resize?(size: Vector2, pixelSize: Vector2, fullscreen: boolean): void;
  keypressed?(scancode: string, keycode: string): void;
  keyreleased?(scancode: string, keycode: string): void;
  mousepressed?(x: number, y: number, button: number): void;
  mousereleased?(x: number, y: number, button: number): void;
  gamepadpressed?(gamepadIndex: number, buttonIndex: number, buttonName: string): void;
  gamepadreleased?(gamepadIndex: number, buttonIndex: number, buttonName: string): void;
  actionpressed?(action: string): void;
  actionreleased?(action: string): void;
  
  // handleEvent is special - it returns the event
  handleEvent?(event: Like2DEvent): Like2DEvent;
}
```

Every callback except `handleEvent` is a method that receives unpacked arguments. The `handleEvent` method receives the full event object and must return it (possibly modified).

Canvas size is controlled via `runner.setMode()`, not scene properties.

## SceneRunner API

The runner manages the canvas, engine loop, and scene lifecycle. Create it with a container element, optionally call `setMode()` to configure the canvas, then `start()` with your initial scene.

## Exported Classes

The scene adapter re-exports all core classes for convenience:

```typescript
import { 
  SceneRunner, 
  Scene,
  Graphics,
  Audio,
  Input,
  Timer,
  Keyboard,
  Mouse,
  Gamepad,
  Vec2,
  Rect
} from 'like2d/scene';
```

## When to Use This Adapter

Use the scene adapter when:
- You prefer object-oriented design
- You need multiple scenes (menus, levels, etc.)
- You want instance isolation (no globals)
- You're building a larger application
- You want explicit lifecycle management

For a simpler Love2D-style callback pattern, consider the [Callback Adapter](./callback) instead.

## Example: Scene Switching

```typescript
class MenuScene implements Scene {
  draw() {
    graphics.print('Press SPACE to start', [350, 300]);
  }
  
  keypressed(scancode: string, keycode: string) {
    if (keycode === ' ') {
      runner.setScene(new GameScene());
    }
  }
}

class GameScene implements Scene {
  update(dt: number) {
    // Game logic
  }
  
  draw() {
    // Render game
  }
}

const runner = new SceneRunner(document.body);
runner.setMode({ pixelResolution: [800, 600] });
await runner.start(new MenuScene());
```

## Full API Reference

For detailed type information and all available methods, see the [Scene Adapter API Documentation](/api/adapters/scene).
