export class Keyboard {
  private pressedScancodes = new Set<string>();
  public onKeyEvent?: (scancode: string, keycode: string, type: 'keydown' | 'keyup') => void;

  // Event handler references for cleanup
  private keydownHandler: (e: globalThis.KeyboardEvent) => void;
  private keyupHandler: (e: globalThis.KeyboardEvent) => void;
  private blurHandler: () => void;

  constructor() {
    // Bind event handlers
    this.keydownHandler = this.handleKeyDown.bind(this);
    this.keyupHandler = this.handleKeyUp.bind(this);
    this.blurHandler = this.handleBlur.bind(this);

    // Register event listeners
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    window.addEventListener('blur', this.blurHandler);
  }

  private handleKeyDown(e: globalThis.KeyboardEvent): void {
    if (e.code) {
      this.pressedScancodes.add(e.code);
    }
    this.onKeyEvent?.(e.code, e.key, 'keydown');
  }

  private handleKeyUp(e: globalThis.KeyboardEvent): void {
    if (e.code) {
      this.pressedScancodes.delete(e.code);
    }
    this.onKeyEvent?.(e.code, e.key, 'keyup');
  }

  private handleBlur(): void {
    this.pressedScancodes.clear();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('blur', this.blurHandler);
    this.pressedScancodes.clear();
  }

  isDown(scancode: string): boolean {
    return this.pressedScancodes.has(scancode);
  }

  isAnyDown(...scancodes: string[]): boolean {
    return scancodes.some(code => this.pressedScancodes.has(code));
  }
}
