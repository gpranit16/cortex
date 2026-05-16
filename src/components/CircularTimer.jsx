import { useEffect, useRef } from 'react';
import useEventStore, { ROUNDS } from '../store/eventStore';

/* ── Massive animated circular countdown ring ─────────────────── */
export default function CircularTimer() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const { currentRound, timeLeft, isRunning, isPaused } = useEventStore();

  const round     = ROUNDS[currentRound];
  const progress  = timeLeft / round.duration; // 1 → 0
  const colorMap  = {
    '#00E5FF': [0, 229, 255],
    '#8B5CF6': [139, 92, 246],
    '#3CF2C2': [60, 242, 194],
    '#F59E0B': [245, 158, 11],
    '#FF4D6D': [255, 77, 109],
  };
  const [r, g, b] = colorMap[round.color] || [0, 229, 255];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const SIZE  = 320;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const t  = frame * 0.02;
      const p  = timeLeft / round.duration;

      // ── outer rotating dashes ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.4);
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const fade  = Math.sin(angle - t * 2) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * 148, Math.sin(angle) * 148,
          1.5, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(${r},${g},${b},${fade * 0.5})`;
        ctx.fill();
      }
      ctx.restore();

      // ── inner rotating ring ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── track ──
      ctx.beginPath();
      ctx.arc(cx, cy, 130, -Math.PI / 2, Math.PI * 1.5);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.08)`;
      ctx.lineWidth   = 14;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // ── main progress arc ──
      const endAngle = -Math.PI / 2 + p * Math.PI * 2;
      const grad     = ctx.createLinearGradient(cx - 130, cy, cx + 130, cy);
      grad.addColorStop(0,   `rgba(${r},${g},${b},1)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},0.8)`);
      grad.addColorStop(1,   `rgba(139,92,246,0.9)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 130, -Math.PI / 2, endAngle, false);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 14;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = isRunning ? 24 + Math.sin(t * 3) * 8 : 14;
      ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // ── pulse tip dot ──
      const tipX = cx + Math.cos(endAngle) * 130;
      const tipY = cy + Math.sin(endAngle) * 130;
      const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 16);
      tipGlow.addColorStop(0,   `rgba(${r},${g},${b},0.9)`);
      tipGlow.addColorStop(0.5, `rgba(${r},${g},${b},0.4)`);
      tipGlow.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(tipX, tipY, 16, 0, Math.PI * 2);
      ctx.fillStyle = tipGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.shadowBlur  = 12;
      ctx.shadowColor = `rgba(${r},${g},${b},1)`;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // ── center glow ──
      const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      center.addColorStop(0,   `rgba(${r},${g},${b},${0.06 + Math.sin(t * 2) * 0.02})`);
      center.addColorStop(0.6, `rgba(${r},${g},${b},0.02)`);
      center.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fillStyle = center;
      ctx.fill();

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [currentRound, timeLeft, isRunning, round.duration]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  return (
    <div style={{ position: 'relative', width: 320, height: 320 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {/* Center overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <div style={{
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-hud)',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          {round.label}
        </div>
        <div
          className="glow-cyan"
          style={{
            fontSize: timeLeft >= 3600 ? '2.4rem' : '3.2rem',
            fontFamily: 'var(--font-hud)',
            fontWeight: 700,
            color: round.color,
            letterSpacing: '0.06em',
            lineHeight: 1,
            textShadow: `0 0 20px ${round.color}80, 0 0 40px ${round.color}40`,
          }}
        >
          {formatTime(timeLeft)}
        </div>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-hud)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginTop: 2,
        }}>
          {isRunning ? '● LIVE' : isPaused ? '⏸ PAUSED' : '■ READY'}
        </div>
        <div style={{
          width: 48,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${round.color}, transparent)`,
          marginTop: 6,
          borderRadius: 1,
        }} />
        <div style={{
          fontSize: '0.58rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
        }}>
          {Math.round((1 - timeLeft / round.duration) * 100)}% ELAPSED
        </div>
      </div>
    </div>
  );
}
