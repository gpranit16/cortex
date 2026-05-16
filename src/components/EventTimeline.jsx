import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Presentation, Coffee, Target, Trophy, CheckCircle2, Circle } from 'lucide-react';
import useEventStore, { ROUNDS } from '../store/eventStore';

const ICON_MAP = {
  Brain: Brain,
  Presentation: Presentation,
  Coffee: Coffee,
  Target: Target,
  Trophy: Trophy
};

/* ── Left Panel: Event Timeline ──────────────────────────────── */
export default function EventTimeline() {
  const { currentRound, completedRounds, setRound, isRunning, startTimer } = useEventStore();

  return (
    <div
      className="glass-panel-cyan"
      style={{
        padding: '24px 20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 220,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          color: 'var(--cyan)',
          fontFamily: 'var(--font-hud)',
          textTransform: 'uppercase',
          marginBottom: 4,
          opacity: 0.8,
        }}>
          ◈ Event Timeline
        </div>
        <div style={{
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, var(--cyan), transparent)',
          opacity: 0.3,
        }} />
      </div>

      {/* Round list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {ROUNDS.map((round, idx) => {
          const isActive    = idx === currentRound;
          const isCompleted = completedRounds.includes(idx);
          const isUpcoming  = !isActive && !isCompleted;

          return (
            <motion.div
              key={round.id}
              onClick={() => { setRound(idx); }}
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                position: 'relative',
                background: isActive
                  ? `linear-gradient(135deg, ${round.color}18, ${round.color}08)`
                  : isCompleted
                  ? 'rgba(255,255,255,0.02)'
                  : 'transparent',
                border: isActive
                  ? `1px solid ${round.color}50`
                  : isCompleted
                  ? '1px solid rgba(255,255,255,0.05)'
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              {/* Sweep animation on active */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(90deg, transparent, ${round.color}15, transparent)`,
                    borderRadius: 10,
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                />
              )}

              {/* Status dot */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {isActive && isRunning && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      border: `1px solid ${round.color}`,
                      opacity: 0.6,
                    }}
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: isCompleted
                    ? 'rgba(60,242,194,0.2)'
                    : isActive
                    ? `${round.color}20`
                    : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid ${isCompleted ? '#3CF2C240' : isActive ? `${round.color}40` : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.3s',
                }}>
                  {isCompleted ? (
                    <CheckCircle2 size={14} color="#3CF2C2" />
                  ) : (() => {
                    const Icon = ICON_MAP[round.icon] || Circle;
                    return <Icon size={14} color={isActive ? round.color : 'rgba(255,255,255,0.4)'} />;
                  })()}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-hud)',
                  color: isActive ? round.color : isCompleted ? 'var(--mint)' : 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: isActive ? `0 0 10px ${round.color}` : 'none',
                }}>
                  {round.name}
                </div>
                <div style={{
                  fontSize: '0.58rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  marginTop: 2,
                }}>
                  {round.startTime} – {round.endTime}
                </div>
              </div>

              {/* Status badge */}
              <div style={{
                fontSize: '0.5rem',
                padding: '2px 6px',
                borderRadius: 4,
                fontFamily: 'var(--font-hud)',
                letterSpacing: '0.1em',
                background: isCompleted
                  ? 'rgba(60,242,194,0.12)'
                  : isActive
                  ? `${round.color}18`
                  : 'rgba(255,255,255,0.04)',
                color: isCompleted ? '#3CF2C2' : isActive ? round.color : 'var(--text-dim)',
                border: `1px solid ${isCompleted ? '#3CF2C230' : isActive ? `${round.color}30` : 'transparent'}`,
                flexShrink: 0,
              }}>
                {isCompleted ? 'DONE' : isActive ? 'NOW' : 'NEXT'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
          fontSize: '0.58rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-dim)',
        }}>
          <span>EVENT PROGRESS</span>
          <span>{completedRounds.length}/{ROUNDS.length}</span>
        </div>
        <div style={{
          width: '100%', height: 4,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
              boxShadow: '0 0 8px rgba(0,229,255,0.5)',
            }}
            animate={{ width: `${(completedRounds.length / ROUNDS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
