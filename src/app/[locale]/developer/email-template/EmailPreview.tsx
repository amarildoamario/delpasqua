"use client";

import { useEffect, useRef, useState } from "react";

export default function EmailPreview({ html, title }: { html: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1100);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;

    function measure() {
      const body = frame?.contentDocument?.body;
      if (body) setHeight(Math.ceil(body.getBoundingClientRect().height));
    }

    function observe() {
      observer?.disconnect();
      const body = frame?.contentDocument?.body;
      if (!body) return;
      observer = new ResizeObserver(measure);
      observer.observe(body);
      measure();
    }

    frame.addEventListener("load", observe);
    observe();
    return () => {
      frame.removeEventListener("load", observe);
      observer?.disconnect();
    };
  }, [html]);

  return <iframe ref={frameRef} title={title} srcDoc={html} style={{ height }} scrolling="no" className="block w-full border-0" />;
}
