import { useEffect } from 'react';
import useEventStore from '../store/eventStore';

/* ── Global keyboard shortcuts ───────────────────────────────── */
export default function useKeyboard() {
  const {
    isRunning, isPaused,
    startTimer, pauseTimer, resumeTimer,
    skipRound, prevRound, resetEvent,
  } = useEventStore();

  useEffect(() => {
    const onKey = (e) => {
      // Ignore if typing in an input/select
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isRunning)       pauseTimer();
          else if (isPaused)   resumeTimer();
          else                 startTimer();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipRound();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevRound();
          break;
        case 'KeyR':
          if (e.shiftKey) { e.preventDefault(); resetEvent(); }
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRunning, isPaused]);
}
