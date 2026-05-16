import { useEffect, useRef } from 'react';
import useEventStore, { ROUNDS } from '../store/eventStore';

/* ── Animated waveform bar reacting to timer ──────────────────── */
export default function Waveform({ barCount = 48, height = 56 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const frameRef  = useRef(0);
  const { isRunning, currentRound } = useEventStore();

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

    const colorSets = [
      ['#00E5FF', '#3CF2C2'],
      ['#8B5CF6', '#00E5FF'],
      ['#3CF2C2', '#8B5CF6'],
      ['#F59E0B', '#FF4D6D'],
      ['#FF4D6D', '#F59E0B'],
    ];
    const [c1, c2] = colorSets[currentRound % colorSets.length];

    const draw = () => {
      const frame  = frameRef.current;
      const speed  = isRunning ? 0.065 : 0.018;
      const logW   = canvas.getBoundingClientRect().width;
      if (logW !== W) { W = setupCanvas(); }

      ctx.clearRect(0, 0, W, height);

      const barW = W / barCount;

      for (let i = 0; i < barCount; i++) {
        const t   = frame * speed;
        const f1  = Math.sin(t + i * 0.38) * 0.45;
        const f2  = Math.sin(t * 1.9 + i * 0.22) * 0.28;
        const f3  = Math.cos(t * 0.6 + i * 0.7) * 0.15;
        const f4  = Math.sin(t * 3.1 + i * 1.1) * 0.08; // high-freq micro-jitter
        const raw = Math.abs(f1 + f2 + f3 + f4);
        const amp = isRunning ? raw * 0.88 + 0.06 : raw * 0.2 + 0.03;
        const barH   = amp * height;
        const x      = i * barW + barW * 0.18;
        const y      = (height - barH) / 2;
        const alpha  = isRunning ? 0.55 + raw * 0.45 : 0.28;

        // Gradient per bar
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, `${c1}${Math.round(alpha * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(1, `${c2}${Math.round(alpha * 0.5 * 255).toString(16).padStart(2,'0')}`);

        ctx.shadowBlur  = isRunning ? 6 + raw * 8 : 2;
        ctx.shadowColor = c1;
        ctx.fillStyle   = grad;

        const rr = Math.min(barW * 0.35, barH / 2, 3);
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barW * 0.64, barH, rr);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barW * 0.64, barH);
        }
      }

      ctx.shadowBlur = 0;
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
  }, [isRunning, currentRound, barCount, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
}
