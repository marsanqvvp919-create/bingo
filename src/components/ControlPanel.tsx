import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  RotateCcw,
  Undo2,
  Pause,
  Play,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { HistoryMode } from '../types';

interface ControlPanelProps {
  isDrawing: boolean;
  isPaused: boolean;
  isFinished: boolean;
  isAutoDrawing: boolean;
  soundEnabled: boolean;
  volume: number;
  historyMode: HistoryMode;
  isFullscreen: boolean;
  onStartDraw: () => void;
  onTogglePause: () => void;
  onToggleAutoDraw: () => void;
  onToggleSound: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleFullscreen: () => void;
  onToggleHistoryMode: (mode: HistoryMode) => void;
  onOpenSettings: () => void;
  onRequestUndo: () => void;
  onRequestReset: () => void;
  onTriggerBingoCelebration: () => void;
  drawnCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isDrawing,
  isPaused,
  isFinished,
  isAutoDrawing,
  soundEnabled,
  volume,
  historyMode,
  isFullscreen,
  onStartDraw,
  onTogglePause,
  onToggleAutoDraw,
  onToggleSound,
  onChangeVolume,
  onToggleFullscreen,
  onToggleHistoryMode,
  onOpenSettings,
  onRequestUndo,
  onRequestReset,
  onTriggerBingoCelebration,
  drawnCount,
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-3 p-3 md:p-4 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/80 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-20">
      {/* Primary Draw Button Row */}
      <div className="w-full max-w-4xl flex items-center justify-center gap-4">
        {/* Main HUGE Draw Button */}
        <button
          onClick={onStartDraw}
          disabled={isDrawing || isFinished}
          className={`relative group flex-1 max-w-xl py-4 md:py-5 px-8 rounded-3xl font-black text-2xl md:text-3xl text-white tracking-widest transition-all duration-200 transform shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 ${
            isFinished
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : isDrawing
              ? 'bg-amber-600 cursor-wait animate-pulse border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 bg-[length:200%_auto] hover:bg-right hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] border-2 border-amber-300'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            {isDrawing ? (
              <>
                <span className="inline-block w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span>ガラガラ回転中…</span>
              </>
            ) : isFinished ? (
              <span>すべての抽選が完了しました</span>
            ) : (
              <>
                <Sparkles className="w-8 h-8 text-amber-200 animate-spin" />
                <span>ガラガラを回す (DRAW)</span>
              </>
            )}
          </div>
          {/* Subtle Key Shortcut Pill */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-block px-2.5 py-1 bg-slate-950/60 rounded-lg text-xs font-bold text-amber-200/80 border border-amber-400/30">
            [Space / Enter]
          </span>
        </button>

        {/* Dedicated "BINGO!" Celebration Stage Button */}
        <button
          onClick={onTriggerBingoCelebration}
          title="BINGO祝賀演出"
          className="flex flex-col items-center justify-center px-5 py-3 md:py-4 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 hover:from-amber-300 hover:to-amber-600 text-slate-950 rounded-2xl font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-200 transition-all active:scale-95 hover:scale-105"
        >
          <PartyPopper className="w-6 h-6 mb-0.5 animate-bounce" />
          <span className="text-sm tracking-wider">BINGO!</span>
        </button>
      </div>

      {/* Secondary Controls Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-300">
        {/* Left Side: Game control buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Auto Draw Toggle */}
          <button
            onClick={onToggleAutoDraw}
            disabled={isFinished}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-extrabold border ${
              isAutoDrawing
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            } disabled:opacity-40`}
            title="自動抽選モードON/OFF"
          >
            <Play className={`w-4 h-4 ${isAutoDrawing ? 'fill-slate-950' : 'text-amber-400'}`} />
            <span>{isAutoDrawing ? '自動抽選: ON' : '自動抽選: OFF'}</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            disabled={!isDrawing}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              isPaused
                ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
            } disabled:opacity-40 border border-slate-700`}
            title="抽選一時停止"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? '再開' : '一時停止'}</span>
          </button>

          {/* Undo Last Draw */}
          <button
            onClick={onRequestUndo}
            disabled={isDrawing || drawnCount === 0}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 flex items-center gap-1.5 transition disabled:opacity-40 border border-slate-700"
            title="直前の番号を取り消す"
          >
            <Undo2 className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">1つ前を取り消す</span>
          </button>

          {/* Reset Game */}
          <button
            onClick={onRequestReset}
            disabled={isDrawing}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition disabled:opacity-40 border border-slate-700"
            title="抽選をリセット"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">リセット</span>
          </button>
        </div>

        {/* Right Side: Display & System Utility buttons */}
        <div className="flex items-center gap-1.5 flex-wrap relative">
          {/* History Mode Toggle */}
          <button
            onClick={() => onToggleHistoryMode(historyMode === 'order' ? 'grid' : 'order')}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition border border-slate-700"
            title="履歴表示切り替え [H]"
          >
            <span>{historyMode === 'order' ? '一覧表' : '抽選順'}</span>
          </button>

          {/* Volume Control Button + Slider Popover */}
          <div className="relative">
            <button
              onClick={() => {
                onToggleSound();
                setShowVolumePopup(!showVolumePopup);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition border border-slate-700"
              title="音量ON/OFF [M]"
            >
              {soundEnabled && volume > 0 ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
              <span className="hidden sm:inline">{soundEnabled && volume > 0 ? `${Math.round(volume * 100)}%` : '消音'}</span>
            </button>

            {/* Volume Popover */}
            {showVolumePopup && (
              <div className="absolute bottom-12 right-0 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[140px] z-30">
                <span className="text-[11px] font-bold text-slate-400">音量調整</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition border border-slate-700"
            title="全画面表示 [F]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? '解除' : '全画面'}</span>
          </button>

          {/* Settings Modal Open */}
          <button
            onClick={onOpenSettings}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition border border-slate-700"
            title="設定画面を開く"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">設定</span>
          </button>
        </div>
      </div>
    </div>
  );
};
