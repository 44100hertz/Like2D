export type Event =
  | { type: 'keypressed'; scancode: string; keycode: string }
  | { type: 'keyreleased'; scancode: string; keycode: string }
  | { type: 'mousepressed'; x: number; y: number; button: number }
  | { type: 'mousereleased'; x: number; y: number; button: number }
  | { type: 'actionpressed'; action: string }
  | { type: 'actionreleased'; action: string }
  | { type: 'gamepadpressed'; gamepadIndex: number; buttonIndex: number; buttonName: string }
  | { type: 'gamepadreleased'; gamepadIndex: number; buttonIndex: number; buttonName: string };
