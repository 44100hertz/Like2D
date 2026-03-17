# LÏKE2D

<svg width="300mm" height="105mm" version="1.1" viewBox="0 0 300 105" xmlns="http://www.w3.org/2000/svg">
 <rect x="10" y="11.23" width="280" height="83.544" fill="#e48080" stroke="#000" stroke-linejoin="round" stroke-width="2"/>
 <g fill="none" stroke="#000" stroke-linejoin="round">
  <rect x="97.484" y="11.23" width="52.516" height="46.237"/>
  <rect x="150" y="11.23" width="35.011" height="46.237"/>
  <rect x="185.01" y="11.23" width="52.516" height="46.237"/>
  <rect x="237.53" y="11.23" width="52.516" height="46.237"/>
 </g>
 <g>
  <rect x="132.49" y="11.23" width="17.505" height="27.461"/>
  <rect x="150" y="29.302" width="8.7527" height="18.776"/>
  <rect x="176.26" y="29.302" width="8.7527" height="18.776"/>
 </g>
 <rect x="150" y="11.23" width="17.505" height="8.6845" fill="none" stroke="#000" stroke-linejoin="round"/>
 <rect x="167.51" y="11.23" width="17.505" height="8.6845" fill="none" stroke="#000" stroke-linejoin="round"/>
 <g>
  <path d="m237.53 38.691-17.505-9.3882 17.505-18.073z"/>
  <rect x="202.88" y="48.079" width="16.772" height="9.3882"/>
  <rect x="272.54" y="20.266" width="16.772" height="9.3882"/>
  <rect x="272.54" y="38.691" width="16.772" height="9.3882"/>
  <path d="m202.52 29.302 0.36685-18.073h17.139z"/>
 </g>
 <path d="m64.078 1.0042-33.375 33.375-0.01743 0.0174a23.612 23.612 0 0 0 0 33.392 23.612 23.612 0 0 0 30.012 2.8022 23.612 23.612 0 0 1 7e-3 0.57034 23.612 23.612 0 0 1-23.612 23.612h53.97a23.612 23.612 0 0 1-23.611-23.612 23.612 23.612 0 0 1 7e-3 -0.57034 23.612 23.612 0 0 0 30.012-2.8029 23.612 23.612 0 0 0-6.88e-4 -33.392z" fill="#80c3e4" stroke="#000" stroke-linejoin="round"/>
 <g fill="none" stroke="#000" stroke-width=".5">
  <circle transform="rotate(135)" cx="-20.988" cy="-93.243" r="23.612"/>
  <circle transform="rotate(135)" cx="2.6238" cy="-69.632" r="23.612"/>
  <circle cx="91.062" cy="71.161" r="23.612"/>
  <circle cx="37.093" cy="71.161" r="23.612"/>
 </g>
</svg>

A web-native 2D game framework inspired by [LÖVE](https://love2d.org/), built for simplicity and the modern web.

## What it is

LIKE is a **curated toolkit** around browser APIs.

It does less, because it **does the right thing**. And when that's not the right thing for you, we hand you the wrench.

- **Stateless Graphics:** Forget to reset native Canvas state (like LineCap) between calls and things break mysteriously. We make drawing explicit: what you see is what you set.

- **Fire-and-forget Assets:** Async asset loading directly on realtime web games is annoying. We let you pretend it's instant and synchronous.

- **Physical Joypad:** Our gamepad module auto-maps to physical buttons like "bottom" and "top". Because A isn't always in the same spot.

- **Actions System:** Of course you can use device input callbacks just like love2d -- but you can also map inputs to actions and get callbacks on that.

- **Scaling Modes:** Pixel art games need pixel-perfect scaling. So we do that: integer nearest -> linear. Or not; turn off pixelart mode to have a canvas that stays at native resolution.

- **Sane Architecture:** Everything is built around a centralized event handler for browser-native events. We won't reinvent the wheel.

## Installation

```bash
npm install like2d
# or
pnpm add like2d
```

## Quick Start

[Like2D Starter Template](https://github.com/44100hertz/Like2D-starter)

## Usage Example

```typescript
import { createLike } from 'like2d';

const like = createLike(document.body);

like.load = () => {
  like.setMode({ pixelResolution: [800, 600] });
  like.input.map('jump', ['Space', 'ButtonBottom']);
};

like.update = (dt) => {
  if (like.input.justPressed('jump')) {
    console.log('Jump!');
  }
};

like.draw = () => {
  like.gfx.clear([0.1, 0.1, 0.1, 1]);
  like.gfx.circle('fill', 'dodgerblue', [400, 300], 50);
  like.gfx.print('white', 'Hello Like2D!', [20, 20]);
};

await like.start();
```

## For Love2D Developers

LIKE's API is not the same as LOVE, but similar in spirit. Notable differences:
 - Graphics have less state, there is no setColor getColor etc.
 - Our APIs are, in general, a bit different. You'll have to learn some.
 - You manage your own state; like is not global, but you can share it around for similar results. This allows multiple LIKE instances per webpage.
 - We use Vector2 and Rect tuples (as in `[number, number]`) instead of loose coordinates.
 - Theres an actions system -- `input.map` / `actionpressed` and `actionreleased` callbacks.
 - Some things are missing either due to browser limitations or smaller scope.

## Feedback welcome

Before you report a bug:
 1. Make sure you're on the latest release.
 2. If the issue exists already, just comment on that one.
 3. See if it happens in other web browsers.

Before you request a feature:
 1. ask: Would it make sense as a core feature, or should it be an external library?
 2. See if the feature exists already.
 3. Think about the demand for it overall. Make your case why game developers want it.
 4. Consider just making a PR yourself, or sending a prompt/spec that an AI can hack on.

[Then, put your feedback on GitHub.](https://github.com/44100hertz/Like2D/issues)

## License

MIT
