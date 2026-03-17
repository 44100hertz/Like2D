import { Engine } from './engine';
import type { Like2DEvent, EventMap, EventType } from './core/events';
import type { Like } from './core/like';

export type { Like } from './core/like';
export type { Vector2 } from './core/vector2';
export { Vec2 } from './core/vector2';
export { Rect } from './core/rect';
export type { Like2DEvent, EventType, EventMap } from './core/events';
export type { CanvasMode, PartialCanvasMode } from './core/canvas-config';
export type { Color, Quad, ShapeProps, DrawProps, PrintProps } from './core/graphics';
export { ImageHandle } from './core/graphics';
export type { Source, SourceOptions } from './core/audio';
export type { Scene } from './scene';
export { StartupScene } from './scenes/startup';
export { getGPName, GP } from './core/gamepad';
export type { StickPosition } from './core/gamepad';

type Callback<K extends EventType> = (...args: EventMap[K]) => void;

type Callbacks = {
  [K in EventType]?: Callback<K>;
};

export type LikeWithCallbacks = Like & Callbacks & {
  start(): Promise<void>;
  dispose(): void;
};

export function createLike(container: HTMLElement): LikeWithCallbacks {
  const engine = new Engine(container);
  const callbacks: Callbacks = {};

  const handleEvent = (event: Like2DEvent): void => {
    const cb = callbacks[event.type];
    if (cb) (cb as Function)(...event.args);
  };

  return Object.assign(engine.like, callbacks, {
    start: () => engine.start(handleEvent),
    dispose: () => engine.dispose(),
  }) as LikeWithCallbacks;
}
