import type { Event } from './events';

export interface Scene {
  width: number;
  height: number;
  load?: () => void;
  update: (dt: number) => void;
  draw: () => void;
  handleEvent?: (event: Event) => void;
}
