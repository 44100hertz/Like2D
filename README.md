# LÏKE2D

Want to make a 2D browser game? Well like, do it!

It's the same concept as LÖVE or Raylib, but for web. 2D gamedev has never been simpler!

## But why?

If you ever worked on a vanilla web game, you ran into some issues:

 - Loading sound and images is clunky and can interrupt your game loop.
 - Input systems have a lot of boilerplate!
 - Gamepad API doesn't give physical button locations.
 - No Typescript? That can burn you as the app scales.

LIKE solves these annoying problems so that you can focus on the fun ones.

It's not an engine, it's a framework.
Here, you have the freedom (burden?) of building games how you like: OOP, data oriented, or whatever.
For new developers, this means making simple games easily: no engine, no problem!
For others, you will likely enjoy making your own specialized tooling, engine, and more. It can
even end up better than a one-size-fits all solution.

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

## Rock-Solid principles

LIKE seeks to master its niche rather than expand forever.
As tempting as it is to create a one-size-fits all game engine, LIKE has decided to stay a framework.
This means the design is elegant and flexible.
Instead of trying to solve every problem in the universe, we can be thorough in solving just a handful.
And when LIKE isn't needed, it doesn't try to wrap every single browser API.

LIKE stays out of your way.
It avoids keeping much state, so there's less to think about.
The goal of LIKE is to be invisible.
Let the developer focus on the content of their own work, instead of on mine.

LIKE avoids supporting bad features and simplifies your mental model.
For example, input handling is based on physical location rather than nominal.
This is true both of keys and buttons.
This way, our games can feel the same on every machine.

## For LOVE developers

LIKE is not API compatible with LOVE.

To summarize the differences:
 - We don't keep track of color as a state (via setColor, etc.), so it gets passed in each draw call.
 - We use objects for optional arguments, and avoid function overloading.
 - We make use of arrays for passing around colors, coordinates, and rects.
 - In LOVE, Callbacks such as `love.keypressed` needed to be wrapped in order to make Scenes. So I codified that.
 - 2d Canvas so, no shaders.
 - No built-in physics.

