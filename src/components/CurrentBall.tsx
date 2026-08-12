import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme } from '../types';
import { getBallColor } from '../utils/colors';

interface CurrentBallProps {
  currentNumber: number | null;
  previousNumber: number | null;
  drawnNumbers: number[];
  maxNumber: number;
  isDrawing: boolean;
  isFinished: boolean;
  theme: AppTheme;
}

export const CurrentBall: React.FC<CurrentBallProps> = ({
  currentNumber,
  previousNumber,
  drawnNumbers,
  maxNumber,
  isDrawing,
  isFinished,
  theme,
}) => {
  const [scrambleNum, setScrambleNum] = useState<number>(1);

  // Rapid number scramble during draw animation
  useEffect(() => {
    let timer: number | null = null;
    if (isDrawing) {
      timer = window.setInterval(() => {
        setScrambleNum(Math.floor(Math.random() * maxNumber) + 1);
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDrawing, maxNumber]);

  const remainingCount = maxNumber - drawnNumbers.length;
  const displayNum = isDrawing ? scrambleNum : currentNumber;
  const ballColor = displayNum ? getBallColor(displayNum, maxNumber, theme) : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)]">
      {/* Header Tag */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
          <h2 className="text-sm md:text-base font-extrabold tracking-wider text-slate-300 uppercase">
            今回の番号
          </h2>
        </div>
        <div className="px-3 py-1 bg-slate-800/90 rounded-full border border-slate-700 text-xs font-bold text-amber-400">
          残り <span className="text-sm font-black text-white">{remainingCount}</span> / {maxNumber} 個
        </div>
      </div>

      {/* Main Stage Ball Area */}
      <div className="relative my-auto flex flex-col items-center justify-center w-full min-h-[220px]">
        {/* Glow halo ring behind current ball */}
        {ballColor && !isDrawing && (
          <div
            className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: ballColor.glowColor }}
          />
        )}

        <AnimatePresence mode="wait">
          {isDrawing ? (
            <motion.div
              key="scramble"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-2xl border-4 border-amber-400/80"
              style={{
                background: ballColor?.bgGradient || 'radial-gradient(circle at 35% 35%, #38bdf8, #0369a1)',
              }}
            >
              {/* White inner number plate */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white/95 flex items-center justify-center shadow-inner border-2 border-slate-300/80">
                <span className="font-black text-6xl sm:text-7xl md:text-8xl text-slate-900 tracking-tighter animate-pulse">
                  {scrambleNum}
                </span>
              </div>
            </motion.div>
          ) : currentNumber !== null && ballColor ? (
            <motion.div
              key={`ball-${currentNumber}`}
              initial={{ scale: 0.2, rotate: -30, opacity: 0, y: 50 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18,
              }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 transition-transform hover:scale-105 cursor-default"
              style={{
                background: ballColor.bgGradient,
                borderColor: ballColor.borderColor,
                boxShadow: `0 0 40px ${ballColor.glowColor}, inset 0 8px 16px rgba(255,255,255,0.4), inset 0 -12px 20px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Glossy Top Reflection */}
              <div className="absolute top-3 left-6 w-24 h-12 rounded-full bg-gradient-to-b from-white/40 to-transparent blur-[1px] pointer-events-none" />

              {/* Inner White Number Disc */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] border-2 border-slate-200">
                <span className="font-black text-6xl sm:text-7xl md:text-8xl text-slate-900 tracking-tighter leading-none select-none">
                  {currentNumber}
                </span>
              </div>
            </motion.div>
          ) : isFinished ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-2xl border border-amber-500/40"
            >
              <span className="text-5xl mb-2">🎉</span>
              <h3 className="text-2xl font-black text-amber-300 mb-1">
                全番号の抽選が完了！
              </h3>
              <p className="text-xs text-slate-300">
                すべての番号が選ばれました。おめでとうございます！
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full border-4 border-dashed border-slate-600 bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 gap-2"
            >
              <span className="text-5xl md:text-6xl font-black text-slate-500">?</span>
              <span className="text-xs md:text-sm font-bold tracking-widest text-slate-400">
                ボタンを押して抽選
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info: Previous Number Pill */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">直前の番号:</span>
          {previousNumber !== null ? (
            <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-600 flex items-center gap-1.5 shadow">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{
                  backgroundColor: getBallColor(previousNumber, maxNumber, theme).borderColor,
                }}
              />
              <span className="font-extrabold text-white text-base">
                {previousNumber}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-medium">なし</span>
          )}
        </div>

        {/* Progress percent indicator */}
        <div className="text-xs font-bold text-slate-400">
          進行率: <span className="text-amber-400">{Math.round((drawnNumbers.length / maxNumber) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
