import { graphics } from './graphics';
import { audio } from './audio';
import { keyboard } from './keyboard';
import { mouse } from './mouse';
import { input } from './input';
import { gamepad } from './gamepad';
import { timer } from './timer';
import { Scene } from './scene';

class Like {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentScene: Scene | null = null;
  private isRunning = false;
  private lastTime = 0;
  private currentWidth = 800;
  private currentHeight = 600;

  graphics = graphics;
  audio = audio;
  keyboard = keyboard;
  mouse = mouse;
  input = input;
  gamepad = gamepad;
  timer = timer;

  constructor() {}

  async init(container: HTMLElement, width: number = 800, height: number = 600): Promise<void> {
    this.currentWidth = width;
    this.currentHeight = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.border = '1px solid #ccc';
    this.canvas.style.display = 'block';

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get 2D context');
    }
    
    graphics.setContext(this.ctx);
    mouse.setCanvas(this.canvas);

    container.appendChild(this.canvas);

    this.setupInputHandlers();

    // Initialize gamepad mapping database
    await gamepad.init();
  }

  toggleFullscreen(): void {
    if (!this.canvas) return;

    if (!document.fullscreenElement) {
      this.canvas.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  private setupInputHandlers(): void {
    window.addEventListener('keydown', (e) => {
      if (this.currentScene?.handleEvent) {
        this.currentScene.handleEvent({ type: 'keypressed', scancode: e.code, keycode: e.key });
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.currentScene?.handleEvent) {
        this.currentScene.handleEvent({ type: 'keyreleased', scancode: e.code, keycode: e.key });
      }
    });

    if (this.canvas) {
      this.canvas.addEventListener('mousedown', (e) => {
        if (this.currentScene?.handleEvent) {
          const rect = this.canvas!.getBoundingClientRect();
          this.currentScene.handleEvent({
            type: 'mousepressed',
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            button: e.button + 1
          });
        }
      });

      this.canvas.addEventListener('mouseup', (e) => {
        if (this.currentScene?.handleEvent) {
          const rect = this.canvas!.getBoundingClientRect();
          this.currentScene.handleEvent({
            type: 'mousereleased',
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            button: e.button + 1
          });
        }
      });
    }
  }

  setScene(scene: Scene): void {
    this.currentScene = scene;
    timer.resetSceneTime();

    if (this.canvas) {
      if (scene.width !== this.currentWidth || scene.height !== this.currentHeight) {
        this.currentWidth = scene.width;
        this.currentHeight = scene.height;
        this.canvas.width = scene.width;
        this.canvas.height = scene.height;
      }
    }

    if (this.isRunning && scene.load) {
      scene.load();
    }
  }

  start(scene: Scene): void {
    if (this.isRunning) return;
    
    this.setScene(scene);
    this.isRunning = true;
    
    if (this.currentScene?.load) {
      this.currentScene.load();
    }

    this.lastTime = performance.now();
    this.loop();
  }

  private loop(): void {
    if (!this.isRunning || !this.currentScene) return;

    const currentTime = performance.now();
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (timer.isSleeping()) {
      requestAnimationFrame(() => this.loop());
      return;
    }

    timer.update(dt);
    const { pressed, released, gamepadPressed, gamepadReleased } = input.update();

    // Trigger action callbacks
    if (this.currentScene?.handleEvent) {
      for (const action of pressed) {
        this.currentScene.handleEvent({ type: 'actionpressed', action });
      }
    }
    if (this.currentScene?.handleEvent) {
      for (const action of released) {
        this.currentScene.handleEvent({ type: 'actionreleased', action });
      }
    }

    // Trigger gamepad callbacks
    if (this.currentScene?.handleEvent) {
      for (const { gamepadIndex, buttonIndex, buttonName } of gamepadPressed) {
        this.currentScene.handleEvent({ type: 'gamepadpressed', gamepadIndex, buttonIndex, buttonName });
      }
    }
    if (this.currentScene?.handleEvent) {
      for (const { gamepadIndex, buttonIndex, buttonName } of gamepadReleased) {
        this.currentScene.handleEvent({ type: 'gamepadreleased', gamepadIndex, buttonIndex, buttonName });
      }
    }

    this.currentScene.update(dt);

    if (this.ctx) {
      graphics.clear();
      this.currentScene.draw();
    }

    requestAnimationFrame(() => this.loop());
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  getWidth(): number {
    return this.currentWidth;
  }

  getHeight(): number {
    return this.currentHeight;
  }
}

export const like = new Like();
export const love = like;
export { Source } from './audio';
export type { SourceOptions } from './audio';
export { timer } from './timer';
export type { Scene } from './scene';
export { ImageHandle } from './graphics';
export type { Color, Quad, ShapeProps, DrawProps, PrintProps } from './graphics';
export { input } from './input';
export { gamepad, getButtonName } from './gamepad';
export type { StickPosition } from './gamepad';
export type { Vector2 } from './vector2';
export { V2 } from './vector2';
export type { Rect } from './rect';
export { R } from './rect';
export type { Event } from './events';
