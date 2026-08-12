import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, HelpCircle, Search } from 'lucide-react';

interface HeaderBarProps {
  eventTitle: string;
  maxNumber: number;
  drawnCount: number;
  soundEnabled: boolean;
  volume: number;
  isFullscreen: boolean;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onOpenHelp: () => void;
  onOpenCardCheck: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  eventTitle,
  maxNumber,
  drawnCount,
  soundEnabled,
  volume,
  isFullscreen,
  onToggleSound,
  onToggleFullscreen,
  onOpenHelp,
  onOpenCardCheck,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-20">
      {/* Title Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 leading-tight">
            {eventTitle || 'BINGO PARTY'}
          </h1>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
            STAGE LOTTERY PRO
          </span>
        </div>
      </div>

      {/* Progress Badge */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs font-extrabold text-slate-300">
        <span>上限: <strong className="text-amber-400">{maxNumber}</strong></span>
        <span className="text-slate-600">|</span>
        <span>出た数: <strong className="text-emerald-400">{drawnCount}</strong></span>
        <span className="text-slate-600">|</span>
        <span>残り: <strong className="text-amber-400">{maxNumber - drawnCount}</strong></span>
      </div>

      {/* Quick Utility Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCardCheck}
          className="p-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 transition text-xs flex items-center gap-1.5 font-black shadow-md"
          title="参加者のカード番号検証"
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">当選判定</span>
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition text-xs flex items-center gap-1 font-bold"
          title="キーボード操作ヘルプ"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">操作キー</span>
        </button>

        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          title="音量切り替え [M]"
        >
          {soundEnabled && volume > 0 ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          title="全画面切り替え [F]"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
