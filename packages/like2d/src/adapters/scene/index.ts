import { Graphics } from '../../core/graphics';
import { Audio } from '../../core/audio';
import { Input } from '../../core/input';
import { Timer } from '../../core/timer';
import { Keyboard } from '../../core/keyboard';
import { Mouse } from '../../core/mouse';
import { Gamepad } from '../../core/gamepad';
import { Engine } from '../../engine';
import type { Event } from '../../core/events';
import type { Scene } from './scene';

export { Graphics, ImageHandle } from '../../core/graphics';
export { Audio } from '../../core/audio';
export { Input } from '../../core/input';
export { Timer } from '../../core/timer';
export { Keyboard } from '../../core/keyboard';
export { Mouse } from '../../core/mouse';
export { Gamepad, getButtonName } from '../../core/gamepad';
export type { Event } from '../../core/events';
export type { Scene } from './scene';
export type { Vector2 } from '../../core/vector2';
export { V2 } from '../../core/vector2';
export type { Rect } from '../../core/rect';
export { R } from '../../core/rect';

export class SceneRunner {
  private engine: Engine;
  private currentScene: Scene | null = null;
  
  // Expose the instances so the Scene can use them
  readonly graphics: Graphics;
  readonly audio: Audio;
  readonly timer: Timer;
  readonly input: Input;
  readonly keyboard: Keyboard;
  readonly mouse: Mouse;
  readonly gamepad: Gamepad;

  constructor(container: HTMLElement, width = 800, height = 600) {
    this.graphics = new Graphics();
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    this.gamepad = new Gamepad();
    this.input = new Input({ keyboard: this.keyboard, mouse: this.mouse, gamepad: this.gamepad });
    this.timer = new Timer();
    this.audio = new Audio();

    this.engine = new Engine(container, { 
      graphics: this.graphics, 
      input: this.input, 
      timer: this.timer, 
      audio: this.audio 
    });
    this.engine.setSize(width, height);

    // Wire up mouse to canvas for proper coordinate tracking
    this.mouse.setCanvas(this.engine.getCanvas());

    this.engine.onEvent((event: Event) => {
      if (!this.currentScene) return;

      switch (event.type) {
        case 'load':
          this.currentScene.load?.();
          break;
        case 'update':
          this.currentScene.update(event.dt);
          break;
        case 'draw':
          this.currentScene.draw();
          break;
        default:
          this.currentScene.handleEvent?.(event);
      }
    });
  }

  setScene(scene: Scene) {
    this.currentScene = scene;
    if (scene.width && scene.height) {
      this.engine.setSize(scene.width, scene.height);
    }
  }

  async start(
    scene: Scene,
    options: { showStartupScreen?: boolean; startupText?: string } = {}
  ) {
    const { showStartupScreen = true, startupText = 'Click to Start' } = options;

    this.setScene(scene);

    // Initialize gamepad
    await this.gamepad.init();

    // Start the engine with startup screen
    this.engine.start(undefined, undefined, { showStartupScreen, startupText });
  }
}