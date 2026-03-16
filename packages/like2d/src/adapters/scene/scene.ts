import type { Event } from '../../core/events';

export type Scene = {
  load?(): void;
  update(dt: number): void;
  draw(): void;
  handleEvent?(event: Event): void;
};