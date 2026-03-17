import type { Vector2 } from '../../core/vector2';
import type { Like2DEvent } from '../../core/events';
import type { Like } from '../../core/like';

export type Scene = {
  load?(like: Like): void;
  update?(like: Like, dt: number): void;
  draw?(like: Like): void;
  resize?(like: Like, size: Vector2, pixelSize: Vector2, fullscreen: boolean): void;
  keypressed?(like: Like, scancode: string, keycode: string): void;
  keyreleased?(like: Like, scancode: string, keycode: string): void;
  mousepressed?(like: Like, x: number, y: number, button: number): void;
  mousereleased?(like: Like, x: number, y: number, button: number): void;
  gamepadpressed?(like: Like, gamepadIndex: number, buttonIndex: number, buttonName: string): void;
  gamepadreleased?(like: Like, gamepadIndex: number, buttonIndex: number, buttonName: string): void;
  actionpressed?(like: Like, action: string): void;
  actionreleased?(like: Like, action: string): void;
  handleEvent?(like: Like, event: Like2DEvent): void;
};
