import type { Like2DEvent } from '../../core/events';
import type { Scene } from './scene';
import type { Graphics } from '../../core/graphics';

export type StartupSceneConfig = {
  nextScene: Scene;
  draw?: (g: Graphics, canvas: HTMLCanvasElement) => void;
};

function defaultDraw(g: Graphics, canvas: HTMLCanvasElement): void {
  g.print('white', 'Click to Start', [canvas.width / 2, canvas.height / 2], { align: 'center' });
}

export class StartupScene implements Scene {
  private started = false;

  constructor(
    private graphics: Graphics,
    private config: StartupSceneConfig,
    private onStart: () => void
  ) {
    this.graphics.setBackgroundColor('black');
  }

  draw(canvas: HTMLCanvasElement): void {
    (this.config.draw ?? defaultDraw)(this.graphics, canvas);
  }

  handleEvent(event: Like2DEvent): void {
    if (event.type === 'mousepressed' && !this.started) {
      this.started = true;
      this.onStart();
    }
  }
}
