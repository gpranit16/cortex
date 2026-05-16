import { motion } from 'framer-motion';
import useEventStore, { ROUNDS } from '../store/eventStore';

/* ── Top Header / HUD Bar ────────────────────────────────────── */
export default function Header({ time }) {
  const { currentRound, isRunning, isPaused } = useEventStore();
  const round = ROUNDS[currentRound];

  return (
    <header style={{
      position: 'relative',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      background: 'rgba(0,0,0,0.4)',
      borderBottom: '1px solid rgba(0,229,255,0.08)',
      backdropFilter: 'blur(10px)',
      flexShrink: 0,
    }}>
      {/* Left — Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1.5px solid rgba(0,229,255,0.5)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              position: 'absolute',
              inset: -2,
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '1px solid rgba(139,92,246,0.4)',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              position: 'absolute',
              inset: 0,
            }}
          />
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(139,92,246,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}>
            🧠
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-hud)',
            fontWeight: 800,
            letterSpacing: '0.25em',
            background: 'linear-gradient(90deg, var(--cyan), #fff, var(--violet))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}>
            CORTEX
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #fff, var(--cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'var(--font-hud)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}>
            IEEE EMBS BMSIT <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', marginLeft: 4 }}>— 2026</span>
          </div>
        </div>
      </div>

      {/* Center — Status Removed as requested */}
      <div style={{ flex: 1 }} />

      {/* Right — HUD stats */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <HUDPill label="ACTIVE ROUND" value={round.shortName} color={round.color} />
        <HUDPill label="SESSION" value={`${currentRound + 1} / ${ROUNDS.length}`} color="var(--violet)" />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'flex-end',
        }}>
          {['SYS','NET','AUD'].map((tag, i) => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: ['var(--mint)','var(--cyan)','var(--violet)'][i],
                boxShadow: `0 0 4px ${'var(--mint) var(--cyan) var(--violet)'.split(' ')[i]}`,
                animation: 'pulse-slow 2s ease-in-out infinite',
                animationDelay: `${i * 0.4}s`,
              }} />
              <span style={{
                fontSize: '0.48rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-dim)',
                letterSpacing: '0.1em',
              }}>
                {tag} ●
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom scan line */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
          opacity: 0.6,
        }}
        animate={{ width: ['0%', '100%', '0%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />
    </header>
  );
}

function StatusPill({ isRunning, isPaused, roundColor }) {
  const label = isRunning ? 'LIVE' : isPaused ? 'PAUSED' : 'STANDBY';
  const color = isRunning ? '#3CF2C2' : isPaused ? '#F59E0B' : 'var(--text-dim)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 12px',
      borderRadius: 20,
      background: isRunning ? 'rgba(60,242,194,0.1)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}40`,
    }}>
      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color }}
        />
      )}
      <span style={{
        fontSize: '0.58rem',
        fontFamily: 'var(--font-hud)',
        color: color,
        letterSpacing: '0.15em',
      }}>
        {label}
      </span>
    </div>
  );
}

function HUDPill({ label, value, color }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.75rem',
        fontFamily: 'var(--font-hud)',
        color: color,
        letterSpacing: '0.1em',
        textShadow: `0 0 8px ${color}80`,
      }}>
        {value}
      </div>
    </div>
  );
}
