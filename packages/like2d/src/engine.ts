import { Audio } from './core/audio';
import { Input } from './core/input';
import { Timer } from './core/timer';
import { Keyboard } from './core/keyboard';
import { Mouse } from './core/mouse';
import { Gamepad } from './core/gamepad';
import { newState, bindGraphics } from './core/graphics';
import type { Like2DEvent, EventType } from './core/events';
import type { PartialCanvasMode } from './core/canvas-config';
import type { Like } from './core/like';
import { CanvasManager } from './core/canvas-manager';

export type { CanvasMode, PartialCanvasMode } from './core/canvas-config';

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning = false;
  private lastTime = 0;
  private container: HTMLElement;
  private canvasManager: CanvasManager;
  private onEvent: ((event: Like2DEvent) => void) | null = null;

  // Public Like object with all systems - initialized in constructor
  readonly like: Like;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.border = '1px solid #ccc';
    this.canvas.style.display = 'block';

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;

    this.container = container;
    this.container.appendChild(this.canvas);
    this.canvasManager = new CanvasManager(this.canvas, this.container, this.ctx, { pixelResolution: null, fullscreen: false });

    // Create graphics state and bind it
    const gfxState = newState(this.ctx);
    const gfx = bindGraphics(gfxState);

    // Create all subsystems
    const audio = new Audio();
    const timer = new Timer();
    const keyboard = new Keyboard();
    const mouse = new Mouse((cssX, cssY) => this.canvasManager.transformMousePosition(cssX, cssY));
    const gamepad = new Gamepad();

    const input = new Input({ keyboard, mouse, gamepad });

    // Create the Like object with all systems
    this.like = {
      audio,
      timer,
      input,
      keyboard,
      mouse,
      gamepad,
      gfx,
      setMode: (m) => this.setMode(m),
      getMode: () => this.canvasManager.getMode(),
      getCanvasSize: () => [this.canvas.width, this.canvas.height],
    };

    // Set up input event handlers
    keyboard.onKeyEvent = (scancode, keycode, type) => {
      this.dispatchEvent(type === 'keydown' ? 'keypressed' : 'keyreleased', [scancode, keycode]);
    };

    mouse.onMouseEvent = (clientX, clientY, button, type) => {
      const [x, y] = this.canvasManager.transformMousePosition(clientX, clientY);
      const b = (button ?? 0) + 1;
      this.dispatchEvent(type === 'mousedown' ? 'mousepressed' : 'mousereleased', [x, y, b]);
    };

    gamepad.onButtonEvent = (gpIndex, buttonIndex, buttonName, pressed) => {
      this.dispatchEvent(pressed ? 'gamepadpressed' : 'gamepadreleased', [gpIndex, buttonIndex, buttonName]);
    };

    // Internal listener to forward resize events
    this.canvasManager.onResize = (size, pixelSize, fullscreen) => {
      this.dispatchEvent('resize', [size, pixelSize, fullscreen]);
    };

    // Listen for fullscreen changes to update mode
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
  }

  private handleFullscreenChange(): void {
    const mode = this.canvasManager.getMode();
    const isFullscreen = !!document.fullscreenElement;
    if (mode.fullscreen !== isFullscreen) {
      this.canvasManager.setMode({ ...mode, fullscreen: isFullscreen });
    }
  }

  setMode(mode: PartialCanvasMode): void {
    const currentMode = this.canvasManager.getMode();
    const mergedMode = { ...currentMode, ...mode };
    const needsFullscreenChange = mode.fullscreen !== undefined && mode.fullscreen !== currentMode.fullscreen;

    if (needsFullscreenChange) {
      if (mergedMode.fullscreen) {
        this.container.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen();
      }
    }

    this.canvasManager.setMode(mode);
  }

  private dispatchEvent<T extends EventType>(type: T, args: any): void {
    if (this.onEvent) {
      this.onEvent({ type, args, timestamp: performance.now() } as Like2DEvent);
    }
  }

  async start(onEvent: (event: Like2DEvent) => void) {
    this.onEvent = onEvent;
    this.isRunning = true;
    this.lastTime = performance.now();

    // Initialize gamepad
    await this.like.gamepad.init();

    const loop = () => {
      if (!this.isRunning) return;

      const currentTime = performance.now();
      const dt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      if (!this.like.timer.isSleeping()) {
        this.like.timer.update(dt);
        const inputEvents = this.like.input.update();
        inputEvents.pressed.forEach(action => this.dispatchEvent('actionpressed', [action]));
        inputEvents.released.forEach(action => this.dispatchEvent('actionreleased', [action]));
        this.dispatchEvent('update', [dt]);
      }

      this.dispatchEvent('draw', []);
      this.canvasManager.present();
      requestAnimationFrame(loop);
    };

    this.dispatchEvent('load', []);
    requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
  }

  dispose(): void {
    this.isRunning = false;
    this.like.keyboard.dispose();
    this.like.mouse.dispose();
    this.like.gamepad.dispose();
    this.canvasManager.dispose();
    if (this.canvas.parentNode === this.container) {
      this.container.removeChild(this.canvas);
    }
  }

  getCanvasSize(): [number, number] {
    return [this.canvas.width, this.canvas.height];
  }
}
