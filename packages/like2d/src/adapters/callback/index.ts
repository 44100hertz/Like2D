import { Engine } from '../../engine';
import type { Like2DEvent, EventType, EventMap } from '../../core/events';
import type { Like } from '../../core/like';

// Callback types without Like prepended
type Callback<T extends EventType> = (...args: EventMap[T]) => void;

// Type for the like object with callbacks
type LikeWithCallbacks = Like & {
  load?: () => void;
  update?: (dt: number) => void;
  draw?: () => void;
  resize?: (size: import('../../core/vector2').Vector2, pixelSize: import('../../core/vector2').Vector2, fullscreen: boolean) => void;
  keypressed?: (scancode: string, keycode: string) => void;
  keyreleased?: (scancode: string, keycode: string) => void;
  mousepressed?: (x: number, y: number, button: number) => void;
  mousereleased?: (x: number, y: number, button: number) => void;
  gamepadpressed?: (gamepadIndex: number, buttonIndex: number, buttonName: string) => void;
  gamepadreleased?: (gamepadIndex: number, buttonIndex: number, buttonName: string) => void;
  actionpressed?: (action: string) => void;
  actionreleased?: (action: string) => void;
  handleEvent?: (event: Like2DEvent) => void;
  start: () => Promise<void>;
  dispose: () => void;
};

// Routes events to callback properties on the like object
export function routeEvents(like: LikeWithCallbacks): (event: Like2DEvent) => void {
  return (event) => {
    const cb = like[event.type as keyof LikeWithCallbacks] as Callback<typeof event.type> | undefined;
    if (cb) (cb as Function)(...event.args);
  };
}

export function createLike(container: HTMLElement): LikeWithCallbacks {
  const engine = new Engine(container);

  // Create the like object that combines engine.like with callback properties and methods
  const like = {
    ...engine.like,
    handleEvent: undefined as ((event: Like2DEvent) => void) | undefined,
    start: async (): Promise<void> => {
      const handleEvent = (event: Like2DEvent): void => {
        like.handleEvent?.(event);
        const cb = like[event.type] as Callback<typeof event.type> | undefined;
        if (cb) (cb as Function)(...event.args);
      };
      await engine.start(handleEvent);
    },
    dispose: (): void => {
      engine.dispose();
    }
  } as LikeWithCallbacks;

  return like;
}
