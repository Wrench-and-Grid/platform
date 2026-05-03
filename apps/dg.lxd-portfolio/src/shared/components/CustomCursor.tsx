/**
 * CustomCursor — replaces the native OS cursor on pointer-capable devices.
 *
 * Mounts only when both `(hover: hover)` and `(pointer: fine)` media queries
 * match AND the user has not requested reduced motion. Adds/removes the
 * `has-custom-cursor` class on `<html>` so CSS can hide the native cursor.
 *
 * Reads `data-cursor="<label>"` from the nearest ancestor element to display
 * a contextual label (e.g. "Press", "Open", "Portrait").
 */
import { type CSSProperties, useEffect, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  active: boolean;
  label: string;
};

const DEFAULT_STATE: CursorState = {
  x: 0,
  y: 0,
  visible: false,
  pressed: false,
  active: false,
  label: "",
};

/** Walks up the DOM from `target` to find the nearest `data-cursor` label. */
function getCursorLabel(target: EventTarget | null): string {
  if (!(target instanceof HTMLElement)) return "";

  const customTarget = target.closest<HTMLElement>("[data-cursor]");
  if (customTarget?.dataset.cursor) return customTarget.dataset.cursor;
  if (target.closest("button")) return "Press";
  if (target.closest("a")) return "Open";
  return "";
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursor, setCursor] = useState<CursorState>(DEFAULT_STATE);

  /** Determine whether the custom cursor should be active at all. */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      setEnabled(mediaQuery.matches && !motionQuery.matches);
    };

    syncEnabled();
    mediaQuery.addEventListener("change", syncEnabled);
    motionQuery.addEventListener("change", syncEnabled);

    return () => {
      mediaQuery.removeEventListener("change", syncEnabled);
      motionQuery.removeEventListener("change", syncEnabled);
    };
  }, []);

  /** Attach/detach pointer event listeners when `enabled` changes. */
  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCursor(DEFAULT_STATE);
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      setCursor((prev) => ({ ...prev, x: event.clientX, y: event.clientY, visible: true }));
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const label = getCursorLabel(event.target);
      setCursor((prev) => ({ ...prev, active: Boolean(label), label }));
    };

    const handlePointerLeave = () => {
      setCursor((prev) => ({ ...prev, visible: false, pressed: false, active: false, label: "" }));
    };

    const handlePointerDown = () => {
      setCursor((prev) => ({ ...prev, pressed: true }));
    };

    const handlePointerUp = () => {
      setCursor((prev) => ({ ...prev, pressed: false }));
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={[
        "custom-cursor",
        cursor.visible ? "is-visible" : "",
        cursor.active ? "is-active" : "",
        cursor.pressed ? "is-pressed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--cursor-x": `${cursor.x}px`, "--cursor-y": `${cursor.y}px` } as CSSProperties}
    >
      <div className="custom-cursor-pointer">
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path
            className="custom-cursor-pointer-shadow"
            d="M3.4 2.1L3.4 24.9L8.7 20.1L11.9 28.8L15.9 27L12.5 18.8L20.6 18.2L3.4 2.1Z"
          />
          <path
            className="custom-cursor-pointer-shape"
            d="M2.15 1.55L2.15 25.85L8.15 20.85L11.55 30.2L15.85 28.35L12.2 18.2L21.05 17.75L2.15 1.55Z"
          />
          <path
            className="custom-cursor-pointer-accent"
            d="M5.9 6.1L15.95 14.95L10.3 15.3L12.55 22.15L10.95 22.8L8.45 15.55L5.15 18.25L5.9 6.1Z"
          />
        </svg>
      </div>
      <div className="custom-cursor-ring" />
      <div className="custom-cursor-label">{cursor.label}</div>
    </div>
  );
}
