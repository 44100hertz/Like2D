export class Timer {
  private lastFrameTime = 0;
  private currentDelta = 0;
  private frameCount = 0;
  private fps = 0;
  private lastFpsUpdate = 0;
  private fpsUpdateInterval = 1; // Update FPS every second
  private sleepUntil: number | null = null;

  update(currentTime: number): void {
    // Skip updates while sleeping
    if (this.sleepUntil !== null) {
      if (currentTime < this.sleepUntil) {
        return;
      }
      // Sleep period is over
      this.sleepUntil = null;
    }

    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
      this.lastFpsUpdate = currentTime;
      return;
    }

    this.currentDelta = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    this.frameCount++;

    // Update FPS calculation every second
    const timeSinceLastUpdate = (currentTime - this.lastFpsUpdate) / 1000;
    if (timeSinceLastUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round(this.frameCount / timeSinceLastUpdate);
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  getDelta(): number {
    return this.currentDelta;
  }

  getFPS(): number {
    return this.fps;
  }

  getTime(): number {
    return performance.now() / 1000;
  }

  isSleeping(): boolean {
    if (this.sleepUntil === null) return false;
    const currentTime = performance.now();
    if (currentTime < this.sleepUntil) {
      return true;
    }
    // Sleep period is over
    this.sleepUntil = null;
    return false;
  }

  sleep(duration: number): void {
    this.sleepUntil = performance.now() + (duration * 1000);
  }
}

export const timer = new Timer();
export default timer;
