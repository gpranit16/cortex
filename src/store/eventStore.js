import { create } from 'zustand';

export const ROUNDS = [
  {
    id: 0,
    name: 'Main Event',
    shortName: 'EVENT',
    label: 'Session 1',
    icon: 'Brain',
    color: '#00E5FF',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: 120 * 60,
    description: 'Main event timeline',
  }
];

const useEventStore = create((set, get) => ({
  currentRound: 0,
  timeLeft: ROUNDS[0].duration,
  isRunning: false,
  isPaused: false,
  isCompleted: false,
  completedRounds: [],
  tickerRef: null,

  // Custom UI Title
  customTitle: '',
  setCustomTitle: (title) => set({ customTitle: title }),

  // Voice settings
  voiceEnabled: true,
  voiceGender: 'male', // 'male' | 'female'
  voiceVolume: 0.85,
  voiceAnnounced: { start: false, five: false, one: false, end: false },

  // UI state
  isFullscreen: false,

  // ── Actions ──────────────────────────────────────────────────────
  setRound: (idx) => {
    const { tickerRef } = get();
    if (tickerRef) clearInterval(tickerRef);
    set({
      currentRound: idx,
      timeLeft: ROUNDS[idx].duration,
      isRunning: false,
      isPaused: false,
      voiceAnnounced: { start: false, five: false, one: false, end: false },
    });
  },

  setTimeLeft: (seconds) => {
    set({ timeLeft: seconds });
  },

  startTimer: () => {
    const { tickerRef, tick } = get();
    if (tickerRef) clearInterval(tickerRef);
    const id = setInterval(tick, 1000);
    set({ isRunning: true, isPaused: false, tickerRef: id });
  },

  pauseTimer: () => {
    const { tickerRef } = get();
    if (tickerRef) clearInterval(tickerRef);
    set({ isRunning: false, isPaused: true, tickerRef: null });
  },

  resumeTimer: () => {
    const { tick } = get();
    const id = setInterval(tick, 1000);
    set({ isRunning: true, isPaused: false, tickerRef: id });
  },

  tick: () => {
    const { timeLeft, currentRound, completedRounds, voiceAnnounced } = get();

    // Voice cue checks
    if (timeLeft === ROUNDS[currentRound].duration && !voiceAnnounced.start) {
      get().announce(`${ROUNDS[currentRound].label} ${ROUNDS[currentRound].name} has now started. Good luck to all participants.`);
      set((s) => ({ voiceAnnounced: { ...s.voiceAnnounced, start: true } }));
    }
    if (timeLeft === 300 && !voiceAnnounced.five) {
      get().announce(`Only 5 minutes remaining in ${ROUNDS[currentRound].name}. Please wrap up.`);
      set((s) => ({ voiceAnnounced: { ...s.voiceAnnounced, five: true } }));
    }
    if (timeLeft === 60 && !voiceAnnounced.one) {
      get().announce(`One minute remaining. Please conclude your ${ROUNDS[currentRound].shortName} round.`);
      set((s) => ({ voiceAnnounced: { ...s.voiceAnnounced, one: true } }));
    }

    // Custom Announcements Trigger
    const { customAnnouncements } = get();
    const currentMin = Math.floor(timeLeft / 60);
    const secondsInMin = timeLeft % 60;
    
    // Trigger at second 0 of the target minute
    if (secondsInMin === 0) {
      customAnnouncements.forEach(ann => {
        if (parseInt(ann.minute) === currentMin && !ann.triggered) {
          get().announce(ann.message);
          ann.triggered = true; 
        }
      });
    }

    if (timeLeft <= 1) {
      // Round ended
      get().announce(`Round completed. ${currentRound < ROUNDS.length - 1 ? 'Preparing next session.' : 'CORTEX 2026 has officially concluded. Thank you participants.'}`);
      const { tickerRef } = get();
      if (tickerRef) clearInterval(tickerRef);

      const newCompleted = [...completedRounds, currentRound];
      const nextRound = currentRound + 1;

      if (nextRound >= ROUNDS.length) {
        set({
          timeLeft: 0,
          isRunning: false,
          isPaused: false,
          isCompleted: true,
          completedRounds: newCompleted,
          tickerRef: null,
          voiceAnnounced: { start: false, five: false, one: false, end: false },
        });
      } else {
        set({
          currentRound: nextRound,
          timeLeft: ROUNDS[nextRound].duration,
          isRunning: false,
          isPaused: false,
          completedRounds: newCompleted,
          tickerRef: null,
          voiceAnnounced: { start: false, five: false, one: false, end: false },
          isCompleted: false,
        });
      }
      return;
    }

    set({ timeLeft: timeLeft - 1 });
  },

  skipRound: () => {
    const { currentRound, tickerRef, completedRounds } = get();
    if (tickerRef) clearInterval(tickerRef);
    const next = currentRound + 1;
    if (next >= ROUNDS.length) return;
    set({
      currentRound: next,
      timeLeft: ROUNDS[next].duration,
      isRunning: false,
      isPaused: false,
      tickerRef: null,
      completedRounds: [...completedRounds, currentRound],
      voiceAnnounced: { start: false, five: false, one: false, end: false },
      isCompleted: false,
    });
  },

  prevRound: () => {
    const { currentRound, tickerRef } = get();
    if (tickerRef) clearInterval(tickerRef);
    const prev = Math.max(0, currentRound - 1);
    set({
      currentRound: prev,
      timeLeft: ROUNDS[prev].duration,
      isRunning: false,
      isPaused: false,
      tickerRef: null,
      voiceAnnounced: { start: false, five: false, one: false, end: false },
    });
  },

  resetEvent: () => {
    const { tickerRef } = get();
    if (tickerRef) clearInterval(tickerRef);
    set({
      currentRound: 0,
      timeLeft: ROUNDS[0].duration,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      completedRounds: [],
      tickerRef: null,
      voiceAnnounced: { start: false, five: false, one: false, end: false },
    });
  },

  setVoiceEnabled: (v) => set({ voiceEnabled: v }),
  setVoiceGender: (g) => set({ voiceGender: g }),
  setVoiceVolume: (v) => set({ voiceVolume: v }),
  toggleFullscreen: () => {
    const { isFullscreen } = get();
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    set({ isFullscreen: !isFullscreen });
  },

  announce: (text) => {
    const { voiceEnabled, voiceGender, voiceVolume } = get();
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    const preferredVoice = voices.find(v => 
      voiceGender === 'female' 
        ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google UK English Female'))
        : (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male'))
    );
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 0.95;
    utterance.rate = 0.95;
    utterance.volume = voiceVolume;
    window.speechSynthesis.speak(utterance);
  },

  // Custom Announcements
  customAnnouncements: [],
  addCustomAnnouncement: (message, minute) => {
    set(state => ({
      customAnnouncements: [...state.customAnnouncements, { message, minute, triggered: false, id: Date.now() }]
    }));
  },
  removeCustomAnnouncement: (id) => {
    set(state => ({
      customAnnouncements: state.customAnnouncements.filter(a => a.id !== id)
    }));
  },
}));

export default useEventStore;
