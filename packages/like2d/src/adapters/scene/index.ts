import { Graphics } from '../../core/graphics';
import { Audio } from '../../core/audio';
import { Input } from '../../core/input';
import { Timer } from '../../core/timer';
import { Keyboard } from '../../core/keyboard';
import { Mouse } from '../../core/mouse';
import { Gamepad } from '../../core/gamepad';
import { Engine } from '../../engine';
import type { Scene } from './scene';
import type { CanvasConfig } from '../../core/canvas-config';
import { StartupScene } from './startup-scene';
import type { Like2DEvent } from '../../core/events';

export { Graphics, ImageHandle } from '../../core/graphics';
export { StartupScene };
export { Audio } from '../../core/audio';
export { Input } from '../../core/input';
export { Timer } from '../../core/timer';
export { Keyboard } from '../../core/keyboard';
export { Mouse } from '../../core/mouse';
export { Gamepad, getGPName, GP } from '../../core/gamepad';
export type { Like2DEvent as Event } from '../../core/events';
export type { Scene } from './scene';
export type { Vector2 } from '../../core/vector2';
export { Vec2 } from '../../core/vector2';
export { Rect } from '../../core/rect';
export type { CanvasConfig } from '../../core/canvas-config';
export { calcFixedScale } from '../../core/canvas-config';

export class SceneRunner {
  private engine: Engine;
  private scene: Scene | null = null;

  readonly graphics: Graphics;
  readonly audio: Audio;
  readonly timer: Timer;
  readonly input: Input;
  readonly keyboard: Keyboard;
  readonly mouse: Mouse;
  readonly gamepad: Gamepad;

  constructor(container: HTMLElement) {
    this.engine = new Engine(container);
    this.graphics = new Graphics(this.engine.getContext());
    this.keyboard = new Keyboard();
    this.mouse = new Mouse((cssX, cssY) => this.engine.transformMousePosition(cssX, cssY));
    this.gamepad = new Gamepad();
    this.input = new Input({ keyboard: this.keyboard, mouse: this.mouse, gamepad: this.gamepad });
    this.timer = new Timer();
    this.audio = new Audio();
  }

  setScaling(config: CanvasConfig): void {
    this.engine.setScaling(config);
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.scene.load?.();
  }

  async start(scene: Scene) {
    this.setScene(scene);
    this.engine.setDeps({ graphics: this.graphics, input: this.input, timer: this.timer, audio: this.audio, keyboard: this.keyboard, mouse: this.mouse, gamepad: this.gamepad });
    await this.gamepad.init();
    
    this.engine.start((event: Like2DEvent) => {
      // 1. handleEvent runs first
      this.scene?.handleEvent?.(event);

      // 2. Direct handlers
      const handler = this.scene?.[event.type as keyof Scene] as Function | undefined;
      if (handler) {
        handler.apply(this.scene, event.args);
      }
    });
  }

  dispose(): void {
    this.engine.stop();
    this.engine.dispose();
    this.scene = null;
  }
}
