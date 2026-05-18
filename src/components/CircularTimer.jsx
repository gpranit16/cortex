import { useEffect, useRef } from 'react';
import useEventStore, { ROUNDS } from '../store/eventStore';

// Dynamic premium neural color interpolation
const getColorForProgress = (p) => {
  // Anchors:
  // p >= 0.7: Cyan [0, 229, 255] to Electric Blue [0, 100, 255]
  // p >= 0.4: Electric Blue [0, 100, 255] to Purple [139, 92, 246]
  // p >= 0.15: Purple [139, 92, 246] to Magenta [255, 0, 127]
  // p >= 0.05: Magenta [255, 0, 127] to Orange/Red [249, 115, 22]
  // p < 0.05: Orange/Red [249, 115, 22] to Intense Neural Red [255, 10, 30]

  if (p >= 0.7) {
    const factor = (p - 0.7) / 0.3; // 0 to 1
    return [
      0,
      Math.round(100 + (229 - 100) * factor),
      255
    ];
  } else if (p >= 0.4) {
    const factor = (p - 0.4) / 0.3; // 0 to 1
    return [
      Math.round(139 * (1 - factor)),
      Math.round(92 + (100 - 92) * factor),
      Math.round(246 * (1 - factor) + 255 * factor)
    ];
  } else if (p >= 0.15) {
    const factor = (p - 0.15) / 0.25; // 0 to 1
    return [
      Math.round(255 * (1 - factor) + 139 * factor),
      Math.round(0 * (1 - factor) + 92 * factor),
      Math.round(127 * (1 - factor) + 246 * factor)
    ];
  } else if (p >= 0.05) {
    const factor = (p - 0.05) / 0.10; // 0 to 1
    return [
      Math.round(249 * (1 - factor) + 255 * factor),
      Math.round(115 * (1 - factor) + 0 * factor),
      Math.round(22 * (1 - factor) + 127 * factor)
    ];
  } else {
    const factor = Math.max(0, p) / 0.05; // 0 to 1
    return [
      Math.round(255 * (1 - factor) + 249 * factor),
      Math.round(10 * (1 - factor) + 115 * factor),
      Math.round(30 * (1 - factor) + 22 * factor)
    ];
  }
};

/* ── Massive animated circular countdown ring with dynamic color/glow evolution ── */
export default function CircularTimer() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const { currentRound, timeLeft, isRunning, isPaused } = useEventStore();

  const round     = ROUNDS[currentRound];
  const progress  = Math.max(0, Math.min(1, timeLeft / round.duration)); // 1 → 0
  const [r, g, b] = getColorForProgress(progress);
  const currentColorStr = `rgb(${r}, ${g}, ${b})`;

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
      const p  = Math.max(0, Math.min(1, timeLeft / round.duration));
      
      // Dynamic speed/urgency multiplier based on percentage
      const speedMult = p >= 0.7 ? 1.0 : p >= 0.4 ? 1.4 : p >= 0.15 ? 2.0 : p >= 0.05 ? 3.0 : 4.5;
      const t = frame * 0.02 * (isRunning ? 1 : 0.3);

      const [cr, cg, cb] = getColorForProgress(p);
      const [rNext, gNext, bNext] = getColorForProgress(Math.max(0, p - 0.04));

      // ── outer rotating dashes (calm spin -> high speed centrifuge) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.4 * speedMult);
      const dashCount = p >= 0.15 ? 48 : 36;
      for (let i = 0; i < dashCount; i++) {
        const angle = (i / dashCount) * Math.PI * 2;
        const fade  = Math.sin(angle - t * 2 * speedMult) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * 148, Math.sin(angle) * 148,
          p < 0.15 ? 2.2 : 1.5, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${fade * (p < 0.15 ? 0.8 : 0.5)})`;
        ctx.fill();
      }
      ctx.restore();

      // ── inner rotating ring ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.7 * speedMult);
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${p < 0.15 ? 0.12 : 0.06})`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, p < 0.15 ? 4 : 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── track (remaining background ring) ──
      ctx.beginPath();
      ctx.arc(cx, cy, 130, -Math.PI / 2, Math.PI * 1.5);
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.08)`;
      ctx.lineWidth   = 14;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // ── main progress arc with evolving gradient ──
      const endAngle = -Math.PI / 2 + p * Math.PI * 2;
      const grad     = ctx.createLinearGradient(cx - 130, cy, cx + 130, cy);
      grad.addColorStop(0,   `rgba(${cr},${cg},${cb},1)`);
      grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.85)`);
      grad.addColorStop(1,   `rgba(${rNext},${gNext},${bNext},0.95)`);
      
      // Dynamic tension pulses and custom critical flicker on < 5%
      let shadowAmt = 15;
      if (isRunning) {
        if (p >= 0.7) {
          shadowAmt = 20 + Math.sin(t * 2.5) * 5;
        } else if (p >= 0.4) {
          shadowAmt = 26 + Math.sin(t * 4.0) * 8;
        } else if (p >= 0.15) {
          shadowAmt = 34 + Math.sin(t * 6.0) * 12;
        } else if (p >= 0.05) {
          shadowAmt = 42 + Math.sin(t * 9.0) * 16;
        } else {
          // Intense warning pulse with randomized critical laboratory flicker
          const flicker = Math.random() > 0.07 ? 1.0 : 0.35;
          shadowAmt = (50 + Math.sin(t * 15.0) * 20) * flicker;
        }
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 130, -Math.PI / 2, endAngle, false);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 14;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = shadowAmt;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},${p < 0.15 ? 0.95 : 0.8})`;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // ── pulse tip dot ──
      const tipX = cx + Math.cos(endAngle) * 130;
      const tipY = cy + Math.sin(endAngle) * 130;
      const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, p < 0.15 ? 22 : 16);
      tipGlow.addColorStop(0,   `rgba(${cr},${cg},${cb},0.95)`);
      tipGlow.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.45)`);
      tipGlow.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(tipX, tipY, p < 0.15 ? 22 : 16, 0, Math.PI * 2);
      ctx.fillStyle = tipGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tipX, tipY, p < 0.15 ? 7 : 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},1)`;
      ctx.shadowBlur  = p < 0.15 ? 18 : 12;
      ctx.shadowColor = `rgba(${cr},${cg},${cb},1)`;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // ── evolving center radial aura glow ──
      const auraBloom = p >= 0.7 ? 0.05 : p >= 0.4 ? 0.08 : p >= 0.15 ? 0.14 : p >= 0.05 ? 0.20 : 0.28;
      const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      center.addColorStop(0,   `rgba(${cr},${cg},${cb},${auraBloom + Math.sin(t * 3.5) * 0.03})`);
      center.addColorStop(0.6, `rgba(${cr},${cg},${cb},${auraBloom * 0.4})`);
      center.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
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
    <div className="circular-timer-container" style={{ position: 'relative', width: 'min(80vw, 320px)', height: 'min(80vw, 320px)', margin: '0 auto' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Center overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2%',
      }}>
        <div style={{
          fontSize: 'clamp(0.5rem, 2vw, 0.65rem)',
          letterSpacing: '0.25em',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-hud)',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          {round.label}
        </div>
        <div
          style={{
            fontSize: timeLeft >= 3600 ? 'clamp(1.8rem, 7vw, 2.4rem)' : 'clamp(2.2rem, 9vw, 3.2rem)',
            fontFamily: 'var(--font-hud)',
            fontWeight: 700,
            color: currentColorStr,
            letterSpacing: '0.06em',
            lineHeight: 1,
            textShadow: `0 0 20px rgba(${r},${g},${b},0.85), 0 0 40px rgba(${r},${g},${b},0.45)`,
            transition: 'color 0.4s ease, text-shadow 0.4s ease',
          }}
        >
          {formatTime(timeLeft)}
        </div>
        <div style={{
          fontSize: 'clamp(0.48rem, 1.8vw, 0.6rem)',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-hud)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginTop: '1%',
        }}>
          {isRunning ? '● LIVE' : isPaused ? '⏸ PAUSED' : '■ READY'}
        </div>
        <div style={{
          width: '20%',
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${currentColorStr}, transparent)`,
          marginTop: '2%',
          borderRadius: 1,
          transition: 'background 0.4s ease',
        }} />
        <div style={{
          fontSize: 'clamp(0.45rem, 1.6vw, 0.58rem)',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          marginTop: '1%',
        }}>
          {Math.round((1 - timeLeft / round.duration) * 100)}% ELAPSED
        </div>
      </div>
    </div>
  );
}
