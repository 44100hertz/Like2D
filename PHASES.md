If you are reading this, it's time to work on the next phase marked "TODO".

We will complete one phase at a time, in order.

1. We investigate whether a phase needs to be done, and if so its scope.
2. We update relevant files in spec/.
3. We create TODO.md items based on the difference between the spec and the relevant code.
4. After stopping for a TODO review, we complete the TODO items and check them off.
5. We commit

### DONE: Objects vs Args
Love2D was designed for Lua, so it uses arguments for everything, which can vary.
This is kind of antiquated. We should transition our API to:
1. Take in all required values as args
2. Take in all optional values as a props table

### DONE: Consideration: Color handling
Canvases take in CSS colors. Let's have a `Type Color = [number, number, number, number?]`.
When drawing functions encounter a string, they will use a CSS color. If they encounter an array like this, they can use an RGBA color like love2d.
Let's also consider whether a small Color library would be needed.

### TODO: Consideration: Geometric Data Types
It's much easier to manipulate coordinates if they're stored as a two-item array, which can be typed as Vector2.
Vector2 should not be an object, just a two-item array. `Type Vector2 = [number, number]`
There should be a set of common (pure) functions on the Vector2 inside of a library, and x,y / w,h coordinate pairs passed around should be put inside of them.
A common pattern would be `import { V2 } from Vector2`, then for example `V2.mul(a, b)`.
Further, maybe x,y,w,h coord sets should be stored as four-item arrays, typed as Rect and again with a library.
Maybe circles as well.

We need to consider whether this would simplify our library and increase ergonomics.

### TODO: Consideration: reducing state, preferring objects over args.
It is rare that we benefit from setting color, then line width, then calling draw afterwards. 
Instead, let's require that a color be passed into any draw call which requires a color. Line width can be optional.
For example, line drawing take a color argument. However, if images could take an optional tint argument, put that in a props table.
Or, for the best ergonomics, maybe colors should be optional as an argument and override the currently set color.

Are there other parts of the codebase that suffer from too much statefulness? Would they be cleaner if state was handled by the user?

## Future Considerations (Post-Game Object Model)

- Camera system
- Tweening/animation
- Entity systems
- Particle systems
- Collision detection
