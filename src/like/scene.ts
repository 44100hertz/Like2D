export interface Scene {
  width: number;
  height: number;
  load?: () => void;
  update: (dt: number) => void;
  draw: () => void;
  keypressed?: (key: string) => void;
  keyreleased?: (key: string) => void;
  mousepressed?: (x: number, y: number, button: number) => void;
  mousereleased?: (x: number, y: number, button: number) => void;
}
