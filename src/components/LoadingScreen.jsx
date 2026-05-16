import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── CORTEX Boot / Loading Screen ────────────────────────────── */
export default function LoadingScreen({ onComplete, visible }) {
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([]);

  const bootLines = [
    'INITIALIZING NEURAL COMMAND INTERFACE...',
    'LOADING BIOMEDICAL SIGNAL MODULES...',
    'CALIBRATING EEG FEEDBACK SYSTEMS...',
    'ESTABLISHING SECURE SESSION LINK...',
    'SYNCING IEEE EMBS BMSIT PROTOCOLS...',
    'MOUNTING TIMER CONTROL SUBSYSTEMS...',
    'VOICE SYNTHESIS ENGINE READY...',
    'ALL NODES ONLINE — CORTEX ACTIVATED.',
  ];

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let lineIdx = 0;
    let cancelled = false;

    const addLine = () => {
      if (cancelled) return;
      if (lineIdx < bootLines.length) {
        const line = bootLines[lineIdx];
        setLogLines(l => [...l, line]);
        setProgress(Math.round(((lineIdx + 1) / bootLines.length) * 100));
        lineIdx++;
        // SIGNIFICANTLY FASTER: 40-70ms instead of 300-500ms
        setTimeout(addLine, 40 + Math.random() * 30);
      } else {
        // FAST DISMISS: 200ms instead of 700ms
        setTimeout(() => {
          if (!cancelled) onComplete();
        }, 200);
      }
    };
    setTimeout(addLine, 200);
    return () => { cancelled = true; };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-deep)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            overflow: 'hidden',
          }}
        >
          {/* Background grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(0,229,255,0.04) 40px,rgba(0,229,255,0.04) 41px),' +
              'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(139,92,246,0.03) 40px,rgba(139,92,246,0.03) 41px)',
            pointerEvents: 'none',
          }} />

          {/* Radial glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.08), transparent)',
              pointerEvents: 'none',
            }}
          />

          {/* CORTEX Logo */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            {/* Orbital rings */}
            {[60, 80, 104].map((size, i) => (
              <motion.div
                key={size}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ repeat: Infinity, duration: 6 + i * 2, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: size, height: size,
                  borderRadius: '50%',
                  border: `1px solid rgba(${i === 0 ? '0,229,255' : i === 1 ? '139,92,246' : '60,242,194'},${0.4 - i * 0.1})`,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                }}
              />
            ))}

            {/* Brain icon */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(139,92,246,0.15))',
                border: '1.5px solid rgba(0,229,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
                margin: '0 auto 20px',
                position: 'relative', zIndex: 2,
                boxShadow: '0 0 30px rgba(0,229,255,0.3)',
              }}
            >
              🧠
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '3.5rem',
                fontFamily: 'var(--font-hud)',
                fontWeight: 900,
                letterSpacing: '0.35em',
                background: 'linear-gradient(90deg, var(--cyan), #fff 50%, var(--violet))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                lineHeight: 1,
              }}
            >
              CORTEX
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                marginTop: 8,
              }}
            >
              IEEE EMBS BMSIT · NEURAL COMMAND CENTER · 2026
            </motion.div>
          </div>

          {/* Terminal log */}
          <div style={{
            width: '100%', maxWidth: 480,
            background: 'rgba(0,229,255,0.03)',
            border: '1px solid rgba(0,229,255,0.12)',
            borderRadius: 10,
            padding: '16px 20px',
            minHeight: 200,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
          }}>
            <div style={{ color: 'var(--cyan)', marginBottom: 10, letterSpacing: '0.15em' }}>
              SYSTEM BOOT LOG ──────────────────
            </div>
            {logLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: 4,
                  color: i === logLines.length - 1 ? 'var(--mint)' : 'var(--text-secondary)',
                  letterSpacing: '0.05em',
                }}
              >
                <span style={{ color: 'var(--cyan)', opacity: 0.5 }}>{'> '}</span>
                {line}
                {i === logLines.length - 1 && (
                  <span style={{ animation: 'blink-caret 1s step-end infinite' }}>█</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
                INITIALIZING
              </span>
              <span style={{ fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', letterSpacing: '0.1em' }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
                  boxShadow: '0 0 8px rgba(0,229,255,0.6)',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

