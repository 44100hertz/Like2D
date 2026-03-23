
// Friendlier names for the buttons.
// https://www.w3.org/TR/gamepad/#dfn-standard-gamepad
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
  { like: "ButtonMenuCenter", num: 16 },

  { like: "ButtonLeftStick", num: 10 },
  { like: "ButtonRightStick", num: 11 },

  { like: "DPadUp", num: 12 },
  { like: "DPadDown", num: 13 },
  { like: "DPadLeft", num: 14 },
  { like: "DPadRight", num: 15 },
] as const;

type extraButton = `Button${number}`;

export type LikeButton = (typeof buttonMap)[number]["like"] | extraButton;

export const numberToName: Map<number, LikeButton> = new Map(
  buttonMap.map(({ like, num }) => [num, like]),
);
export const nameToNumber: Map<LikeButton, number> = new Map(
  buttonMap.map(({ like, num }) => [like, num]),
);