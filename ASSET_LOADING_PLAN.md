# Asset Loading System Refactoring Plan

## Problem Statement

The current asset loading system requires all assets to be preloaded in `Scene.preload()` before the game starts. This is problematic because:

1. Games with heavy assets cannot load them mid-level (memory management, progressive loading)
2. Async/await syntax is required everywhere, cluttering game code
3. `Scene.preload` forces a rigid loading structure that doesn't fit all use cases
4. No graceful degradation - missing assets cause errors/warnings

## Proposed Solution

Convert to a **fire-and-forget** loading model where:
- Asset loading functions return immediately with a handle
- Loading happens asynchronously in the background
- Usage sites gracefully skip if asset isn't ready yet
- Loading can happen anywhere (constructor, load, update, draw)

## Implementation Details

### 1. Graphics Module Changes (`src/like/graphics.ts`)

**Current:**
```typescript
newImage(path: string): Promise<ImageData>
draw(drawable: ImageData | string, ...): void  // Warns if string path not loaded
```

**New:**
```typescript
// Returns handle immediately, starts loading in background
newImage(path: string): ImageHandle

// ImageHandle interface
interface ImageHandle {
  readonly path: string;
  isReady(): boolean;
  ready(): Promise<void>;  // For explicit waiting if needed
  readonly width: number;   // 0 if not loaded
  readonly height: number;  // 0 if not loaded
}

// draw() skips gracefully if handle not ready
draw(handle: ImageHandle, x, y, ...): void

// String paths still supported for backward compatibility, look up in cache
draw(path: string, x, y, ...): void  // Silent no-op if not loaded yet
```

**Changes needed:**
- Create `ImageHandle` class wrapping loading state
- Modify `newImage` to be synchronous, return handle immediately
- Cache handles by path so multiple calls return same handle
- `draw()` checks `handle.isReady()`, returns early if false (no warning)
- Same changes for `drawq()`

### 2. Audio Module Changes (`src/like/audio.ts`)

**Current:**
```typescript
async newSource(path: string, type?: 'static' | 'stream'): Promise<Source>
play(source: Source): boolean  // Warns if not ready
```

**New:**
```typescript
// Returns Source immediately, starts loading in background
newSource(path: string, type?: 'static' | 'stream'): Source

// Source already has isReady() and ready() - just make constructor synchronous
// play() returns false silently if not ready (no warning)
```

**Changes needed:**
- Make `newSource` synchronous
- Remove `await source.ready()` from `newSource`
- `Source.play()` returns false silently if `!isLoaded`
- Remove the warning in `play()` when not loaded

### 3. Scene Interface Changes (`src/like/scene.ts`)

**Remove:**
```typescript
preload?: () => Promise<void>;  // Delete this line
```

### 4. Main Like Class Changes (`src/like/index.ts`)

**In `start()` method:**
- Remove the preload call:
```typescript
// REMOVE THIS BLOCK:
if (this.currentScene.preload) {
  await this.currentScene.preload();
}
```

- Keep the `load()` call (it's synchronous and useful for setup)

### 5. Update Demo (`src/main.ts`)

Update `main.ts` to demonstrate the new pattern:

**Before:**
```typescript
preload: async () => {
  pepperImage = await like.graphics.newImage('pepper.png');
  audioSource = await like.audio.newSource('./test.ogg');
},

load: () => {
  // game start
},
```

**After:**
```typescript
load: () => {
  // Start loading assets - they return immediately
  like.graphics.newImage('pepper.png');
  like.audio.newSource('./test.ogg');
  
  gameStartTime = like.timer.getTime();
},
```

Update draw calls to use paths directly (or keep using variables if preferred):
```typescript
// Both work - by path (looks up handle in cache)
like.graphics.draw('pepper.png', 650, 350);

// Or by handle reference
const img = like.graphics.newImage('pepper.png');
like.graphics.draw(img, 650, 350);
```

## API Compatibility

**Breaking changes:**
- `Scene.preload` removed
- `newImage()` no longer returns Promise
- `newSource()` no longer returns Promise

**Non-breaking:**
- `draw(path)` still works (just skips if not ready)
- `play(source)` still works (returns false if not ready)
- `ImageHandle` can be used wherever `ImageData` was used

## Benefits

1. **Flexible loading** - Load assets anywhere, anytime
2. **Cleaner code** - No async/await in game logic
3. **Progressive loading** - Large games can load assets on-demand
4. **Graceful degradation** - Missing assets don't crash, just don't render
5. **Simpler API** - One less lifecycle method to understand

## Testing Checklist

- [ ] `newImage()` returns immediately, image loads in background
- [ ] `draw('path')` skips silently before image loaded
- [ ] `draw('path')` renders after image loaded
- [ ] Multiple calls to `newImage('same.png')` return same handle
- [ ] `newSource()` returns immediately
- [ ] `play()` returns false silently before source loaded
- [ ] `play()` works after source loaded
- [ ] Demo runs without errors
- [ ] SPEC.md updated
