import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppState, AppSettings, HistoryMode } from './types';
import { loadSavedState, saveState } from './utils/storage';
import { pickNextBingoNumber } from './utils/random';
import { soundManager } from './utils/audio';

import { HeaderBar } from './components/HeaderBar';
import { BingoMachine } from './components/BingoMachine';
import { CurrentBall } from './components/CurrentBall';
import { DrawHistory } from './components/DrawHistory';
import { ControlPanel } from './components/ControlPanel';
import { StartScreen } from './components/StartScreen';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { BingoCelebration } from './components/BingoCelebration';
import { HelpModal } from './components/HelpModal';
import { CardCheckModal } from './components/CardCheckModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadSavedState());

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCardCheckOpen, setIsCardCheckOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Confirm Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const drawTimerRef = useRef<number | null>(null);
  const autoDrawIntervalRef = useRef<number | null>(null);

  // Synchronize audio manager settings
  useEffect(() => {
    soundManager.setMuted(!state.soundEnabled);
    soundManager.setVolume(state.volume);
  }, [state.soundEnabled, state.volume]);

  // Persist state to localStorage whenever changed
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Track Fullscreen status
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Toggle Fullscreen helper
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Safe fallback if fullscreen API blocked by browser permissions
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Main Draw Start Handler
  const handleStartDraw = useCallback(() => {
    if (state.isDrawing || state.isFinished) return;

    soundManager.playClick();

    const nextNum = pickNextBingoNumber(state.drawnNumbers, state.maxNumber);
    if (nextNum === null) {
      setState((prev) => ({ ...prev, isFinished: true, isAutoDrawing: false }));
      soundManager.playFanfare();
      return;
    }

    setState((prev) => ({ ...prev, isDrawing: true, isPaused: false }));
    soundManager.startRollSound();

    // Calculate animation duration (Short: 2s, Standard: 4s, Long: 6s)
    const totalDuration =
      state.animSpeed === 'short' ? 2000 : state.animSpeed === 'long' ? 6000 : 4000;

    // Chute roll effect sound trigger towards end
    const chuteTimeout = window.setTimeout(() => {
      soundManager.playChuteRoll();
    }, totalDuration * 0.75);

    drawTimerRef.current = window.setTimeout(() => {
      clearTimeout(chuteTimeout);
      soundManager.stopRollSound();
      soundManager.playChimeResult();

      // Voice Readout
      soundManager.speakNumber(nextNum, state.voiceEnabled);

      setState((prev) => {
        const updatedDrawn = [...prev.drawnNumbers, nextNum];
        const isCompleted = updatedDrawn.length >= prev.maxNumber;

        if (isCompleted) {
          soundManager.playFanfare();
        }

        return {
          ...prev,
          isDrawing: false,
          previousNumber: prev.currentNumber,
          currentNumber: nextNum,
          drawnNumbers: updatedDrawn,
          isFinished: isCompleted,
          isAutoDrawing: isCompleted ? false : prev.isAutoDrawing,
        };
      });

      // Confetti burst on draw completion
      if (state.confettiEnabled) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, totalDuration);
  }, [
    state.isDrawing,
    state.isFinished,
    state.drawnNumbers,
    state.maxNumber,
    state.animSpeed,
    state.confettiEnabled,
    state.voiceEnabled,
  ]);

  // Auto Draw Mode Loop Effect
  useEffect(() => {
    if (state.isAutoDrawing && !state.isDrawing && !state.isFinished && !state.isPaused) {
      const ms = (state.autoDrawInterval || 5) * 1000;
      autoDrawIntervalRef.current = window.setTimeout(() => {
        handleStartDraw();
      }, ms);
    }

    return () => {
      if (autoDrawIntervalRef.current) {
        clearTimeout(autoDrawIntervalRef.current);
      }
    };
  }, [state.isAutoDrawing, state.isDrawing, state.isFinished, state.isPaused, state.autoDrawInterval, handleStartDraw]);

  // Toggle Auto Draw Mode
  const handleToggleAutoDraw = () => {
    soundManager.playClick();
    setState((prev) => {
      const nextVal = !prev.isAutoDrawing;
      return { ...prev, isAutoDrawing: nextVal };
    });
  };

  // Pause / Resume Toggle
  const handleTogglePause = () => {
    if (!state.isDrawing) return;
    soundManager.playClick();
    if (!state.isPaused) {
      if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
      soundManager.stopRollSound();
      setState((prev) => ({ ...prev, isPaused: true, isDrawing: false, isAutoDrawing: false }));
    }
  };

  // Undo Last Draw Request
  const handleRequestUndo = () => {
    if (state.drawnNumbers.length === 0 || state.isDrawing) return;

    const lastNum = state.drawnNumbers[state.drawnNumbers.length - 1];
    setConfirmModal({
      isOpen: true,
      title: '1つ前の抽選を取り消し',
      message: `直前に出た番号「${lastNum}」の抽選を取り消し、未抽選の状態へ戻しますか？`,
      type: 'danger',
      onConfirm: () => {
        soundManager.playUndo();
        setState((prev) => {
          const newDrawn = prev.drawnNumbers.slice(0, -1);
          const newCurrent = newDrawn.length > 0 ? newDrawn[newDrawn.length - 1] : null;
          const newPrev = newDrawn.length > 1 ? newDrawn[newDrawn.length - 2] : null;

          return {
            ...prev,
            drawnNumbers: newDrawn,
            currentNumber: newCurrent,
            previousNumber: newPrev,
            isFinished: false,
          };
        });
        setConfirmModal((cm) => ({ ...cm, isOpen: false }));
      },
    });
  };

  // Reset Game Request
  const handleRequestReset = () => {
    setConfirmModal({
      isOpen: true,
      title: '抽選データのリセット',
      message: 'これまでの抽選履歴をすべて削除して、最初からビンゴ大会をやり直しますか？',
      type: 'danger',
      onConfirm: () => {
        soundManager.playClick();
        if (drawTimerRef.current) clearTimeout(drawTimerRef.current);
        soundManager.stopRollSound();

        setState((prev) => ({
          ...prev,
          gameStarted: false,
          drawnNumbers: [],
          currentNumber: null,
          previousNumber: null,
          isDrawing: false,
          isPaused: false,
          isFinished: false,
          isAutoDrawing: false,
        }));
        setConfirmModal((cm) => ({ ...cm, isOpen: false }));
      },
    });
  };

  // Change Max Number Limit with safety confirm if game in progress
  const handleRequestChangeMaxNumber = (newMax: number) => {
    if (state.drawnNumbers.length > 0) {
      setConfirmModal({
        isOpen: true,
        title: '上限番号の変更確認',
        message: `上限番号を「1 ～ ${newMax}」に変更すると、現在の抽選履歴がリセットされます。よろしいですか？`,
        type: 'warning',
        onConfirm: () => {
          setState((prev) => ({
            ...prev,
            maxNumber: newMax,
            drawnNumbers: [],
            currentNumber: null,
            previousNumber: null,
            isFinished: false,
            isAutoDrawing: false,
          }));
          setIsSettingsOpen(false);
          setConfirmModal((cm) => ({ ...cm, isOpen: false }));
        },
      });
    } else {
      setState((prev) => ({ ...prev, maxNumber: newMax }));
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if focus is inside text input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(targetTag) || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      // Ignore shortcut keys if modals are open (except Esc)
      if (confirmModal.isOpen || isSettingsOpen || isHelpOpen || isCelebrationOpen || isCardCheckOpen) {
        if (e.key === 'Escape') {
          setConfirmModal((cm) => ({ ...cm, isOpen: false }));
          setIsSettingsOpen(false);
          setIsHelpOpen(false);
          setIsCelebrationOpen(false);
          setIsCardCheckOpen(false);
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleStartDraw();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          historyMode: prev.historyMode === 'order' ? 'grid' : 'order',
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleStartDraw,
    toggleFullscreen,
    confirmModal.isOpen,
    isSettingsOpen,
    isHelpOpen,
    isCelebrationOpen,
    isCardCheckOpen,
  ]);

  // Save Settings Helper
  const handleSaveSettings = (newSettings: Partial<AppSettings>) => {
    setState((prev) => ({ ...prev, ...newSettings }));
  };

  // Theme gradient background class map
  const themeBgClasses: Record<string, string> = {
    'dark-stage': 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100',
    'neon-cyber': 'bg-gradient-to-br from-slate-950 via-cyan-950 to-indigo-950 text-slate-100',
    'gold-luxury': 'bg-gradient-to-br from-amber-950 via-slate-950 to-yellow-950 text-amber-50',
    'classic-royal': 'bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900 text-slate-100',
  };

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex flex-col justify-between font-sans select-none ${
        themeBgClasses[state.theme] || themeBgClasses['dark-stage']
      }`}
    >
      {/* Start Screen Splash / Setup Modal */}
      {!state.gameStarted && (
        <StartScreen
          initialMaxNumber={state.maxNumber}
          hasSavedSession={state.drawnNumbers.length > 0}
          savedDrawnCount={state.drawnNumbers.length}
          onStartNewGame={(maxNum) => {
            soundManager.playClick();
            setState((prev) => ({
              ...prev,
              maxNumber: maxNum,
              gameStarted: true,
              drawnNumbers: [],
              currentNumber: null,
              previousNumber: null,
              isFinished: false,
              isAutoDrawing: false,
            }));
          }}
          onResumeGame={() => {
            soundManager.playClick();
            setState((prev) => ({ ...prev, gameStarted: true }));
          }}
        />
      )}

      {/* Stage Header */}
      <HeaderBar
        eventTitle={state.eventTitle}
        maxNumber={state.maxNumber}
        drawnCount={state.drawnNumbers.length}
        soundEnabled={state.soundEnabled}
        volume={state.volume}
        isFullscreen={isFullscreen}
        onToggleSound={() => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        onToggleFullscreen={toggleFullscreen}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenCardCheck={() => setIsCardCheckOpen(true)}
      />

      {/* Main 16:9 Stage Layout (3 Columns on Desktop/Projector, Stacked on Mobile) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        {/* Left Column: Bingo Cage Machine (30% / 4 Cols) */}
        <section className="lg:col-span-4 h-full min-h-[260px] flex items-center justify-center">
          <BingoMachine
            isDrawing={state.isDrawing}
            maxNumber={state.maxNumber}
            drawnNumbers={state.drawnNumbers}
            currentNumber={state.currentNumber}
            animSpeed={state.animSpeed}
          />
        </section>

        {/* Center Column: Current Drawn Ball Stage (40% / 4 Cols) */}
        <section className="lg:col-span-4 h-full min-h-[300px] flex items-center justify-center">
          <CurrentBall
            currentNumber={state.currentNumber}
            previousNumber={state.previousNumber}
            drawnNumbers={state.drawnNumbers}
            maxNumber={state.maxNumber}
            isDrawing={state.isDrawing}
            isFinished={state.isFinished}
            theme={state.theme}
          />
        </section>

        {/* Right Column: Draw History & Grid (30% / 4 Cols) */}
        <section className="lg:col-span-4 h-full min-h-[280px] flex items-center justify-center">
          <DrawHistory
            drawnNumbers={state.drawnNumbers}
            currentNumber={state.currentNumber}
            maxNumber={state.maxNumber}
            historyMode={state.historyMode}
            onToggleHistoryMode={(mode: HistoryMode) => setState((prev) => ({ ...prev, historyMode: mode }))}
            recentCount={state.recentCount}
            theme={state.theme}
          />
        </section>
      </main>

      {/* Control Panel Footer */}
      <ControlPanel
        isDrawing={state.isDrawing}
        isPaused={state.isPaused}
        isFinished={state.isFinished}
        isAutoDrawing={state.isAutoDrawing}
        soundEnabled={state.soundEnabled}
        volume={state.volume}
        historyMode={state.historyMode}
        isFullscreen={isFullscreen}
        onStartDraw={handleStartDraw}
        onTogglePause={handleTogglePause}
        onToggleAutoDraw={handleToggleAutoDraw}
        onToggleSound={() => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        onChangeVolume={(vol) => setState((prev) => ({ ...prev, volume: vol }))}
        onToggleFullscreen={toggleFullscreen}
        onToggleHistoryMode={(mode) => setState((prev) => ({ ...prev, historyMode: mode }))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRequestUndo={handleRequestUndo}
        onRequestReset={handleRequestReset}
        onTriggerBingoCelebration={() => setIsCelebrationOpen(true)}
        drawnCount={state.drawnNumbers.length}
      />

      {/* Modals & Overlays */}
      <SettingsModal
        settings={state}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        gameInProgress={state.drawnNumbers.length > 0}
        onRequestChangeMaxNumber={handleRequestChangeMaxNumber}
      />

      <CardCheckModal
        isOpen={isCardCheckOpen}
        onClose={() => setIsCardCheckOpen(false)}
        drawnNumbers={state.drawnNumbers}
        maxNumber={state.maxNumber}
      />

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((cm) => ({ ...cm, isOpen: false }))}
      />

      <BingoCelebration
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
