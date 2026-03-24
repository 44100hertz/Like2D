import { LikeButton, nameToNumber, numberToName } from './gamepad-mapping';
import { EngineDispatch } from '../engine';

export type { LikeButton };

/** A selector for a gamepad. */
export type GamepadTarget = number | "any";

/** Internal class: Using it externally could result
 * in a gamepad being disconnected and still trying to maintain
 * its state.
 */
class GamepadState {
  public pressed: boolean[] = [];
  public justPressed: boolean[] = [];
  constructor(public index: number) {};

  update(dispatch: EngineDispatch) {
    const gp = navigator.getGamepads()[this.index]!;
    gp.buttons.forEach((bt, i) => {
      this.justPressed[i] = false;
      if (bt.pressed && !this.pressed[i]) {
        dispatch('gamepadpressed', [this.index, i, GamepadInternal.getButtonName(i)])
        this.justPressed[i] = true;
      } else if (!bt.pressed && this.pressed[i]) {
        dispatch('gamepadreleased', [this.index, i, GamepadInternal.getButtonName(i)])
      }
      this.pressed[i] = bt.pressed;
    });
  }

  clear() { this.pressed = [] }
}

/** LIKE Gamepad Wrapper
 * 
 *  - Allows events/callbacks to be sent from joy buttons
 *  - Can track if any gamepad has a button pressed.
 * 
 * # Examples
 * 
 * ### Binding events
 * ```ts
 * like.gamepadpressed = (idx: number, _num: number, button: string) => {
 *   console.log(`Button ${button} pressed on controller ${idx}`);
 * }
 * ```
 */
export class GamepadInternal {
  private gamepads = new Map<number, GamepadState>();
  private abort = new AbortController();

  constructor(private dispatch: EngineDispatch) {
    // Register event listeners
    window.addEventListener(
      "gamepadconnected",
      (ev: GamepadEvent) => {
        if (ev.gamepad.mapping == "standard") {
          console.log(`[Gamepad] Connected standard gamepad ${ev.gamepad.id}.`);
        } else {
          console.log(
            `[Gamepad] Connected non-standard gamepad ${ev.gamepad.id}. Consider remapping.`,
          );
        }
        console.log(
          `[Gamepad] buttons: ${ev.gamepad.buttons.length}, axes: ${ev.gamepad.axes.length}`,
        );
        this.gamepads.set(ev.gamepad.index, new GamepadState(ev.gamepad.index));
      },
      { signal: this.abort.signal },
    );
    window.addEventListener(
      "gamepaddisconnected",
      (ev: GamepadEvent) => {
        console.log(`[Gamepad] Disconnected ${ev.gamepad.id}`);
        this.gamepads.delete(ev.gamepad.index);
      },
      { signal: this.abort.signal },
    );
    window.addEventListener(
      "blur",
      () => {
        this.gamepads.forEach((gps) => gps.clear());
      },
      { signal: this.abort.signal },
    );
  }

  _update(): void {
    this.gamepads.forEach((gp) => gp.update(this.dispatch));
  }

  /** Check if a gamepad button is down. */
  isButtonDown(
    target: GamepadTarget,
    buttonRaw: number | LikeButton,
  ): boolean | undefined {
    const btn = GamepadInternal.getButtonNumber(buttonRaw);
    if (target == "any") {
      return this.gamepads.values().some((gp) => gp.pressed[btn]);
    } else {
      return this.gamepads.get(target)?.pressed[btn];
    }
  }

  /** Returns true for only one frame/update if a button is pressed.
   * Consider using `gamepadpressed` callback instead. */
  isButtonJustPressed(
    target: GamepadTarget,
    buttonRaw: number | LikeButton,
  ): boolean | undefined {
    const btn = GamepadInternal.getButtonNumber(buttonRaw);
    if (target == "any") {
      return this.gamepads.values().some((gp) => gp.justPressed[btn]);
    } else {
      return this.gamepads.get(target)?.justPressed[btn];
    }
  }

  /** Get a raw DOM gamepad object. */
  getGamepad(target: number): Gamepad | null {
    return navigator.getGamepads()?.[target] ?? null;
  }

  _dispose(): void {
    this.abort.abort();
  }

  public static getButtonName(button: number | LikeButton): LikeButton {
    return typeof button == "number"
      ? (numberToName.get(button) ?? `Button${button}`)
      : button;
  }

  public static getButtonNumber(button: number | LikeButton): number {
    return typeof button == "number"
      ? button
      : (nameToNumber.get(button) ?? Number(button.substring(6)));
  }
}

