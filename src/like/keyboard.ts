export class Keyboard {
  private pressedKeys = new Set<string>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.pressedKeys.add(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.key);
    });

    window.addEventListener('blur', () => {
      this.pressedKeys.clear();
    });
  }

  isDown(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  isScancodeDown(scancode: string): boolean {
    return this.pressedKeys.has(scancode);
  }

  isAnyDown(...keys: string[]): boolean {
    return keys.some(key => this.pressedKeys.has(key));
  }

  isAllDown(...keys: string[]): boolean {
    return keys.every(key => this.pressedKeys.has(key));
  }
}

export const keyboard = new Keyboard();
export default keyboard;
