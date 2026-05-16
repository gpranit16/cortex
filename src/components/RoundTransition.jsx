import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import useEventStore, { ROUNDS } from '../store/eventStore';

/* ── Neural scan overlay between round transitions ───────────── */
export default function RoundTransition() {
  const { currentRound } = useEventStore();
  const [visible, setVisible] = useState(false);
  const [prev, setPrev] = useState(currentRound);

  useEffect(() => {
    if (currentRound !== prev) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setPrev(currentRound);
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [currentRound]);

  const round = ROUNDS[currentRound];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={currentRound}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Scan sweep */}
          <motion.div
            initial={{ top: '-2%' }}
            animate={{ top: '102%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: 0, right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent 0%, ${round.color}80 20%, ${round.color} 50%, ${round.color}80 80%, transparent 100%)`,
              boxShadow: `0 0 20px ${round.color}60, 0 0 60px ${round.color}30`,
            }}
          />

          {/* Data streaks */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ top: `${10 + i * 14}%`, left: '-100%', opacity: 0 }}
              animate={{ left: '110%', opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                height: 1,
                width: `${60 + Math.random() * 200}px`,
                background: `linear-gradient(90deg, transparent, ${round.color}60, transparent)`,
              }}
            />
          ))}

          {/* Round label flash */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.95] }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.7, 1] }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-hud)',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: round.color,
              textShadow: `0 0 30px ${round.color}, 0 0 60px ${round.color}60`,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {round.label} — {round.shortName}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
