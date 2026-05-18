import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import useEventStore, { ROUNDS } from '../store/eventStore';

/* ── Top Header / HUD Bar ────────────────────────────────────── */
export default function Header({ time }) {
  const { currentRound, isRunning, isPaused, customTitle } = useEventStore();
  const round = ROUNDS[currentRound];

  return (
    <header className="header-container" style={{
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
      {/* Left — Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        

        
        {/* Brain / Cortex Logo */}
        <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Holographic outer ring */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,229,255,0.3)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,229,255,0.8)" strokeWidth="2" strokeDasharray="30 15 10 15" />
          </motion.svg>
          
          {/* Inner counter-rotating ring */}
          <motion.svg
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" strokeDasharray="15 25" />
            <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,229,255,0.4)" strokeWidth="1" strokeDasharray="5 5" />
          </motion.svg>

          {/* Central AI Brain */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.8)) drop-shadow(0 0 24px rgba(0,229,255,0.4))'
          }}>
            <Brain size={32} color="#00E5FF" strokeWidth={1.5} />
            {/* Pulsing Core Glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: -10,
                background: 'radial-gradient(circle, rgba(0,229,255,0.5) 0%, transparent 70%)',
                zIndex: -1, borderRadius: '50%'
              }}
            />
          </div>
        </div>

        <div className="header-title" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: '2rem', margin: 0, fontWeight: 900,
            letterSpacing: '0.25em', fontFamily: "'Syncopate', sans-serif",
            background: 'linear-gradient(to right, #ffffff 20%, #00E5FF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(0,229,255,0.3)',
            lineHeight: 1.1, textTransform: 'uppercase'
          }}>
            CORTEX
          </h1>
          <div style={{
            fontSize: '0.55rem', color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.35em',
            marginTop: 4, opacity: 0.9,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ color: 'var(--violet)' }}>⚡</span> NEURAL COMMAND CENTER
          </div>
        </div>

        {customTitle && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: '6px 16px',
              borderLeft: '2px solid var(--cyan)',
              background: 'rgba(0,229,255,0.04)',
              borderRadius: '0 8px 8px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--cyan)',
              letterSpacing: '0.12em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(0,229,255,0.4)',
              borderTop: '1px solid rgba(0,229,255,0.05)',
              borderBottom: '1px solid rgba(0,229,255,0.05)',
              borderRight: '1px solid rgba(0,229,255,0.05)',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--violet)',
              boxShadow: '0 0 6px var(--violet)',
              animation: 'pulse-slow 2s ease-in-out infinite'
            }} />
            {customTitle}
          </motion.div>
        )}


      </div>

      {/* Right — HUD stats */}
      <div className="header-stats" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
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
