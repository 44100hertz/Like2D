import { EngineDispatch } from '../engine';
import { Vec2, type Vector2 } from '../math/vector2';
import { type MouseButton } from './events';

const mouseButtons = ["left", "middle", "right"] as const;
const numToButton = (i: number): MouseButton => mouseButtons[i];
type MouseMoveEvent = HTMLElementEventMap["like:mousemoved"];

/**
 * Mouse input handling. Bound to canvas. Emits relative movement when pointer locked.
 * Buttons: 1 = left, 2 = middle, 3 = right.
 */
export class Mouse {
  private pos: Vector2 = [0, 0];
  private lastPos: Vector2 = [0, 0];
  private buttons = new Set<MouseButton>();
  private cursorVisible = true;
  private abort = new AbortController();

  constructor(private canvas: HTMLCanvasElement, private dispatch: EngineDispatch) {
    this.canvas.addEventListener('like:mousemoved', this.handleMouseMove.bind(this) as any, { signal: this.abort.signal });
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), { signal: this.abort.signal });
    window.addEventListener('mouseup', this.handleMouseUp.bind(this), { signal: this.abort.signal });
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false, signal: this.abort.signal });
    this.canvas.addEventListener('mouseleave', () => this.buttons.clear(), { signal: this.abort.signal });
  }

  private handleMouseMove(e: MouseMoveEvent): void {
    if (this.isPointerLocked()) {
      /** In pointer-lock mode, simulate a real cursor bounded by the canvas. */
      this.pos = Vec2.clamp(Vec2.add(this.pos, e.detail.delta),
        [0, 0],
        e.detail.renderSize);
      this.dispatch('mousemoved', [this.pos, e.detail.delta]);
    } else {
      /** In non-pointer locked mode, calculate deltas ourselves. */
      this.pos = e.detail.pos;
      this.dispatch('mousemoved', [this.pos, Vec2.sub(this.pos, this.lastPos)]);
    }
    this.lastPos = this.pos;
  }

  private handleMouseDown(e: globalThis.MouseEvent): void {
    // hack: ignore right clicks because they cause a refocus
    if (!this.isPointerLocked() && e.button == 2) return;
    this.buttons.add(numToButton(e.button));
    this.dispatch('mousepressed', [[e.offsetX, e.offsetY], numToButton(e.button)]);
    this.canvas?.focus();
  }

  private handleMouseUp(e: globalThis.MouseEvent): void {
    this.buttons.delete(numToButton(e.button));
    this.dispatch('mousereleased', [[e.offsetX, e.offsetY], numToButton(e.button)]);
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
  }

  dispose(): void {
    this.abort.abort();
  }

  /** Mouse position, transformed to canvas pixels. */
  getPosition(): Vector2 {
    return this.pos;
  }

  /** Check if button is held. Button 1 = left, 2 = middle, 3 = right. */
  isDown(button: MouseButton): boolean {
    return this.buttons.has(button);
  }

  /** All currently held buttons. */
  getPressedButtons(): Set<MouseButton> {
    return new Set(this.buttons);
  }

  /** True when pointer is locked to canvas. */
  isPointerLocked(): boolean {
    return document.pointerLockElement !== null;
  }

  /** Lock or unlock pointer. When locked, mousemoved emits relative deltas. */
  lockPointer(locked: boolean): void {
    if (!this.canvas) return;

    if (locked && document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock();
    } else if (!locked && document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
  }

  /** Show or hide cursor. Unlike pointer lock, cursor can still leave canvas. */
  showCursor(visible: boolean): void {
    this.cursorVisible = visible;
    if (this.canvas) {
      this.canvas.style.cursor = visible ? 'auto' : 'none';
    }
  }

  /** Current cursor visibility state. */
  isCursorVisible(): boolean {
    return this.cursorVisible;
  }
}
