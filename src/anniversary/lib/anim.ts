import { useEffect, useRef, useState } from "react";

/** True when the user has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * Adds `data-revealed="true"` to the returned ref's element once it scrolls
 * into view. All the actual transition lives in CSS.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setTimeout(() => {
          el.dataset.revealed = "true";
        }, delayMs);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);
  return ref;
}

/**
 * 0 → 1 as the element travels through the viewport, written straight to a
 * CSS custom property so no React render happens per scroll frame.
 * Used to drive the red thread's stroke-dashoffset.
 */
export function useScrollProgress<T extends HTMLElement | SVGElement>(
  property = "--progress",
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty(property, "1");
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const span = height + innerHeight;
      const p = Math.min(1, Math.max(0, (innerHeight - top) / span));
      el.style.setProperty(property, p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [property]);
  return ref;
}
