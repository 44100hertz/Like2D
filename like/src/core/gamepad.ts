import { LikeButton, nameToNumber, numberToName } from './gamepad-mapping';
import { EngineDispatch } from '../engine';

export type { LikeButton };

/** A selector for a gamepad. */
export type GamepadTarget = number;

export type ButtonTracker = {
  prev: Set<number>,
  current: Set<number>,
}

const newButtonTracker = (): ButtonTracker =>
  ({ prev: new Set(), current: new Set() })

/** LIKE Gamepad Wrapper
 * 
 *  - Allows events/callbacks to be sent from joy buttons
 *  - Extends stateful API with justPressed
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
export class LikeGamepad {
  private buttonTrackers = new Map<number, ButtonTracker>();
  private abort = new AbortController();

  constructor(private dispatch: EngineDispatch) {
    // Register event listeners
    window.addEventListener("gamepadconnected", (ev: GamepadEvent) => {
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
      this.buttonTrackers.set(ev.gamepad.index, newButtonTracker());
    });
    window.addEventListener("gamepaddisconnected", (ev: GamepadEvent) => {
      console.log(`[Gamepad] Disconnected ${ev.gamepad.id}`)
      this.buttonTrackers.delete(ev.gamepad.index);
    });
    window.addEventListener("blur", () =>
      this.buttonTrackers.forEach(({current, prev}) => { current.clear(); prev.clear(); }),
    );
  }

  _update(): void {
    const gamepads = navigator.getGamepads().filter((v) => v !== null);

    gamepads.forEach((domGp, gpIndex) => {
      const tracker = this.buttonTrackers.get(gpIndex);
      if (!tracker) return;

      const prev = tracker.current;
      tracker.current = new Set(
        domGp.buttons
          .map((btn, i) => (btn.pressed ? i : null))
          .filter((v) => v != null),
      );

      domGp.buttons.forEach((_,i) => {
        if (i > 15) return;
        if (tracker.prev.has(i) != tracker.current.has(i)) {
          this.dispatch(
            tracker.prev.has(i) ? "gamepadreleased" : "gamepadpressed",
            [gpIndex, i, LikeGamepad.getButtonName(i)!]
          )
        }
      })

      tracker.prev = prev;
    })
  }

  isButtonDown(target: GamepadTarget, buttonRaw: number | LikeButton): boolean | undefined {
    const btn = LikeGamepad.getButtonNumber(buttonRaw);
    return this.buttonTrackers.get(target)?.current.has(btn);
  }

  isButtonJustPressed(target: GamepadTarget, buttonRaw: LikeButton): boolean | undefined {
    const btn = LikeGamepad.getButtonNumber(buttonRaw);
    const bt = this.buttonTrackers.get(target);
    if (bt) {
      return !bt.prev.has(btn) && bt.current.has(btn);
    }
  }

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

