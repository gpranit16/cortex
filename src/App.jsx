import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralBackground from './components/NeuralBackground';
import Header from './components/Header';
import EventTimeline from './components/EventTimeline';
import CenterDisplay from './components/CenterDisplay';
import ControlPanel from './components/ControlPanel';
import LoadingScreen from './components/LoadingScreen';
import RoundTransition from './components/RoundTransition';
import useKeyboard from './hooks/useKeyboard';
import useEventStore, { ROUNDS } from './store/eventStore';

function App() {
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [time, setTime]           = useState('');
  const [loaded, setLoaded]       = useState(true); // Always true for instant load
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { currentRound } = useEventStore();

  useKeyboard();

  const onMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Live clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2,'0')}:` +
        `${String(now.getMinutes()).padStart(2,'0')}:` +
        `${String(now.getSeconds()).padStart(2,'0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Preload speech voices
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices();
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Keyboard: close shortcut modal on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowShortcuts(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const round = ROUNDS[currentRound];

  return (
    <>
      {/* Loading Screen Removed for instant access */}
      <RoundTransition />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            onMouseMove={onMouseMove}
            style={{
              minHeight: '100vh', height: '100vh',
              background: 'transparent',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
            }}
          >
            {/* ── Neural canvas background ── */}
            <NeuralBackground mousePos={mousePos} />

            {/* ── Header ── */}
            <Header time={time} />

            {/* ── Main 3-column layout ── */}
            <main 
              className="main-layout"
              style={{
                flex: 1, display: 'flex', gap: 12,
                padding: '12px 16px',
                overflow: 'hidden', position: 'relative', zIndex: 1,
                minHeight: 0,
                background: 'transparent',
              }}
            >

              {/* LEFT — Timeline */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.4,0,0.2,1] }}
                className="sidebar-left"
                style={{ width: 'min(100%, 238px)', flexShrink: 0 }}
              >
                <EventTimeline />
              </motion.div>

              {/* CENTER — Timer display */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.4,0,0.2,1] }}
                className="center-display-container"
                style={{ flex: 1, minWidth: 0, position: 'relative' }}
              >
                <div style={{
                  height: '100%',
                  background: '#000000',
                  border: '1px solid rgba(0,229,255,0.12)',
                  borderRadius: 18,
                  backdropFilter: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '18px 12px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* HUD corner brackets */}
                  {[
                    { top: 10, left: 10, borderTopWidth: 2, borderLeftWidth: 2 },
                    { top: 10, right: 10, borderTopWidth: 2, borderRightWidth: 2 },
                    { bottom: 10, left: 10, borderBottomWidth: 2, borderLeftWidth: 2 },
                    { bottom: 10, right: 10, borderBottomWidth: 2, borderRightWidth: 2 },
                  ].map((style, i) => (
                    <div key={i} style={{
                      position: 'absolute', width: 18, height: 18,
                      borderColor: `${round.color}40`, borderStyle: 'solid',
                      borderWidth: 0, borderRadius: 2,
                      transition: 'border-color 1s',
                      ...style,
                    }} />
                  ))}

                  {/* Radial center glow */}
                  <motion.div
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 18, pointerEvents: 'none',
                      background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${round.color}06, transparent)`,
                    }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  />

                  <CenterDisplay />
                </div>
              </motion.div>

              {/* RIGHT — Controls */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.4,0,0.2,1] }}
                className="sidebar-right"
                style={{
                  width: 'min(100%, 250px)',
                  flexShrink: 0,
                  overflowY: 'auto', overflowX: 'hidden',
                }}
              >
                <ControlPanel />
              </motion.div>
            </main>

            {/* ── Footer bar ── */}
            <footer style={{
              position: 'relative', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 22px',
              background: 'rgba(5,8,22,0.92)',
              borderTop: '1px solid rgba(0,229,255,0.07)',
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: '0.5rem', color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.15em',
              }}>
                CORTEX v2.0 · IEEE EMBS BMSIT · NEURAL COMMAND CENTER
              </div>

              <button onClick={() => setShowShortcuts(s => !s)} style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-dim)', fontSize: '0.5rem',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.15em',
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                [?] SHORTCUTS
              </button>

              <div style={{
                fontSize: '0.5rem', color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.15em',
              }}>
                ALL SYSTEMS NOMINAL · NODES ONLINE
              </div>
            </footer>

            {/* ── Keyboard shortcuts modal ── */}
            <AnimatePresence>
              {showShortcuts && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowShortcuts(false)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(5,8,22,0.88)', backdropFilter: 'blur(10px)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: 32, minWidth: 360,
                      background: 'rgba(8,17,32,0.9)',
                      border: '1px solid rgba(0,229,255,0.2)',
                      borderRadius: 18,
                      backdropFilter: 'blur(24px)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.62rem', letterSpacing: '0.35em',
                      fontFamily: 'var(--font-hud)', color: 'var(--cyan)', marginBottom: 20,
                    }}>
                      ◈ KEYBOARD SHORTCUTS
                    </div>
                    {[
                      ['SPACE',        'Play / Pause Timer'],
                      ['→  ARROW',     'Skip to Next Round'],
                      ['←  ARROW',     'Go to Previous Round'],
                      ['SHIFT + R',    'Reset Entire Event'],
                      ['ESC',          'Close Modal'],
                    ].map(([key, desc]) => (
                      <div key={key} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 20,
                      }}>
                        <kbd style={{
                          background: 'rgba(0,229,255,0.1)',
                          border: '1px solid rgba(0,229,255,0.3)',
                          borderRadius: 6, padding: '3px 10px',
                          fontFamily: 'var(--font-mono)', fontSize: '0.63rem',
                          color: 'var(--cyan)', whiteSpace: 'nowrap',
                        }}>{key}</kbd>
                        <span style={{ fontSize: '0.63rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                          {desc}
                        </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                      <button onClick={() => setShowShortcuts(false)} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-dim)', padding: '7px 22px', borderRadius: 8,
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', cursor: 'pointer',
                        letterSpacing: '0.12em',
                      }}>
                        CLOSE [ESC]
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
