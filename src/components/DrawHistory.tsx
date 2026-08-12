import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme, HistoryMode } from '../types';
import { getBallColor } from '../utils/colors';

interface DrawHistoryProps {
  drawnNumbers: number[];
  currentNumber: number | null;
  maxNumber: number;
  historyMode: HistoryMode;
  onToggleHistoryMode: (mode: HistoryMode) => void;
  recentCount: number;
  theme: AppTheme;
}

export const DrawHistory: React.FC<DrawHistoryProps> = ({
  drawnNumbers,
  currentNumber,
  maxNumber,
  historyMode,
  onToggleHistoryMode,
  recentCount = 8,
  theme,
}) => {
  // Ordered array of drawn numbers (latest drawn is at drawnNumbers[drawnNumbers.length - 1])
  const reversedDrawn = [...drawnNumbers].reverse();
  const recentDrawn = reversedDrawn.slice(0, recentCount);
  const olderDrawn = reversedDrawn.slice(recentCount);

  const drawnSet = new Set(drawnNumbers);

  // Dynamic Grid Column calculation based on maxNumber for clean projector viewing
  const getGridCols = () => {
    if (maxNumber <= 50) return 'grid-cols-5 sm:grid-cols-10';
    if (maxNumber <= 75) return 'grid-cols-5 sm:grid-cols-10 md:grid-cols-15';
    if (maxNumber <= 100) return 'grid-cols-5 sm:grid-cols-10 md:grid-cols-10';
    if (maxNumber <= 200) return 'grid-cols-10 sm:grid-cols-15 md:grid-cols-20';
    return 'grid-cols-10 sm:grid-cols-20';
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 md:p-4 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Header with Mode Toggle Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <h3 className="text-sm md:text-base font-extrabold text-slate-200 flex items-center gap-2">
          <span className="text-amber-400 text-lg">📜</span>
          抽選履歴
          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-bold">
            {drawnNumbers.length} 件
          </span>
        </h3>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onToggleHistoryMode('order')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              historyMode === 'order'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            抽選順
          </button>
          <button
            onClick={() => onToggleHistoryMode('grid')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              historyMode === 'grid'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            一覧表
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 my-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {historyMode === 'order' ? (
          /* Draw Order View */
          <div className="space-y-4">
            {drawnNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center gap-2">
                <span className="text-4xl opacity-50">🎲</span>
                <p className="text-xs md:text-sm font-medium">まだ番号がありません</p>
              </div>
            ) : (
              <>
                {/* Recent Prominent Numbers */}
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    🔥 直近の抽選番号 (最新 {recentDrawn.length} 件)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    <AnimatePresence>
                      {recentDrawn.map((num, idx) => {
                        const isLatest = idx === 0;
                        const ballColor = getBallColor(num, maxNumber, theme);
                        const labelText = isLatest
                          ? '最新'
                          : idx === 1
                          ? '1つ前'
                          : `${idx}つ前`;

                        return (
                          <motion.div
                            key={`history-order-${num}-${idx}`}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            layout
                            className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all ${
                              isLatest
                                ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105'
                                : 'bg-slate-800/60 border-slate-700'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1 ${
                                isLatest
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {labelText}
                            </span>

                            {/* Mini glossy ball */}
                            <div
                              className={`flex items-center justify-center rounded-full font-black text-white shadow-lg border ${
                                isLatest
                                  ? 'w-14 h-14 text-2xl border-white'
                                  : 'w-10 h-10 text-lg border-white/60'
                              }`}
                              style={{
                                background: ballColor.bgGradient,
                                borderColor: ballColor.borderColor,
                              }}
                            >
                              {num}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Older Drawn Numbers Scroll List */}
                {olderDrawn.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      過去の抽選履歴 ({olderDrawn.length} 件)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {olderDrawn.map((num) => {
                        const ballColor = getBallColor(num, maxNumber, theme);
                        return (
                          <div
                            key={`older-${num}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow border"
                            style={{
                              background: ballColor.bgGradient,
                              borderColor: ballColor.borderColor,
                            }}
                            title={`出た番号: ${num}`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Number Grid View (1 to maxNumber) */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>番号一覧 (1 ～ {maxNumber})</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 出た
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> 未
                </span>
              </span>
            </div>

            <div className={`grid ${getGridCols()} gap-1.5`}>
              {Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => {
                const isDrawn = drawnSet.has(num);
                const isCurrent = currentNumber === num;
                const ballColor = isDrawn ? getBallColor(num, maxNumber, theme) : null;

                return (
                  <div
                    key={`grid-num-${num}`}
                    className={`relative aspect-square flex items-center justify-center rounded-lg font-black text-xs md:text-sm transition-all select-none ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110 z-10 shadow-[0_0_15px_#f59e0b]'
                        : ''
                    } ${
                      isDrawn
                        ? 'text-white shadow border border-white/40'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-500 opacity-60'
                    }`}
                    style={
                      isDrawn && ballColor
                        ? {
                            background: ballColor.bgGradient,
                            borderColor: ballColor.borderColor,
                          }
                        : {}
                    }
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats Summary */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          出た割合: <span className="text-amber-400 font-bold">{drawnNumbers.length}</span> / {maxNumber}
        </div>
        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
            style={{ width: `${(drawnNumbers.length / maxNumber) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
