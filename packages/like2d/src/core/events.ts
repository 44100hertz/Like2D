// Only engine-dispatched events (lifecycle + actions)
// Input events are now native DOM types passed directly to callbacks

import type { Vector2 } from './vector2';

export const EVENT_NAMES = [
  'like2d:load',
  'like2d:update',
  'like2d:draw',
  'like2d:actionpressed',
  'like2d:actionreleased',
] as const;

export type EventName = typeof EVENT_NAMES[number];

export type BaseEvent = {
  type: EventName;
  timestamp: number;
};

// Engine-dispatched events only
export type LoadEvent = BaseEvent & {
  type: 'like2d:load';
};

export type UpdateEvent = BaseEvent & {
  type: 'like2d:update';
  dt: number;
};

export type DrawEvent = BaseEvent & {
  type: 'like2d:draw';
};

export type ActionPressedEvent = BaseEvent & {
  type: 'like2d:actionpressed';
  action: string;
};

export type ActionReleasedEvent = BaseEvent & {
  type: 'like2d:actionreleased';
  action: string;
};

export type ResizeEvent = {
  type: 'like2d:resize';
  size: Vector2;
  pixelSize: Vector2;
  wasFullscreen: boolean;
  fullscreen: boolean;
};

// Union of all engine events
export type Event =
  | LoadEvent
  | UpdateEvent
  | DrawEvent
  | ActionPressedEvent
  | ActionReleasedEvent;

// Type mapping for engine events only
export type EventMap = {
  'like2d:load': LoadEvent;
  'like2d:update': UpdateEvent;
  'like2d:draw': DrawEvent;
  'like2d:actionpressed': ActionPressedEvent;
  'like2d:actionreleased': ActionReleasedEvent;
};
