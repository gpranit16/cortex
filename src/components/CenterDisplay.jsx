import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Presentation, Coffee, Target, Trophy, Circle } from 'lucide-react';
import useEventStore, { ROUNDS } from '../store/eventStore';
import CircularTimer from './CircularTimer';
import Waveform from './Waveform';

const ICON_MAP = {
  Brain: Brain,
  Presentation: Presentation,
  Coffee: Coffee,
  Target: Target,
  Trophy: Trophy
};

/* ── Holographic Brain SVG ────────────────────────────────────── */
function BrainPulse({ color }) {
  const nodes    = [[30,35],[45,55],[75,35],[90,55],[60,30],[40,20],[80,20],[60,65]];
  const synapses = [[[30,35],[45,55]],[[45,55],[60,65]],[[75,35],[90,55]],[[60,30],[75,35]],[[30,35],[40,20]],[[80,20],[90,55]]];

  return (
    <motion.svg
      viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 80, height: 66, flexShrink: 0 }}
      animate={{ filter: [`drop-shadow(0 0 5px ${color}80)`, `drop-shadow(0 0 16px ${color})`, `drop-shadow(0 0 5px ${color}80)`] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
    >
      <path d="M60 80 C30 80 10 65 10 45 C10 25 25 10 45 12 C50 5 58 2 60 8"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M60 80 C90 80 110 65 110 45 C110 25 95 10 75 12 C70 5 62 2 60 8"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <line x1="60" y1="8" x2="60" y2="80" stroke={color} strokeWidth="0.8" opacity="0.35" />
      {synapses.map(([[x1,y1],[x2,y2]],i) => (
        <line key={`s${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="0.8" opacity="0.3" />
      ))}
      {/* Nodes — animate opacity only (r attribute not supported by framer-motion) */}
      {nodes.map(([x,y],i) => (
        <motion.circle key={`n${i}`} cx={x} cy={y} r="2.8" fill={color}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 1.6 + i * 0.22, ease: 'easeInOut', delay: i * 0.12 }}
        />
      ))}
    </motion.svg>
  );
}


/* ── Center Panel: Main Countdown Display ─────────────────────── */
export default function CenterDisplay() {
  const {
    currentRound, timeLeft, isRunning, isPaused, isCompleted, customTitle
  } = useEventStore();

  const round     = ROUNDS[currentRound];
  const nextRound = ROUNDS[currentRound + 1];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 16,
      padding: '4px 16px',
      width: '100%',
    }}>

      {/* ── Session identity row ─────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`session-${currentRound}`}
          initial={{ y: -24, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: 24, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          {/* Main Branding Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, position: 'relative' }}>
            {/* Subtle tech grid background behind branding */}
            <div style={{
              position: 'absolute', inset: -30,
              background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 60%)',
              zIndex: -1, pointerEvents: 'none',
              borderTop: '1px solid rgba(0,229,255,0.1)',
              borderBottom: '1px solid rgba(0,229,255,0.1)',
            }} />
            
            {/* IEEE Top Level Branding */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: '1.45rem', color: '#ffffff', fontFamily: 'var(--font-hud)', letterSpacing: '0.28em', fontWeight: 700, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>IEEE EMBS BMSIT</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontFamily: 'var(--font-hud)', letterSpacing: '0.45em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.95, textShadow: '0 0 8px rgba(0,229,255,0.4)' }}>PRESENTS</span>
            </div>
            
            {/* Hero Title */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
                fontFamily: 'var(--font-hud)', fontWeight: 900,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff 0%, #00E5FF 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1.1, margin: 0,
                filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.5))'
              }}>
                CORTEX
              </h1>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Timer + Brain row ────────────────────────── */}
      <div className="timer-brain-row" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around', padding: '0', marginTop: '-2vh' }}>
        {/* Left — Placeholder for center balance */}
        <div style={{ flex: 1, maxWidth: 160 }} />

        {/* Center — Circular Timer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`ring-${currentRound}`}
            initial={{ scale: 0.75, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.75, opacity: 0, rotateY: 15 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="circular-timer-wrapper"
            style={{ position: 'relative' }}
          >
            {/* Breathing outer glow */}
            <motion.div
              style={{
                position: 'absolute', inset: -28, borderRadius: '50%',
                background: `radial-gradient(circle, ${round.color}14, transparent 70%)`,
                filter: 'blur(18px)',
                pointerEvents: 'none',
              }}
              animate={{ opacity: isRunning ? [0.4, 0.95, 0.4] : 0.25, scale: isRunning ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />
            <CircularTimer />
          </motion.div>
        </AnimatePresence>

        {/* Right — Status + next round */}
        <div className="status-column" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', flex: 1, maxWidth: 160 }}>
          {/* Status card */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: isRunning
              ? 'rgba(60,242,194,0.08)' : isPaused
              ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isRunning ? 'rgba(60,242,194,0.35)' : isPaused ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
            minWidth: 110,
          }}>
            <div style={{ fontSize: '0.52rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: 4 }}>
              SESSION STATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isRunning && (
                <motion.div animate={{ scale: [1,1.5,1], opacity: [1,0.3,1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--mint)', boxShadow: '0 0 8px var(--mint)' }}
                />
              )}
              <span style={{
                fontSize: '0.72rem', fontFamily: 'var(--font-hud)', letterSpacing: '0.1em',
                color: isRunning ? 'var(--mint)' : isPaused ? '#F59E0B' : 'var(--text-dim)',
                textShadow: isRunning ? '0 0 10px var(--mint)' : 'none',
              }}>
                {isRunning ? 'LIVE' : isPaused ? 'PAUSED' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Progress fraction */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '0.52rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: 4 }}>
              ELAPSED
            </div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-hud)', color: round.color, letterSpacing: '0.06em' }}>
              {Math.round((1 - timeLeft / round.duration) * 100)}%
            </div>
          </div>

          {/* Completed rounds */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '0.52rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: 4 }}>
              ROUND
            </div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-hud)', color: 'var(--violet)', letterSpacing: '0.06em' }}>
              {currentRound + 1} / {ROUNDS.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── EEG Waveform ────────────────────────────── */}
      <div className="eeg-waveform-container" style={{ width: '100%', maxWidth: '800px', marginTop: 'auto', marginBottom: '2vh' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
        }}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.25em', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            EEG SIGNAL MONITOR
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <motion.div
              animate={{ opacity: isRunning ? [1, 0.3, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: isRunning ? 'var(--mint)' : 'var(--text-dim)' }}
            />
            <span style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
              {isRunning ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>
        <Waveform height={90} barCount={26} />
      </div>

      {/* ── Next round preview ───────────────────────── */}
      <AnimatePresence>
        {nextRound && (
          <motion.div
            key={`next-${currentRound}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="next-round-preview-container"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              fontSize: '0.62rem', fontFamily: 'var(--font-body)',
              width: '100%', maxWidth: 420,
            }}
          >
            <span style={{ color: 'var(--text-dim)', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}>NEXT</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: nextRound.color, display: 'flex' }}>
              {(() => {
                const Icon = ICON_MAP[nextRound.icon] || Circle;
                return <Icon size={16} />;
              })()}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {nextRound.name}
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}>
              {nextRound.startTime}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Event completed ──────────────────────────── */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            padding: '16px 28px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(60,242,194,0.12), rgba(0,229,255,0.08))',
            border: '1px solid rgba(60,242,194,0.4)',
            textAlign: 'center',
            fontFamily: 'var(--font-hud)', fontSize: '0.72rem',
            letterSpacing: '0.12em', color: 'var(--mint)',
            textShadow: '0 0 14px var(--mint)',
            width: '100%', maxWidth: 420,
          }}
        >
          🏆 CORTEX 2026 OFFICIALLY CONCLUDED — THANK YOU PARTICIPANTS!
        </motion.div>
      )}
    </div>
  );
}

function HUDStat({ label, value, color }) {
  return (
    <div>
      <div style={{
        fontSize: '0.5rem', letterSpacing: '0.18em',
        color: 'var(--text-dim)', fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase', marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.8rem', fontFamily: 'var(--font-hud)',
        color, letterSpacing: '0.07em',
        textShadow: `0 0 10px ${color}80`,
      }}>
        {value}
      </div>
    </div>
  );
}
