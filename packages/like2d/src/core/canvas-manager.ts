import type { CanvasConfig } from './canvas-config';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private ctx: CanvasRenderingContext2D;
  private config: CanvasConfig;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    ctx: CanvasRenderingContext2D,
    config: CanvasConfig = { mode: 'native' }
  ) {
    this.canvas = canvas;
    this.container = container;
    this.ctx = ctx;
    this.config = config;

    this.setupResizeObserver();
    this.applyConfig();
  }

  setConfig(config: CanvasConfig): void {
    this.config = config;
    this.applyConfig();
  }

  getConfig(): CanvasConfig {
    return { ...this.config };
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.applyConfig();
    });
    this.resizeObserver.observe(this.container);
  }

  private applyConfig(): void {
    const rect = this.container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    switch (this.config.mode) {
      case 'fixed':
        this.applyFixedMode(containerWidth, containerHeight);
        break;
      case 'scaled':
        this.applyScaledMode(containerWidth, containerHeight);
        break;
      case 'native':
        this.applyNativeMode(containerWidth, containerHeight);
        break;
    }
  }

  private applyFixedMode(containerWidth: number, containerHeight: number): void {
    const { width: gameWidth, height: gameHeight, pixelArt } = this.config as { mode: 'fixed'; width: number; height: number; pixelArt?: boolean };

    // Set internal resolution
    this.canvas.width = gameWidth;
    this.canvas.height = gameHeight;

    // Calculate scale to fit while preserving aspect ratio
    const scaleX = containerWidth / gameWidth;
    const scaleY = containerHeight / gameHeight;
    const scale = Math.min(scaleX, scaleY);

    // For pixel art: use two-step scaling
    // Step 1: sharp integer scaling to largest integer multiple
    // Step 2: linear scaling for the remainder
    if (pixelArt && scale > 1) {
      const integerScale = Math.floor(scale);
      const cssScale = scale / integerScale;
      
      // Create an offscreen canvas for the sharp-scaled version
      const sharpCanvas = document.createElement('canvas');
      sharpCanvas.width = gameWidth * integerScale;
      sharpCanvas.height = gameHeight * integerScale;
      const sharpCtx = sharpCanvas.getContext('2d')!;
      sharpCtx.imageSmoothingEnabled = false;
      
      // Draw the main canvas to sharp canvas at integer scale
      sharpCtx.drawImage(this.canvas, 0, 0, sharpCanvas.width, sharpCanvas.height);
      
      // Now apply CSS scaling with linear interpolation for the fractional part
      this.canvas.style.width = `${sharpCanvas.width * cssScale}px`;
      this.canvas.style.height = `${sharpCanvas.height * cssScale}px`;
      this.canvas.style.imageRendering = 'auto';
    } else {
      // Regular scaling
      this.canvas.style.width = `${gameWidth * scale}px`;
      this.canvas.style.height = `${gameHeight * scale}px`;
      this.canvas.style.imageRendering = pixelArt ? 'pixelated' : 'auto';
    }

    // Center the canvas
    this.canvas.style.marginLeft = 'auto';
    this.canvas.style.marginRight = 'auto';
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '50%';
    this.canvas.style.top = '50%';
    this.canvas.style.transform = 'translate(-50%, -50%)';
  }

  private applyScaledMode(containerWidth: number, containerHeight: number): void {
    const { width: gameWidth, height: gameHeight } = this.config as { mode: 'scaled'; width: number; height: number };
    const pixelRatio = window.devicePixelRatio || 1;

    // Set canvas pixel resolution to match container (with pixel ratio for sharpness)
    this.canvas.width = Math.floor(containerWidth * pixelRatio);
    this.canvas.height = Math.floor(containerHeight * pixelRatio);

    // Set CSS size to match container exactly
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.transform = 'none';
    this.canvas.style.margin = '0';

    // Calculate scale to fit game resolution into canvas while preserving aspect ratio
    const scaleX = this.canvas.width / gameWidth;
    const scaleY = this.canvas.height / gameHeight;
    const scale = Math.min(scaleX, scaleY);

    // Center the game area
    const gameWidthScaled = gameWidth * scale;
    const gameHeightScaled = gameHeight * scale;
    const offsetX = (this.canvas.width - gameWidthScaled) / 2;
    const offsetY = (this.canvas.height - gameHeightScaled) / 2;

    // Apply transform for scaling and centering
    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  }

  private applyNativeMode(containerWidth: number, containerHeight: number): void {
    const pixelRatio = window.devicePixelRatio || 1;

    // Set canvas to match container exactly
    this.canvas.width = Math.floor(containerWidth * pixelRatio);
    this.canvas.height = Math.floor(containerHeight * pixelRatio);

    // Set CSS size to match container exactly
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.transform = 'none';
    this.canvas.style.margin = '0';

    // Reset transform
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  dispose(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
