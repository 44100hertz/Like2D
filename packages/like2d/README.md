# LÏKE2D Framework 

You've reached the more detailed docs for this framework.
For now, the source code is the best API docs we have. 

## Features of LIKE

**Stateless Canvas API**

JS canvas has state to keep track of like color and line width.
LIKE abstracts that away so it's easy to reason about.

**Fire-and-forget asset loading**

Loading sound and images in Vanilla JS is clunky and can interrupt your game loop.
LIKE has synchronous asset handles and abstracts away the clunkiness.

**Zero boilerplate, physical game input**

LIKE does the input boilerplate for you.
 - Keeping track of what's held/pressed.
 - Controller mapping by physical location. Not every A is in the same spot.
 - Mapping inputs into actions for easy remapping.

**Declarative event system**

Don't bother juggling stateful listeners.
LIKE keeps event handling simple by running it all through a single callback.

**Build it how you want it**

It's not an engine, it's a framework.
For new developers, this means making simple games easily: no engine, no problem!
For others, get to work faster making your own specialized tooling, engine, and more,
all without banging your head on browser APIs.

## Getting started

TODO: fill this in.

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

