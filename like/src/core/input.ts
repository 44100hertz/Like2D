import type { Keyboard } from './keyboard';
import type { Mouse } from './mouse';
import { GamepadTarget, LikeGamepad } from './gamepad';
import { InputStateTracker } from './input-state';
import { LikeButton } from './gamepad-mapping';
import { MouseButton } from './events';

export type InputType = InputBinding['type'];
export type InputBinding =
  | { type: 'keyboard'; scancode: string }
  | { type: 'mouse'; button: MouseButton }
  | { type: 'gamepad'; gamepad: GamepadTarget, button: number };

export class Input {
  private actionMap = new Map<string, InputBinding[]>();
  private actionStateTracker = new InputStateTracker<string>();
  private keyboard: Keyboard;
  private mouse: Mouse;
  private gamepad: LikeGamepad;

  constructor(deps: { keyboard: Keyboard; mouse: Mouse; gamepad: LikeGamepad }) {
    this.keyboard = deps.keyboard;
    this.mouse = deps.mouse;
    this.gamepad = deps.gamepad;
  }

  map(action: string, inputs: string[]): void {
    const bindings: InputBinding[] = inputs.map(input => this.parseInput(input));
    this.actionMap.set(action, bindings);
  }

  unmap(action: string): void {
    this.actionMap.delete(action);
    this.actionStateTracker.clear();
  }

  isDown(action: string): boolean {
    const bindings = this.actionMap.get(action);
    if (!bindings) return false;

    return bindings.some(binding => this.isBindingActive(binding));
  }

  justPressed(action: string): boolean {
    return this.actionStateTracker.justPressed(action);
  }

  justReleased(action: string): boolean {
    return this.actionStateTracker.justReleased(action);
  }

  update(): { pressed: string[]; released: string[] } {
    this.gamepad._update();

    const activeActions = new Set<string>();

    for (const [action] of this.actionMap) {
      if (this.isDown(action)) {
        activeActions.add(action);
      }
    }

    const { justPressed, justReleased } = this.actionStateTracker.update(activeActions);

    return { pressed: justPressed, released: justReleased };
  }

  private parseInput(input: string): InputBinding {
    const normalized = input.trim();

    if (normalized.startsWith('Mouse')) {
      const buttonCode = normalized.replace('Mouse', '');
      return { type: 'mouse', button: buttonCode as MouseButton };
    }

    if (normalized.startsWith('Button') || normalized.startsWith('DP')) {
      return {
        type: "gamepad",
        gamepad: 0,
        button: LikeGamepad.getButtonNumber(normalized as LikeButton),
      };
    }

    return { type: 'keyboard', scancode: normalized };
  }

  private isBindingActive(binding: InputBinding): boolean {
    switch (binding.type) {
      case 'keyboard':
        return this.keyboard.isDown(binding.scancode);
      case 'mouse':
        return this.mouse.isDown(binding.button);
      case 'gamepad': {
        return !!this.gamepad.isButtonDown(binding.gamepad, binding.button);
      }
      default:
        return false;
    }
  }

  clear(): void {
    this.actionMap.clear();
    this.actionStateTracker.clear();
  }
}