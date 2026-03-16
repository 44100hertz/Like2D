import type { Vector2 } from './vector2';

export type Like2DEvent = 
  | { type: 'load'; args: []; timestamp: number }
  | { type: 'update'; args: [dt: number]; timestamp: number }
  | { type: 'draw'; args: [canvas: HTMLCanvasElement]; timestamp: number }
  | { type: 'resize'; args: [size: Vector2, pixelSize: Vector2, fullscreen: boolean]; timestamp: number }
  | { type: 'keypressed'; args: [scancode: string, keycode: string]; timestamp: number }
  | { type: 'keyreleased'; args: [scancode: string, keycode: string]; timestamp: number }
  | { type: 'mousepressed'; args: [x: number, y: number, button: number]; timestamp: number }
  | { type: 'mousereleased'; args: [x: number, y: number, button: number]; timestamp: number }
  | { type: 'gamepadpressed'; args: [gamepadIndex: number, buttonIndex: number, buttonName: string]; timestamp: number }
  | { type: 'gamepadreleased'; args: [gamepadIndex: number, buttonIndex: number, buttonName: string]; timestamp: number }
  | { type: 'actionpressed'; args: [action: string]; timestamp: number }
  | { type: 'actionreleased'; args: [action: string]; timestamp: number };

export type EventType = Like2DEvent['type'];
