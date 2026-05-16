import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Presentation, Coffee, Target, Trophy, Circle, Mic2, Activity, Wifi, ShieldCheck, Play, Pause, FastForward, Rewind, RotateCcw, Power } from 'lucide-react';
import useEventStore, { ROUNDS } from '../store/eventStore';

const ICON_MAP = {
  Brain: Brain,
  Presentation: Presentation,
  Coffee: Coffee,
  Target: Target,
  Trophy: Trophy
};

/* ── Right Panel: Controls ────────────────────────────────────── */
export default function ControlPanel() {
  const {
    currentRound, isRunning, isPaused, isCompleted,
    startTimer, pauseTimer, resumeTimer,
    skipRound, prevRound, resetEvent, setRound,
    setTimeLeft,
    voiceEnabled, voiceGender, voiceVolume,
    setVoiceEnabled, setVoiceGender, setVoiceVolume,
    announce, toggleFullscreen, isFullscreen, timeLeft,
  } = useEventStore();

  const [testAnn, setTestAnn] = useState(false);
  const [diagnostics, setDiagnostics] = useState({ cpu: 0, mem: 0, net: 0 });

  // Simulate live diagnostics readouts
  useEffect(() => {
    const id = setInterval(() => {
      setDiagnostics({
        cpu: 22 + Math.random() * 18,
        mem: 41 + Math.random() * 12,
        net: 90 + Math.random() * 10,
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const handleStart = () => {
    startTimer();
    setTimeout(() => {
      const round = ROUNDS[currentRound];
      announce(`${round.label} ${round.name} has now started. Good luck to all participants.`);
    }, 600);
  };

  const testVoice = () => {
    announce('Neural voice system online. CORTEX 2026 event command center is fully operational.');
    setTestAnn(true);
    setTimeout(() => setTestAnn(false), 2500);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      width: 250, flexShrink: 0,
      overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: 4,
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0,229,255,0.2) transparent',
    }}>

      {/* ── Timer Controls ──────────────────────────── */}
      <PanelCard color="var(--violet)" label="TIMER CONTROLS" icon="⚡">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {/* Primary action button */}
          {!isRunning && !isPaused && !isCompleted && (
            <PrimaryBtn label="START SESSION" icon={<Play size={14} fill="currentColor" />} onClick={handleStart}
              bg="linear-gradient(135deg,#00E5FF,#0097A7)" textColor="#050816"
              glow="rgba(0,229,255,0.5)" />
          )}
          {isRunning && (
            <PrimaryBtn label="PAUSE" icon={<Pause size={14} fill="currentColor" />} onClick={pauseTimer}
              bg="linear-gradient(135deg,#F59E0B,#92400E)" textColor="#fff"
              glow="rgba(245,158,11,0.4)" />
          )}
          {isPaused && (
            <PrimaryBtn label="RESUME" icon={<Play size={14} fill="currentColor" />} onClick={resumeTimer}
              bg="linear-gradient(135deg,#3CF2C2,#059669)" textColor="#050816"
              glow="rgba(60,242,194,0.45)" />
          )}
          {isCompleted && (
            <PrimaryBtn label="RESTART EVENT" icon={<RotateCcw size={14} />} onClick={resetEvent}
              bg="linear-gradient(135deg,#8B5CF6,#4C1D95)" textColor="#fff"
              glow="rgba(139,92,246,0.4)" />
          )}

          {/* Secondary row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <GhostBtn label="◀ PREV" onClick={prevRound} disabled={currentRound === 0} />
            <GhostBtn label="NEXT ▶" onClick={skipRound} disabled={currentRound >= ROUNDS.length - 1} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <GhostBtn label="↺ RESTART" onClick={() => setRound(currentRound)} />
            <DangerBtn label="⟳ RESET ALL" onClick={resetEvent} />
          </div>

          {/* Manual Time Input */}
          <div style={{
            marginTop: 8, display: 'flex', gap: 6, alignItems: 'center',
            padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <input
              type="number"
              placeholder="MIN"
              id="manual-min"
              style={{
                width: 50, background: 'transparent', border: 'none',
                color: 'var(--cyan)', fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', outline: 'none', borderBottom: '1px solid rgba(0,229,255,0.3)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(e.currentTarget.value);
                  if (!isNaN(val)) setTimeLeft(val * 60);
                }
              }}
            />
            <span style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>MIN</span>
            <button
              onClick={() => {
                const el = document.getElementById('manual-min');
                const val = parseInt(el.value);
                if (!isNaN(val)) setTimeLeft(val * 60);
              }}
              style={{
                background: 'rgba(0,229,255,0.15)', border: '1px solid var(--cyan)',
                color: 'var(--cyan)', fontSize: '0.55rem', padding: '3px 8px',
                borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-hud)'
              }}
            >
              SET TIME
            </button>
          </div>
        </div>
      </PanelCard>

      {/* ── Manual Round Jump ───────────────────────── */}
      <PanelCard color="var(--cyan)" label="JUMP TO ROUND" icon="◎">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 12 }}>
          {ROUNDS.map((r, idx) => {
            const isActive = idx === currentRound;
            return (
              <motion.button
                key={r.id}
                onClick={() => setRound(idx)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 11px', borderRadius: 8,
                  border: isActive ? `1px solid ${r.color}55` : '1px solid rgba(255,255,255,0.06)',
                  background: isActive ? `${r.color}0E` : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: isActive ? `${r.color}20` : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(() => {
                    const Icon = ICON_MAP[r.icon] || Circle;
                    return <Icon size={14} color={isActive ? r.color : 'rgba(255,255,255,0.4)'} />;
                  })()}
                </div>
                {isActive && (
                  <motion.div
                    style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(90deg, transparent, ${r.color}12, transparent)`,
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                )}
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.6rem', fontFamily: 'var(--font-hud)',
                    color: isActive ? r.color : 'var(--text-secondary)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    textShadow: isActive ? `0 0 8px ${r.color}` : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: '0.51rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {r.startTime}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: r.color, flexShrink: 0 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </PanelCard>

      {/* ── Voice Controls ──────────────────────────── */}
      <PanelCard color="var(--mint)" label="VOICE SYSTEM" icon={<Mic2 size={11} strokeWidth={2.5} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {/* Enable toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.61rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              AI ANNOUNCER
            </span>
            <ToggleSwitch on={voiceEnabled} onChange={setVoiceEnabled} color="var(--mint)" />
          </div>

          {/* Gender */}
          <div>
            <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.15em' }}>
              VOICE PROFILE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['male', '♂ MALE'], ['female', '♀ FEMALE']].map(([g, label]) => (
                <motion.button key={g} onClick={() => setVoiceGender(g)} whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '6px 8px', borderRadius: 6,
                    border: voiceGender === g ? '1px solid rgba(60,242,194,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    background: voiceGender === g ? 'rgba(60,242,194,0.12)' : 'rgba(255,255,255,0.02)',
                    color: voiceGender === g ? 'var(--mint)' : 'var(--text-dim)',
                    fontSize: '0.58rem', fontFamily: 'var(--font-hud)', letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>VOLUME</span>
              <span style={{ fontSize: '0.58rem', color: 'var(--mint)', fontFamily: 'var(--font-hud)' }}>
                {Math.round(voiceVolume * 100)}%
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input type="range" min="0" max="1" step="0.05"
                value={voiceVolume}
                onChange={e => setVoiceVolume(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--mint)', cursor: 'pointer', height: 4 }}
              />
            </div>
          </div>

          {/* Test voice */}
          <motion.button onClick={testVoice} whileTap={{ scale: 0.95 }} style={{
            padding: '9px 12px', borderRadius: 8,
            border: `1px solid ${testAnn ? 'rgba(60,242,194,0.6)' : 'rgba(60,242,194,0.25)'}`,
            background: testAnn ? 'rgba(60,242,194,0.15)' : 'rgba(60,242,194,0.05)',
            color: 'var(--mint)', fontSize: '0.6rem', fontFamily: 'var(--font-hud)',
            letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {testAnn ? (
              <>
                <motion.div animate={{ scale: [1,1.4,1] }} transition={{ repeat: Infinity, duration: 0.6 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint)' }} />
                BROADCASTING...
              </>
            ) : '▶ TEST VOICE SYSTEM'}
          </motion.button>
        </div>
      </PanelCard>

      {/* ── Custom Announcements ────────────────────── */}
      <PanelCard color="var(--cyan)" label="CUSTOM BROADCAST" icon={<Mic2 size={11} strokeWidth={2.5} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <div style={{ position: 'relative' }}>
            <textarea
              id="custom-speech-msg"
              placeholder="Enter message to broadcast..."
              style={{
                width: '100%', height: 50, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '8px 10px', color: '#fff', fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <PrimaryBtn 
              label="SPEAK NOW" 
              icon={<Play size={12} fill="currentColor" />}
              onClick={() => {
                const el = document.getElementById('custom-speech-msg');
                if (el.value) {
                  announce(el.value);
                  el.value = '';
                }
              }}
              bg="rgba(0,229,255,0.15)" textColor="var(--cyan)" glow="rgba(0,229,255,0.2)"
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <input 
                type="number" 
                id="schedule-min" 
                placeholder="MIN"
                style={{
                  width: '40%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, color: 'var(--cyan)', fontSize: '0.6rem', textAlign: 'center'
                }}
              />
              <button
                onClick={() => {
                  const msgEl = document.getElementById('custom-speech-msg');
                  const minEl = document.getElementById('schedule-min');
                  const msg = msgEl.value;
                  const min = parseInt(minEl.value);
                  if (msg && !isNaN(min)) {
                    useEventStore.getState().addCustomAnnouncement(msg, min);
                    msgEl.value = '';
                    minEl.value = '';
                  }
                }}
                style={{
                  flex: 1, background: 'rgba(139,92,246,0.15)', border: '1px solid var(--violet)',
                  color: 'var(--violet)', fontSize: '0.55rem', borderRadius: 6, cursor: 'pointer',
                  fontFamily: 'var(--font-hud)'
                }}
              >
                SCHEDULE
              </button>
            </div>
          </div>

          {/* Scheduled List */}
          {useEventStore.getState().customAnnouncements.length > 0 && (
            <div style={{ 
              marginTop: 4, padding: 8, background: 'rgba(255,255,255,0.02)', 
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <div style={{ fontSize: '0.45rem', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '0.1em' }}>SCHEDULED QUEUE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {useEventStore.getState().customAnnouncements.map(ann => (
                  <div key={ann.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.55rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)',
                    padding: '4px 6px', borderRadius: 4
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {ann.message}
                    </span>
                    <span style={{ color: ann.triggered ? 'var(--mint)' : 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                      @{ann.minute}m {ann.triggered ? '✓' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
            AI VOICE SYSTEM READY
          </div>
        </div>
      </PanelCard>

      {/* ── System Controls ─────────────────────────── */}
      <PanelCard color="var(--violet)" label="SYSTEM" icon={<Power size={11} strokeWidth={2.5} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <GhostBtn
            label={isFullscreen ? '⊠ EXIT FULLSCREEN' : '⊞ FULLSCREEN MODE'}
            onClick={toggleFullscreen}
          />
          <div style={{
            fontSize: '0.52rem', color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
            textAlign: 'center', padding: '6px 0',
          }}>
            SPACE = Play/Pause · ← → = Switch Rounds<br />
            SHIFT+R = Reset All
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────── */
function PanelCard({ children, color, label, icon }) {
  return (
    <div style={{
      background: '#000000',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: '14px 16px',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', top: 14, bottom: 14, left: 0,
        width: 2, borderRadius: '0 2px 2px 0',
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        opacity: 0.6,
      }} />
      {/* Header */}
      <div style={{ paddingLeft: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '0.56rem', letterSpacing: '0.25em',
          fontFamily: 'var(--font-hud)', color,
          textTransform: 'uppercase', opacity: 0.85,
          marginBottom: 4,
        }}>
          <span>{icon}</span><span>{label}</span>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, ${color}40, transparent)` }} />
      </div>
      <div style={{ paddingLeft: 8 }}>
        {children}
      </div>
    </div>
  );
}

function PrimaryBtn({ label, icon, onClick, bg, textColor, glow }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
      style={{
        width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none',
        background: bg, color: textColor,
        fontSize: '0.68rem', fontFamily: 'var(--font-hud)', fontWeight: 700,
        letterSpacing: '0.12em', cursor: 'pointer',
        boxShadow: `0 0 24px ${glow}, 0 4px 14px rgba(0,0,0,0.4)`,
        transition: 'all 0.25s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
      {icon} {label}
    </motion.button>
  );
}

function GhostBtn({ label, onClick, disabled }) {
  return (
    <motion.button onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }} whileTap={disabled ? {} : { scale: 0.97 }}
      style={{
        padding: '8px 12px', borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        color: disabled ? 'var(--text-dim)' : 'var(--text-secondary)',
        fontSize: '0.59rem', fontFamily: 'var(--font-hud)', letterSpacing: '0.08em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', opacity: disabled ? 0.4 : 1,
        width: '100%',
      }}>
      {label}
    </motion.button>
  );
}

function DangerBtn({ label, onClick }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      style={{
        padding: '8px 12px', borderRadius: 8,
        border: '1px solid rgba(255,77,109,0.35)',
        background: 'rgba(255,77,109,0.08)',
        color: '#FF4D6D', fontSize: '0.59rem', fontFamily: 'var(--font-hud)',
        letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s',
      }}>
      {label}
    </motion.button>
  );
}

function ToggleSwitch({ on, onChange, color }) {
  return (
    <motion.div onClick={() => onChange(!on)} style={{
      width: 38, height: 20, borderRadius: 10,
      background: on ? color : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s',
      boxShadow: on ? `0 0 12px ${color}60` : 'none',
    }}>
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ position: 'absolute', top: 3, width: 14, height: 14, borderRadius: '50%', background: '#fff' }}
      />
    </motion.div>
  );
}
