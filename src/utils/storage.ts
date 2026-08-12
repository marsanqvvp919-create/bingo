import { AppState, AppSettings } from '../types';

const STORAGE_KEY = 'bingo_app_state_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  maxNumber: 75,
  animSpeed: 'standard', // 4s
  soundEnabled: true,
  voiceEnabled: true,
  volume: 0.8,
  confettiEnabled: true,
  theme: 'dark-stage',
  historyMode: 'order',
  recentCount: 8,
  eventTitle: 'BINGO PARTY',
  autoDrawInterval: 5,
};

export const INITIAL_APP_STATE: AppState = {
  ...DEFAULT_SETTINGS,
  gameStarted: false,
  drawnNumbers: [],
  currentNumber: null,
  previousNumber: null,
  isDrawing: false,
  isPaused: false,
  isFinished: false,
  isAutoDrawing: false,
};

export function loadSavedState(): AppState {
  if (typeof window === 'undefined') return INITIAL_APP_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_APP_STATE;

    const parsed = JSON.parse(raw);

    // Validate fields and merge with default fallback
    const state: AppState = {
      maxNumber: typeof parsed.maxNumber === 'number' && parsed.maxNumber >= 10 && parsed.maxNumber <= 999 ? parsed.maxNumber : 75,
      animSpeed: ['short', 'standard', 'long'].includes(parsed.animSpeed) ? parsed.animSpeed : 'standard',
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      voiceEnabled: typeof parsed.voiceEnabled === 'boolean' ? parsed.voiceEnabled : true,
      volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(1, parsed.volume)) : 0.8,
      confettiEnabled: typeof parsed.confettiEnabled === 'boolean' ? parsed.confettiEnabled : true,
      theme: ['dark-stage', 'neon-cyber', 'gold-luxury', 'classic-royal'].includes(parsed.theme) ? parsed.theme : 'dark-stage',
      historyMode: ['order', 'grid'].includes(parsed.historyMode) ? parsed.historyMode : 'order',
      recentCount: typeof parsed.recentCount === 'number' ? Math.max(5, Math.min(10, parsed.recentCount)) : 8,
      eventTitle: typeof parsed.eventTitle === 'string' && parsed.eventTitle.trim() ? parsed.eventTitle : 'BINGO PARTY',
      autoDrawInterval: typeof parsed.autoDrawInterval === 'number' ? Math.max(3, Math.min(30, parsed.autoDrawInterval)) : 5,
      
      gameStarted: Boolean(parsed.gameStarted),
      drawnNumbers: Array.isArray(parsed.drawnNumbers) ? parsed.drawnNumbers.filter((n: unknown) => typeof n === 'number') : [],
      currentNumber: typeof parsed.currentNumber === 'number' ? parsed.currentNumber : null,
      previousNumber: typeof parsed.previousNumber === 'number' ? parsed.previousNumber : null,
      isDrawing: false, // Always reset transient state on page reload
      isPaused: false,
      isFinished: Boolean(parsed.isFinished),
      isAutoDrawing: false,
    };

    return state;
  } catch (e) {
    console.warn('Failed to parse localStorage state, resetting to default:', e);
    return INITIAL_APP_STATE;
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;

  try {
    // Save state without transient flags
    const toSave = {
      maxNumber: state.maxNumber,
      animSpeed: state.animSpeed,
      soundEnabled: state.soundEnabled,
      voiceEnabled: state.voiceEnabled,
      volume: state.volume,
      confettiEnabled: state.confettiEnabled,
      theme: state.theme,
      historyMode: state.historyMode,
      recentCount: state.recentCount,
      eventTitle: state.eventTitle,
      autoDrawInterval: state.autoDrawInterval,
      gameStarted: state.gameStarted,
      drawnNumbers: state.drawnNumbers,
      currentNumber: state.currentNumber,
      previousNumber: state.previousNumber,
      isFinished: state.isFinished,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function clearSavedState() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
