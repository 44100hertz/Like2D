import { Engine } from '../../engine';
import type { Scene } from './scene';
import { StartupScene } from './startup-scene';
import type { Like2DEvent } from '../../core/events';

export { StartupScene };
export type { Scene };

// Default handler that routes events to scene methods
export function createDefaultHandler(scene: Scene, like: Engine['like']): (event: Like2DEvent) => void {
  return (event) => {
    scene.handleEvent?.(like, event);
    const method = scene[event.type as keyof Scene] as Function | undefined;
    if (method) method.call(scene, like, ...event.args as any);
  };
}

export class SceneRunner {
  private engine: Engine;
  private scene: Scene | null = null;

  constructor(container: HTMLElement) {
    this.engine = new Engine(container);
  }

  get like() {
    return this.engine.like;
  }

  setScene(scene: Scene) {
    this.scene = scene;
    scene.load?.(this.engine.like);
  }

  handleEvent = (event: Like2DEvent): void => {
    if (!this.scene) return;
    this.scene.handleEvent?.(this.engine.like, event);
    const method = this.scene[event.type as keyof Scene] as Function | undefined;
    if (method) method.call(this.scene, this.engine.like, ...event.args as any);
  };

  async start(scene: Scene) {
    this.setScene(scene);
    await this.engine.start(this.handleEvent);
  }

  dispose() {
    this.engine.dispose();
    this.scene = null;
  }
}
