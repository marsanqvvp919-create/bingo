export type AnimationSpeed = 'short' | 'standard' | 'long';
export type HistoryMode = 'order' | 'grid';
export type AppTheme = 'dark-stage' | 'neon-cyber' | 'gold-luxury' | 'classic-royal';

export interface AppSettings {
  maxNumber: number;
  animSpeed: AnimationSpeed;
  soundEnabled: boolean;
  voiceEnabled: boolean; // Speech readout
  volume: number; // 0.0 to 1.0
  confettiEnabled: boolean;
  theme: AppTheme;
  historyMode: HistoryMode;
  recentCount: number; // 5 to 10
  eventTitle: string; // Custom stage title
  autoDrawInterval: number; // seconds for auto draw
}

export interface AppState extends AppSettings {
  gameStarted: boolean;
  drawnNumbers: number[]; // Ordered array of drawn numbers
  currentNumber: number | null;
  previousNumber: number | null;
  isDrawing: boolean;
  isPaused: boolean;
  isFinished: boolean;
  isAutoDrawing: boolean;
}

export interface BallColor {
  bgGradient: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  name: string;
}
