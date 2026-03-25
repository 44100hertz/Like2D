// Friendlier names for the buttons.

import type { Vector2 } from "../math/vector2";

/**
 * ref: https://www.w3.org/TR/gamepad/#dfn-standard-gamepad
 * note: `num` is only the corresponding number on standard mapping above.
 *
 * The point of the mapping system is to apply that _or_ non-standard mappings,
 * Which are exceedingly common.
 */
const buttonMap = [
  { like: "ButtonBottom", num: 0 as number },
  { like: "ButtonRight", num: 1 },
  { like: "ButtonLeft", num: 2 },
  { like: "ButtonTop", num: 3 },

  { like: "ButtonL1", num: 4 },
  { like: "ButtonR1", num: 5 },
  { like: "ButtonL2", num: 6 },
  { like: "ButtonR2", num: 7 },

  { like: "ButtonMenuLeft", num: 8 },
  { like: "ButtonMenuRight", num: 9 },

  { like: "ButtonLeftStick", num: 10 },
  { like: "ButtonRightStick", num: 11 },

  { like: "DPadUp", num: 12 },
  { like: "DPadDown", num: 13 },
  { like: "DPadLeft", num: 14 },
  { like: "DPadRight", num: 15 },
] as const;

export type LikeButton = (typeof buttonMap)[number]["like"] | `Unknown${number}`;

export type GamepadMapping = {
  buttons: ButtonMapping;
  sticks: StickMapping[];
};

export type ButtonMapping = Map<number, LikeButton>;
export const standardButtonMapping = (): Map<number, LikeButton> =>
  new Map(buttonMap.map(({ like, num }) => [num, like]));

export type StickMapping = [StickAxisMapping, StickAxisMapping];
export type StickAxisMapping = { index: number; invert: boolean };

export const defaultMapping = (stickCount: number): GamepadMapping => ({
  buttons: new Map(),
  sticks: Array(stickCount / 2)
    .fill(0)
    .map((_, i) => [
      { index: i * 2, invert: false },
      { index: i * 2 + 1, invert: false },
    ]),
});

export const mapStick = (gp: Gamepad, mapping: StickMapping): Vector2 => {
  return mapping.map(
    (axis: StickAxisMapping) =>
      (axis.invert ? -1 : 1) * (gp.axes[axis.index] ?? 0),
  ) as Vector2;
};