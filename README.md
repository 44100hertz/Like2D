# LÏKE2D

Want to make a 2D browser game? Well like, do it!

LIKE is in the same family as LÖVE or Raylib, but only for web.
2D gamedev has never been simpler!

## But why?

If you ever worked on a vanilla web game, you ran into some issues:

 - Loading sound and images is clunky and can interrupt your game loop.
 - Input systems have a lot of boilerplate!
 - 2D Canvas API is WAY too stateful.
 - It just doesn't feel _nice_ to use.

LIKE solves these annoying problems so that you can focus on the fun ones.

It also encourages best practices:
 - Input handling based on physical locations
 - Pure types for geometry, with helper libraries.
 - Declarative event handling, not a pile of messy listeners.

And remember: It's not an engine, it's a framework.
Here, you have the freedom of building games how you like.
For new developers, this means making simple games easily: no engine, no problem!
For others, you can get to work faster making your own specialized tooling, engine, and more,
all without banging your head on browser APIs.

## Example

Put this into main.ts:
```typescript
import { like, Scene } from './like/index.ts';

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
    like.graphics.rectangle('fill', 100, 100, 50, 50, { color: [1, 0, 0] });
  }
};

await like.init();
like.setScene(game);
like.start();
```

Then run:
```bash
pnpm install
pnpm run dev
```

## For LOVE developers

LIKE is not API compatible with LOVE.

To summarize the differences:
 - We don't keep track of color etc. as state (via setColor, etc.), so it gets passed in each draw call.
 - We use objects for optional arguments, and avoid function overloading.
 - We make use of tuples for passing around colors, coordinates, and rects.
 - In LOVE, Callbacks such as `love.keypressed` needed to be wrapped in order to make Scenes. This is part of LIKE.
 - 2d Canvas so, no shaders.
 - No built-in physics.

