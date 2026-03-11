import keyboard from './keyboard.ts';
import mouse from './mouse.ts';

export type InputType = 'keyboard' | 'mouse' | 'gamepad';

export interface InputBinding {
  type: InputType;
  code: string;
}

export class Input {
  private actionMap = new Map<string, InputBinding[]>();
  private prevState = new Map<string, boolean>();
  private currState = new Map<string, boolean>();

  map(action: string, inputs: string[]): void {
    const bindings: InputBinding[] = inputs.map(input => this.parseInput(input));
    this.actionMap.set(action, bindings);
  }

  unmap(action: string): void {
    this.actionMap.delete(action);
    this.prevState.delete(action);
    this.currState.delete(action);
  }

  isDown(action: string): boolean {
    const bindings = this.actionMap.get(action);
    if (!bindings) return false;

    return bindings.some(binding => this.isBindingActive(binding));
  }

  justPressed(action: string): boolean {
    const prev = this.prevState.get(action) ?? false;
    const curr = this.currState.get(action) ?? false;
    return !prev && curr;
  }

  justReleased(action: string): boolean {
    const prev = this.prevState.get(action) ?? false;
    const curr = this.currState.get(action) ?? false;
    return prev && !curr;
  }

  update(): { pressed: string[]; released: string[] } {
    const pressed: string[] = [];
    const released: string[] = [];

    for (const [action] of this.actionMap) {
      const prev = this.currState.get(action) ?? false;
      const curr = this.isDown(action);

      if (!prev && curr) {
        pressed.push(action);
      } else if (prev && !curr) {
        released.push(action);
      }

      this.prevState.set(action, prev);
      this.currState.set(action, curr);
    }

    return { pressed, released };
  }

  private parseInput(input: string): InputBinding {
    const normalized = input.trim();

    if (normalized.startsWith('Mouse')) {
      const buttonCode = normalized.replace('Mouse', '');
      return { type: 'mouse', code: buttonCode };
    }

    if (normalized.startsWith('Gamepad')) {
      return { type: 'gamepad', code: normalized };
    }

    return { type: 'keyboard', code: normalized };
  }

  private isBindingActive(binding: InputBinding): boolean {
    switch (binding.type) {
      case 'keyboard':
        return keyboard.isScancodeDown(binding.code);
      case 'mouse':
        const buttonMap: Record<string, number> = {
          'Left': 1,
          'Right': 3,
          'Middle': 2,
          '1': 1,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
        };
        const button = buttonMap[binding.code];
        if (button !== undefined) {
          return mouse.isDown(button);
        }
        return false;
      case 'gamepad':
        return false;
      default:
        return false;
    }
  }

  clear(): void {
    this.actionMap.clear();
    this.prevState.clear();
    this.currState.clear();
  }
}

export const input = new Input();
export default input;
