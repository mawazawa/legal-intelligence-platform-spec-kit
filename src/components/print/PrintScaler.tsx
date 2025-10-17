"use client";
import React, { useEffect, useRef, useState } from "react";

interface PrintScalerProps {
  children: React.ReactNode;
  targetPages?: number; // desired page count
  pageHeightIn?: number; // printable height in inches (defaults to 9in for 1in margins)
  className?: string;
}

export default function PrintScaler({
  children,
  targetPages = 10,
  pageHeightIn = 9, // Letter 11in - 2in margins
  className,
}: PrintScalerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const computeScale = () => {
    const host = hostRef.current;
    if (!host) return;

    // Create a 1in box to measure CSS px per inch
    const measure = document.createElement("div");
    measure.style.width = "1in";
    measure.style.height = "0";
    measure.style.padding = "0";
    measure.style.border = "0";
    host.appendChild(measure);
    const pxPerIn = measure.getBoundingClientRect().width || 96; // fallback 96dpi
    host.removeChild(measure);

    const printableHeightPx = pageHeightIn * pxPerIn * targetPages;
    // Use scrollHeight to include overflowing content
    const content = host.firstElementChild as HTMLElement | null;
    const contentHeight = content ? Math.max(content.scrollHeight, content.getBoundingClientRect().height) : host.scrollHeight;
    if (!contentHeight) return;

    const nextScale = Math.min(1, printableHeightPx / contentHeight);
    setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
  };

  useEffect(() => {
    // Recompute on resize and before print
    const onResize = () => computeScale();
    const onBeforePrint = () => computeScale();
    window.addEventListener("resize", onResize);
    window.addEventListener("beforeprint", onBeforePrint);
    computeScale();
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("beforeprint", onBeforePrint);
    };
  }, [targetPages, pageHeightIn]);

  // For screen preview, apply scaling in a wrapper; on print, the transform is honored
  return (
    <div ref={hostRef} className={className}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: scale !== 0 ? `${100 / scale}%` : undefined }}>
        {children}
      </div>
    </div>
  );
}

