# LÏKE2D

Want to make a 2D browser game? Well like, do it!

LIKE is in the same family as LÖVE or Raylib, but only for web.
2D gamedev has never been simpler!

## But why?

**Beginner Friendly**

LIKE is easy to get started with. There's no boilerplate,
and you can get things on screen in an instant.

**Fire-and-forget asset loading**

Loading sound and images in Vanilla JS is clunky and can interrupt your game loop.

LIKE abstracts away DOM operations, giving synchronous
asset handles that are ignored until the asset is actually loaded.

**Zero boilerplate, physical game input**

LIKE keeps track of which inputs are down or pressed.

It also maps game controller buttons to physical locations rather
than just their names by using the standard SDL database.

On top of that, inputs can be grouped into actions, so it's easy to
map multiple buttons to one input, or to make remapping systems.

**Stateless Canvas API**

JS canvas has a several stateful properties to keep track of, like color and line width.
Don't change one and forget to change it back!

By wrapping native draw calls, LIKE makes it easier to reason about them.

** Declarative event system **

Don't bother setting and clearing stateful listeners, juggling them around all day.

LIKE keeps event handling simple by running it all through a single callback.

**Build it how you want it**

It's not an engine, it's a framework.

For new developers, this means making simple games easily: no engine, no problem!

For others, you can get to work faster making your own specialized tooling, engine, and more,
all without banging your head on browser APIs.

## Example

Put this into main.ts:
```typescript
import { like, Scene } from 'like2d';

const game: Scene = {
  width: 800,
  height: 600,
  
  load() {
    // Assets load in background - no await needed
    like.graphics.newImage('player.png');
    like.audio.newSource('jump.ogg');
    
    // Map actions to inputs
    like.input.map('jump', ['Space', 'ArrowUp', 'GP ButtonBottom']);
  },
  
  update(dt) {
    if (like.input.isDown('jump')) {
      // Jump logic
    }
  },
  
  draw() {
    like.graphics.rectangle('fill', 'red', [100, 100, 50, 50]);
  }
};

// Pass a container element where the canvas will be appended
const container = document.getElementById('game-container')!;
await like.init(container);
like.start(game);
```

### Container Element

`like.init()` requires a DOM element as its first argument. This gives you full control over where the game canvas appears in your page:

```typescript
// Get element by ID
const container = document.getElementById('game-container');
await like.init(container);

// Or use a ref in frameworks
await like.init(containerRef.current);

// Or create dynamically
const container = document.createElement('div');
document.body.appendChild(container);
await like.init(container);
```

Then run:
```bash
pnpm install
pnpm run dev
```

## For LOVE developers

LIKE is not compatible with LOVE.

To summarize the differences:
 - We don't keep track of color etc. as state (via setColor, etc.), so it gets passed in each draw call.
 - We use objects for optional arguments, and avoid function overloading.
 - We make use of tuples for passing around colors, coordinates, and rects.
 - In LOVE, Callbacks such as `love.keypressed` needed to be wrapped in order to make Scenes. This pattern is part of LIKE.
 - 2d Canvas so, no shaders.
 - No built-in physics.

