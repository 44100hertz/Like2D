export class Keyboard {
  private pressedKeys = new Set<string>();
  private pressedScancodes = new Set<string>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.pressedKeys.add(e.key);
      if (e.code) {
        this.pressedScancodes.add(e.code);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.key);
      if (e.code) {
        this.pressedScancodes.delete(e.code);
      }
    });

    window.addEventListener('blur', () => {
      this.pressedKeys.clear();
      this.pressedScancodes.clear();
    });
  }

  isDown(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  isScancodeDown(scancode: string): boolean {
    return this.pressedScancodes.has(scancode);
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
