import { getButtonName, getButtonIndex } from './gamepad-button-map.ts';
import { InputStateTracker } from './input-state.ts';

export { getButtonName, getButtonIndex };

export class Gamepad {
  private buttonTrackers = new Map<number, InputStateTracker<number>>();
  private connectedGamepads = new Set<number>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      this.connectedGamepads.add(e.gamepad.index);
      this.buttonTrackers.set(e.gamepad.index, new InputStateTracker<number>());
    });

    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      this.connectedGamepads.delete(e.gamepad.index);
      this.buttonTrackers.delete(e.gamepad.index);
    });

    window.addEventListener('blur', () => {
      for (const tracker of this.buttonTrackers.values()) {
        tracker.clear();
      }
    });
  }

  update(): { pressed: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string }>; released: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string }> } {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pressed: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string }> = [];
    const released: Array<{ gamepadIndex: number; buttonIndex: number; buttonName: string }> = [];

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (gamepad) {
        this.connectedGamepads.add(i);
        
        let tracker = this.buttonTrackers.get(i);
        if (!tracker) {
          tracker = new InputStateTracker<number>();
          this.buttonTrackers.set(i, tracker);
        }
        
        const pressedButtons = new Set<number>();
        for (let j = 0; j < gamepad.buttons.length; j++) {
          if (gamepad.buttons[j].pressed) {
            pressedButtons.add(j);
          }
        }
        
        const changes = tracker.update(pressedButtons);
        
        for (const buttonIndex of changes.justPressed) {
          pressed.push({ gamepadIndex: i, buttonIndex, buttonName: getButtonName(buttonIndex) });
        }
        for (const buttonIndex of changes.justReleased) {
          released.push({ gamepadIndex: i, buttonIndex, buttonName: getButtonName(buttonIndex) });
        }
      }
    }

    return { pressed, released };
  }

  isConnected(gamepadIndex: number): boolean {
    return this.connectedGamepads.has(gamepadIndex);
  }

  isButtonDown(gamepadIndex: number, buttonIndex: number): boolean {
    const tracker = this.buttonTrackers.get(gamepadIndex);
    return tracker ? tracker.isDown(buttonIndex) : false;
  }

  isButtonDownOnAny(buttonIndex: number): boolean {
    for (const tracker of this.buttonTrackers.values()) {
      if (tracker.isDown(buttonIndex)) {
        return true;
      }
    }
    return false;
  }

  getPressedButtons(gamepadIndex: number): Set<number> {
    const tracker = this.buttonTrackers.get(gamepadIndex);
    return tracker ? tracker.getCurrentState() : new Set();
  }

  getConnectedGamepads(): number[] {
    return Array.from(this.connectedGamepads);
  }
}

export const gamepad = new Gamepad();
export default gamepad;