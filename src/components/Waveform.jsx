import { useEffect, useRef } from 'react';
import useEventStore from '../store/eventStore';

/* ── Cinematic EEG Neural Waveform Visualization (Futuristic Lab style) ── */
export default function Waveform({ height = 90 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const frameRef  = useRef(0);
  const { isRunning } = useEventStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      return rect.width;
    };

    let W = setupCanvas();

    const draw = () => {
      const frame = frameRef.current;
      const speed = isRunning ? 0.045 : 0.012;
      const logW  = canvas.getBoundingClientRect().width;
      if (logW !== W) { W = setupCanvas(); }

      ctx.clearRect(0, 0, W, height);

      // ── Draw grid line reference overlays (Medical HUD background) ──
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;
      // Center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(W, height / 2);
      ctx.stroke();

      // Horizontal auxiliary grid lines
      ctx.beginPath();
      ctx.moveTo(0, height * 0.15);
      ctx.lineTo(W, height * 0.15);
      ctx.moveTo(0, height * 0.85);
      ctx.lineTo(W, height * 0.85);
      ctx.stroke();

      // ── 1. Elegant Continuous Flowing EEG Brainwave Curve (Baseline) ──
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 229, 255, ${isRunning ? 0.7 : 0.4})`;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = isRunning ? 14 : 6;
      ctx.shadowColor = '#00E5FF';

      for (let x = 0; x < W; x += 1.5) {
        const t = frame * speed;
        // Bio-electrical neural wave harmonics
        const alpha = Math.sin(t + x * 0.022) * 0.34;
        const beta  = Math.sin(t * 2.3 + x * 0.045) * 0.16;
        const delta = Math.cos(t * 0.65 + x * 0.008) * 0.22;
        const theta = Math.sin(t * 3.8 + x * 0.09) * 0.04; // minor electrical jitter

        const amp = isRunning ? (alpha + beta + delta + theta) : (alpha + beta + delta) * 0.35;
        const y = height / 2 + amp * height * 0.65;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // ── 2. High-Density Ultra-Thin Holographic Pulse Tick Bars ──
      const barCount = 76;
      const barW = W / barCount;
      ctx.save();
      
      for (let i = 0; i < barCount; i++) {
        const t   = frame * speed;
        const f1  = Math.sin(t * 0.8 + i * 0.36) * 0.35;
        const f2  = Math.sin(t * 2.1 + i * 0.24) * 0.20;
        const f3  = Math.cos(t * 0.5 + i * 0.72) * 0.15;
        
        const raw = Math.abs(f1 + f2 + f3);
        const amp = isRunning ? Math.min(1, raw * 1.15 + 0.06) : raw * 0.42 + 0.08;
        const barH = amp * height * 0.75;
        const x = i * barW + (barW - 1.5) / 2;
        const y = (height - barH) / 2;

        // Custom gradient for each thin ticker line to look holographic
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.85)');
        grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.4)');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0.15)');

        ctx.shadowBlur = isRunning ? 8 : 4;
        ctx.shadowColor = '#00E5FF';
        ctx.fillStyle = grad;

        // Draw super thin elegant clinical pulse bars (1.5px wide)
        ctx.fillRect(x, y, 1.5, barH);
      }
      ctx.restore();

      frameRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(() => { W = setupCanvas(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [isRunning, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
}
