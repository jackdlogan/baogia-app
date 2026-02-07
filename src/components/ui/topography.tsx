"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Orange palette matching TemplateOrange (#d45b0b), low opacity so not distracting */
const ORANGE_PALETTE = [
  "rgba(212, 91, 11, 0.1)",
  "rgba(232, 107, 26, 0.1)",
  "rgba(196, 74, 8, 0.1)",
  "rgba(245, 130, 50, 0.1)",
];

export interface TopographyProps {
  className?: string;
  /** Number of contour lines */
  lineCount?: number;
  /** Line color (e.g. "rgba(120,120,120,0.35)") */
  lineColor?: string;
  /** Fraction of lines (0–1) to draw in orange; 0 = none */
  orangeLineRatio?: number;
  /** Animation speed (higher = faster) */
  speed?: number;
  /** Line thickness */
  strokeWidth?: number;
}

/**
 * Topography background – animated contour lines (canvas-based, flows over time).
 * Renders only after mount; animation runs in requestAnimationFrame.
 */
export function Topography({
  className,
  lineCount = 20,
  lineColor = "rgba(120, 120, 120, 0.1)",
  orangeLineRatio = 0.25,
  speed = 1,
  strokeWidth = 1,
  ...props
}: TopographyProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof TopographyProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orangeIndicesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    setSize();

    let animationId: number;
    let tick = 0;

    const handleResize = () => {
      setSize();
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Pick which lines are orange (stable for the lifetime of this effect)
    const orangeCount = Math.max(0, Math.min(lineCount, Math.round(lineCount * orangeLineRatio)));
    const set = new Set<number>();
    const indices = Array.from({ length: lineCount }, (_, i) => i);
    for (let n = 0; n < orangeCount && indices.length > 0; n++) {
      const idx = Math.floor(Math.random() * indices.length);
      set.add(indices[idx]);
      indices.splice(idx, 1);
    }
    orangeIndicesRef.current = set;

    // Terrain height at (x, t) – time `t` makes the waves move
    const getHeight = (x: number, t: number) => {
      const scale = 0.003;
      return (
        Math.sin(x * scale * 2 + t) * 30 +
        Math.sin(x * scale * 3.7 + t * 0.7) * 20 +
        Math.sin(x * scale * 1.3 - t * 0.5) * 40 +
        Math.sin(x * scale * 5.1 + t * 1.2) * 10 +
        Math.sin(x * scale * 0.7 + t * 0.3) * 50
      );
    };

    const animate = () => {
      tick += 0.008 * speed;

      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const spacing = height / (lineCount - 1);
      const padding = 50;

      const orangeIndices = orangeIndicesRef.current;
      for (let i = 0; i < lineCount; i++) {
        ctx.strokeStyle = orangeIndices.has(i)
          ? ORANGE_PALETTE[i % ORANGE_PALETTE.length]
          : lineColor;
        const baseY = spacing * i;
        ctx.beginPath();
        let started = false;
        for (let x = -padding; x <= width + padding; x += 3) {
          const terrainHeight = getHeight(x + i * 100, tick);
          const y = baseY + terrainHeight;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [lineCount, lineColor, orangeLineRatio, speed, strokeWidth]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden print:hidden", className)}
      aria-hidden
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
