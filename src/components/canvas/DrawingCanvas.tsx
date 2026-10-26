import React, { useRef, useEffect, useCallback } from 'react';
import type { Stroke, ToolType } from '../../types';

interface DrawingCanvasProps {
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[], dataUrl: string) => void;
  activeTool: ToolType;
  brushSize: number; // 1 to 20
  readOnly?: boolean;
  className?: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokes,
  onStrokesChange,
  activeTool,
  brushSize,
  readOnly = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Render all strokes onto the canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Warm paper fill
    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale for Retina/HiDPI
    ctx.scale(dpr, dpr);

    const allStrokes = [...strokes];
    if (currentStrokeRef.current) {
      allStrokes.push(currentStrokeRef.current);
    }

    allStrokes.forEach((stroke) => {
      if (!stroke.points || stroke.points.length === 0) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Base scaling relative to standard 800px width
      const scaleFactor = Math.max(0.6, width / 700);
      const computedSize = Math.max(1, stroke.size * scaleFactor);

      if (stroke.tool === 'eraser') {
        ctx.strokeStyle = '#FAF9F5';
        ctx.lineWidth = computedSize * 3;
      } else if (stroke.tool === 'pencil') {
        ctx.strokeStyle = 'rgba(40, 40, 38, 0.65)';
        ctx.lineWidth = Math.max(0.75, computedSize * 0.7);
      } else {
        // Pen
        ctx.strokeStyle = stroke.color || '#171717';
        ctx.lineWidth = computedSize;
      }

      ctx.beginPath();
      const first = stroke.points[0];
      const startX = first.x * width;
      const startY = first.y * height;

      if (stroke.points.length === 1) {
        // Single dot
        ctx.arc(startX, startY, (ctx.lineWidth || 2) / 2, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      } else if (stroke.points.length === 2) {
        ctx.moveTo(startX, startY);
        ctx.lineTo(stroke.points[1].x * width, stroke.points[1].y * height);
        ctx.stroke();
      } else {
        // Smooth curved interpolation
        ctx.moveTo(startX, startY);
        for (let i = 1; i < stroke.points.length - 1; i++) {
          const pt = stroke.points[i];
          const nextPt = stroke.points[i + 1];
          const midX = ((pt.x + nextPt.x) / 2) * width;
          const midY = ((pt.y + nextPt.y) / 2) * height;
          ctx.quadraticCurveTo(pt.x * width, pt.y * height, midX, midY);
        }
        const last = stroke.points[stroke.points.length - 1];
        ctx.lineTo(last.x * width, last.y * height);
        ctx.stroke();
      }

      ctx.restore();
    });
  }, [strokes]);

  // Adjust canvas buffer size based on container resize
  const updateCanvasDimensions = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);

    if (w <= 0 || h <= 0) return;
    if (sizeRef.current.width === w && sizeRef.current.height === h) return;

    sizeRef.current = { width: w, height: h };
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    redraw();
  }, [redraw]);

  // Set up ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateCanvasDimensions();

    const ro = new ResizeObserver(() => {
      updateCanvasDimensions();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [updateCanvasDimensions]);

  // Re-render when strokes or props change
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Export current canvas data URL
  const getCanvasDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }, []);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    currentStrokeRef.current = {
      tool: activeTool,
      color: activeTool === 'pen' ? '#171717' : activeTool === 'pencil' ? '#333333' : '#FAF9F5',
      size: brushSize,
      points: [{ x, y, pressure: e.pressure || 0.5 }],
    };

    redraw();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    currentStrokeRef.current.points.push({
      x,
      y,
      pressure: e.pressure || 0.5,
    });

    redraw();
  };

  const finishStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || readOnly) return;
    isDrawingRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const newStrokes = [...strokes, currentStrokeRef.current];
      currentStrokeRef.current = null;
      redraw();
      const dataUrl = getCanvasDataUrl();
      onStrokesChange(newStrokes, dataUrl);
    } else {
      currentStrokeRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-[#FAF9F5] ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
        onPointerLeave={finishStroke}
        className={`drawing-canvas w-full h-full block ${readOnly ? 'cursor-default' : activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
