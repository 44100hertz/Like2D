import type { CanvasConfig } from './canvas-config';
import { V2, type Vector2 } from './vector2';
import type { ResizeEvent } from './events';

export type ResizeCallback = (event: Omit<ResizeEvent, 'timestamp'>) => void;

export class CanvasManager {
  private resizeObserver: ResizeObserver | null = null;
  private pixelArtCanvas: HTMLCanvasElement | null = null;
  private pixelArtCtx: CanvasRenderingContext2D | null = null;
  private emitResize: ResizeCallback | null = null;
  private wasFullscreen = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    private ctx: CanvasRenderingContext2D,
    private config: CanvasConfig = { mode: 'native' }
  ) {
    this.resizeObserver = new ResizeObserver(() => this.applyConfig());
    this.resizeObserver.observe(this.container);

    window.addEventListener('resize', () => this.applyConfig());
    document.addEventListener('fullscreenchange', () => this.applyConfig());

    this.applyConfig();
  }

  setResizeCallback(callback: ResizeCallback): void {
    this.emitResize = callback;
  }

  setConfig(config: CanvasConfig): void {
    if (this.isPixelArtMode(this.config) && !this.isPixelArtMode(config)) {
      if (this.pixelArtCanvas?.parentElement) {
        this.pixelArtCanvas.parentElement.removeChild(this.pixelArtCanvas);
      }
    }
    this.config = config;
    this.applyConfig();
  }

  getConfig(): CanvasConfig {
    return { ...this.config };
  }

  private isPixelArtMode(config: CanvasConfig): boolean {
    return config.mode === 'fixed' && !!(config as { pixelArt?: boolean }).pixelArt;
  }

  private applyConfig(): void {
    const containerSize: Vector2 = document.fullscreenElement
      ? [document.fullscreenElement.clientWidth, document.fullscreenElement.clientHeight]
      : [this.container.clientWidth, this.container.clientHeight];

    switch (this.config.mode) {
      case 'fixed':
        this.applyFixedMode(containerSize);
        break;
      case 'scaled':
        this.applyScaledOrNativeMode('scaled', containerSize);
        break;
      case 'native':
        this.applyScaledOrNativeMode('native', containerSize);
        break;
    }

    const pixelSize: Vector2 = this.isPixelArtMode(this.config) && this.pixelArtCanvas
      ? [this.pixelArtCanvas.width, this.pixelArtCanvas.height]
      : [this.canvas.width, this.canvas.height];

    const isFullscreen = !!document.fullscreenElement;

    this.emitResize?.({
      type: 'resize',
      size: containerSize,
      pixelSize,
      wasFullscreen: this.wasFullscreen,
      fullscreen: isFullscreen,
    });

    this.wasFullscreen = isFullscreen;
  }

  private applyFixedMode(csize: Vector2): void {
    const { size: gameSize, pixelArt } = this.config as { mode: 'fixed'; size: Vector2; pixelArt?: boolean };
    const scale = Math.min(csize[0] / gameSize[0], csize[1] / gameSize[1]);

    if (pixelArt && scale > 1) {
      const intScale = Math.floor(scale);

      if (!this.pixelArtCanvas) {
        this.pixelArtCanvas = document.createElement('canvas');
        this.pixelArtCtx = this.pixelArtCanvas.getContext('2d');
      }

      const pacSize = V2.mul(gameSize, intScale);
      this.pixelArtCanvas.width = pacSize[0];
      this.pixelArtCanvas.height = pacSize[1];

      this.canvas.width = gameSize[0];
      this.canvas.height = gameSize[1];
      this.canvas.style.display = 'none';

      const pac = this.pixelArtCanvas;
      const displaySize = V2.mul(gameSize, scale);

      pac.style.width = `${displaySize[0]}px`;
      pac.style.height = `${displaySize[1]}px`;
      pac.style.maxWidth = '100%';
      pac.style.maxHeight = '100%';
      pac.style.imageRendering = 'auto';
      pac.style.position = 'absolute';
      pac.style.left = '50%';
      pac.style.top = '50%';
      pac.style.transform = 'translate(-50%, -50%)';

      if (pac.parentElement !== this.container) {
        this.container.appendChild(pac);
      }
    } else {
      if (this.pixelArtCanvas?.parentElement) {
        this.pixelArtCanvas.parentElement.removeChild(this.pixelArtCanvas);
      }
      this.canvas.width = gameSize[0];
      this.canvas.height = gameSize[1];
      this.canvas.style.display = 'block';
      const displaySize = V2.mul(gameSize, scale);
      this.canvas.style.width = `${displaySize[0]}px`;
      this.canvas.style.height = `${displaySize[1]}px`;
      this.canvas.style.imageRendering = pixelArt ? 'pixelated' : 'auto';
      this.ctx.imageSmoothingEnabled = !pixelArt;
      this.canvas.style.position = 'absolute';
      this.canvas.style.left = '50%';
      this.canvas.style.top = '50%';
      this.canvas.style.transform = 'translate(-50%, -50%)';
    }
  }

  private applyScaledOrNativeMode(mode: 'scaled' | 'native', csize: Vector2): void {
    if (this.pixelArtCanvas?.parentElement) {
      this.pixelArtCanvas.parentElement.removeChild(this.pixelArtCanvas);
    }

    const pixelRatio = window.devicePixelRatio || 1;
    const gameSize: Vector2 = mode === 'scaled'
      ? (this.config as { size: Vector2 }).size
      : csize;

    const canvasSize = V2.mul(csize, pixelRatio);
    this.canvas.width = Math.floor(canvasSize[0]);
    this.canvas.height = Math.floor(canvasSize[1]);
    this.canvas.style.width = `${csize[0]}px`;
    this.canvas.style.height = `${csize[1]}px`;

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.transform = 'none';
    this.canvas.style.margin = '0';
    this.canvas.style.display = 'block';
    this.canvas.style.imageRendering = 'auto';

    if (mode === 'scaled') {
      const scale = Math.min(this.canvas.width / gameSize[0], this.canvas.height / gameSize[1]);
      const scaledGame = V2.mul(gameSize, scale);
      const offset = V2.mul(V2.sub([this.canvas.width, this.canvas.height], scaledGame), 0.5);
      this.ctx.setTransform(scale, 0, 0, scale, offset[0], offset[1]);
      // Store base transform for graphics.resetTransform()
      (this.ctx as any).__baseTransform = { scale, offsetX: offset[0], offsetY: offset[1] };
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      delete (this.ctx as any).__baseTransform;
    }
  }

  dispose(): void {
    this.resizeObserver?.disconnect();
    if (this.pixelArtCanvas?.parentElement) {
      this.pixelArtCanvas.parentElement.removeChild(this.pixelArtCanvas);
    }
    this.pixelArtCanvas = null;
    this.pixelArtCtx = null;
    this.emitResize = null;
  }

  present(): void {
    if (!this.isPixelArtMode(this.config) || !this.pixelArtCanvas || !this.pixelArtCtx) {
      return;
    }

    this.pixelArtCtx.imageSmoothingEnabled = false;
    this.pixelArtCtx.drawImage(
      this.canvas,
      0, 0, this.canvas.width, this.canvas.height,
      0, 0, this.pixelArtCanvas.width, this.pixelArtCanvas.height
    );
  }

  /**
   * Get the canvas element that's currently being displayed.
   * In pixel art mode, this returns the pixel art canvas (not the main canvas).
   */
  getDisplayCanvas(): HTMLCanvasElement {
    if (this.isPixelArtMode(this.config) && this.pixelArtCanvas) {
      return this.pixelArtCanvas;
    }
    return this.canvas;
  }

  /**
   * Transform mouse coordinates from CSS pixels to game/internal resolution.
   * Accounts for scaling, letterboxing, and different canvas modes.
   */
  transformMousePosition(cssX: number, cssY: number): Vector2 {
    const targetCanvas = this.getDisplayCanvas();
    const rect = targetCanvas.getBoundingClientRect();
    
    // Get position relative to the canvas element
    const relativeX = cssX - rect.left;
    const relativeY = cssY - rect.top;
    
    switch (this.config.mode) {
      case 'fixed': {
        // Fixed mode: direct scaling from CSS pixels to internal resolution
        const scaleX = targetCanvas.width / rect.width;
        const scaleY = targetCanvas.height / rect.height;
        return [
          relativeX * scaleX,
          relativeY * scaleY
        ];
      }
      
      case 'scaled': {
        const { size: gameSize } = this.config as { mode: 'scaled'; size: Vector2 };
        const pixelRatio = window.devicePixelRatio || 1;
        const containerSize: Vector2 = document.fullscreenElement
          ? [document.fullscreenElement.clientWidth, document.fullscreenElement.clientHeight]
          : [this.container.clientWidth, this.container.clientHeight];
        
        // Calculate the same scale factor used in applyScaledOrNativeMode
        const canvasSize = V2.mul(containerSize, pixelRatio);
        const scale = Math.min(canvasSize[0] / gameSize[0], canvasSize[1] / gameSize[1]);
        const scaledGame = V2.mul(gameSize, scale);
        const offset = V2.mul(V2.sub(canvasSize, scaledGame), 0.5);
        
        // Convert CSS pixels to canvas pixels, then subtract offset and divide by scale
        const canvasX = relativeX * pixelRatio;
        const canvasY = relativeY * pixelRatio;
        
        return [
          (canvasX - offset[0]) / scale,
          (canvasY - offset[1]) / scale
        ];
      }
      
      case 'native':
      default: {
        // Native mode: direct pixel mapping
        const pixelRatio = window.devicePixelRatio || 1;
        return [
          relativeX * pixelRatio,
          relativeY * pixelRatio
        ];
      }
    }
  }
}
