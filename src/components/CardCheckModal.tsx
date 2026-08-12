import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';

interface CardCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawnNumbers: number[];
  maxNumber: number;
}

export const CardCheckModal: React.FC<CardCheckModalProps> = ({
  isOpen,
  onClose,
  drawnNumbers,
  maxNumber,
}) => {
  const [inputStr, setInputStr] = useState<string>('');
  const drawnSet = new Set(drawnNumbers);

  if (!isOpen) return null;

  // Extract valid numbers from input string (separated by spaces, commas, or line breaks)
  const enteredNums = inputStr
    .replace(/[，、]/g, ',')
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= maxNumber);

  // Remove duplicates while preserving order
  const uniqueNums = Array.from(new Set(enteredNums));

  const allDrawn = uniqueNums.length > 0 && uniqueNums.every((n) => drawnSet.has(n));

  const handleQuickAdd = (num: number) => {
    if (uniqueNums.includes(num)) return;
    setInputStr((prev) => (prev.trim() ? `${prev.trim()}, ${num}` : String(num)));
  };

  const handleClear = () => {
    setInputStr('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">ビンゴカード当選判定ツール</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          「ビンゴ！」と名乗り出た参加者のカード番号を入力してください。過去に出た番号かどうかを瞬時に検証します。
        </p>

        {/* Input box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-amber-300">
              確認する番号 (カンマやスペース区切り):
            </label>
            {inputStr && (
              <button
                onClick={handleClear}
                className="text-[11px] font-bold text-rose-400 hover:underline"
              >
                クリア
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="例: 12, 28, 34, 52, 68"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-base text-amber-300 focus:outline-none focus:border-amber-400 shadow-inner"
          />
        </div>

        {/* Verification Result Banner */}
        {uniqueNums.length > 0 && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              allDrawn
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-rose-500/20 border-rose-500/80 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {allDrawn ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 animate-bounce" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <div className="font-black text-lg">
                  {allDrawn ? '🎉 ビンゴ成立！（全番号確定）' : '❌ 未出の番号が含まれています'}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  検証対象: {uniqueNums.length} 個のうち {uniqueNums.filter((n) => drawnSet.has(n)).length} 個が出現済み
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Number List Status Cards */}
        {uniqueNums.length > 0 && (
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
            {uniqueNums.map((num) => {
              const isDrawn = drawnSet.has(num);
              return (
                <div
                  key={`check-${num}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                    isDrawn
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-400'
                  }`}
                >
                  <span>{num}</span>
                  <span>{isDrawn ? '✅ 出た' : '❌ 未'}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition text-xs shadow-lg"
          >
            閉じる (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
