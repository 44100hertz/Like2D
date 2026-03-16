import type { Event } from '../../core/events';

export type KeyPressedEvent = {
  type: 'keypressed';
  scancode: string;
  keycode: string;
  timestamp: number;
};

export type KeyReleasedEvent = {
  type: 'keyreleased';
  scancode: string;
  keycode: string;
  timestamp: number;
};

export type MousePressedEvent = {
  type: 'mousepressed';
  x: number;
  y: number;
  button: number;
  timestamp: number;
};

export type MouseReleasedEvent = {
  type: 'mousereleased';
  x: number;
  y: number;
  button: number;
  timestamp: number;
};

export type GamepadPressedEvent = {
  type: 'gamepadpressed';
  gamepadIndex: number;
  buttonIndex: number;
  buttonName: string;
  timestamp: number;
};

export type GamepadReleasedEvent = {
  type: 'gamepadreleased';
  gamepadIndex: number;
  buttonIndex: number;
  buttonName: string;
  timestamp: number;
};

export type ActionPressedEvent = {
  type: 'like2d:actionpressed';
  action: string;
  timestamp: number;
};

export type ActionReleasedEvent = {
  type: 'like2d:actionreleased';
  action: string;
  timestamp: number;
};

export type InputEvent =
  | KeyPressedEvent
  | KeyReleasedEvent
  | MousePressedEvent
  | MouseReleasedEvent
  | GamepadPressedEvent
  | GamepadReleasedEvent
  | ActionPressedEvent
  | ActionReleasedEvent;

export type SceneEvent = Event | InputEvent;

export type Scene = {
  load?(): void;
  update(dt: number): void;
  draw(canvas: HTMLCanvasElement): void;
  handleEvent?(event: SceneEvent): void;
};
