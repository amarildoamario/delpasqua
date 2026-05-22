"use client";

import { RefObject, useEffect } from "react";

export function useScrollTextReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const root = rootRef.current;
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-text]"));
    if (elements.length === 0) return;

    elements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translate3d(0, 26px, 0)";
      element.style.filter = "blur(6px)";
      element.style.willChange = "transform, opacity, filter";
      element.style.setProperty("--reveal-delay", `${index * 90}ms`);
    });

    let animated = false;
    const animateIn = () => {
      if (animated) return;
      animated = true;

      elements.forEach((element) => {
        const delay = Number.parseInt(element.style.getPropertyValue("--reveal-delay"), 10) || 0;
        element.animate(
          [
            { opacity: 0, transform: "translate3d(0, 26px, 0)", filter: "blur(6px)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
          ],
          {
            duration: 820,
            delay,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animateIn();
        observer.disconnect();
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, [rootRef]);
}
