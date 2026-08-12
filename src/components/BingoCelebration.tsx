import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { PartyPopper, X, Trophy } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BingoCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const BingoCelebration: React.FC<BingoCelebrationProps> = ({
  isOpen,
  onClose,
  title = 'BINGO!',
  subtitle = 'おめでとうございます！ビンゴ達成！',
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playFanfare();

      // Launch multi-stage confetti fireworks
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-900/60 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-8 sm:p-12 shadow-[0_0_100px_rgba(245,158,11,0.5)] text-center flex flex-col items-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-20 w-80 h-80 bg-amber-500/30 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="w-24 h-24 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_50px_#f59e0b] mb-6"
        >
          <Trophy className="w-12 h-12" />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 tracking-wider mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          {title}
        </motion.h1>

        <p className="text-xl sm:text-2xl font-black text-amber-200 mb-8 tracking-wide">
          {subtitle}
        </p>

        <button
          onClick={onClose}
          className="px-10 py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xl rounded-2xl shadow-xl flex items-center gap-3 transition hover:scale-105 active:scale-95"
        >
          <PartyPopper className="w-6 h-6 animate-bounce" />
          ステージに戻る (Close)
        </button>
      </div>
    </div>
  );
};
