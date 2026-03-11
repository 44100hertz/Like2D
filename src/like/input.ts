import keyboard from './keyboard.ts';
import mouse from './mouse.ts';
import gamepad from './gamepad.ts';
import { InputStateTracker } from './input-state.ts';
import { getButtonIndex } from './gamepad-button-map.ts';

export type InputType = 'keyboard' | 'mouse' | 'gamepad';

export interface InputBinding {
  type: InputType;
  code: string;
  gamepadIndex?: number; // For gamepad inputs, undefined means any gamepad
}

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

export class Input {
  private actionMap = new Map<string, InputBinding[]>();
  private actionStateTracker = new InputStateTracker<string>();

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

  update(): { 
    pressed: string[]; 
    released: string[]; 
    gamepadPressed: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string; rawButtonIndex: number }>; 
    gamepadReleased: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string; rawButtonIndex: number }>;
  } {
    const { pressed: gamepadPressed, released: gamepadReleased } = gamepad.update();

    const activeActions = new Set<string>();

    for (const [action] of this.actionMap) {
      if (this.isDown(action)) {
        activeActions.add(action);
      }
    }

    const { justPressed, justReleased } = this.actionStateTracker.update(activeActions);

    return { 
      pressed: justPressed, 
      released: justReleased,
      gamepadPressed,
      gamepadReleased,
    };
  }

  private parseInput(input: string): InputBinding {
    const normalized = input.trim();

    if (normalized.startsWith('Mouse')) {
      const buttonCode = normalized.replace('Mouse', '');
      return { type: 'mouse', code: buttonCode };
    }

    if (normalized.startsWith('GP')) {
      // Format: GP ButtonBottom, GP LB, GP RT, etc. - any gamepad
      // Format: GP0 ButtonBottom, GP1 LB, etc. - specific gamepad
      const rest = normalized.slice(2); // Remove "GP" prefix
      
      // Check if there's a gamepad index
      const match = rest.match(/^(\d+)\s+(.+)$/);
      if (match) {
        // Specific gamepad: GP0 ButtonBottom
        const gamepadIndex = parseInt(match[1], 10);
        const buttonName = match[2].trim();
        return { type: 'gamepad', code: buttonName, gamepadIndex };
      } else {
        // Any gamepad: GP ButtonBottom
        const buttonName = rest.trim();
        return { type: 'gamepad', code: buttonName };
      }
    }

    return { type: 'keyboard', code: normalized };
  }

  private isBindingActive(binding: InputBinding): boolean {
    switch (binding.type) {
      case 'keyboard':
        return keyboard.isDown(binding.code);
      case 'mouse': {
        const button = buttonMap[binding.code];
        if (button !== undefined) {
          return mouse.isDown(button);
        }
        return false;
      }
      case 'gamepad': {
        const buttonIndex = getButtonIndex(binding.code);
        if (buttonIndex !== undefined) {
          if (binding.gamepadIndex !== undefined) {
            // Check specific gamepad
            return gamepad.isButtonDown(binding.gamepadIndex, buttonIndex);
          } else {
            // Check any gamepad
            return gamepad.isButtonDownOnAny(buttonIndex);
          }
        }
        return false;
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

export const input = new Input();
export default input;
