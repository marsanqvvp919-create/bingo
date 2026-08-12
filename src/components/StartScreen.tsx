import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw } from 'lucide-react';

interface StartScreenProps {
  initialMaxNumber: number;
  hasSavedSession: boolean;
  savedDrawnCount: number;
  onStartNewGame: (maxNum: number) => void;
  onResumeGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  initialMaxNumber = 75,
  hasSavedSession,
  savedDrawnCount,
  onStartNewGame,
  onResumeGame,
}) => {
  const [maxNumber, setMaxNumber] = useState<number>(initialMaxNumber);
  const [customInput, setCustomInput] = useState<string>(String(initialMaxNumber));
  const [errorMsg, setErrorMsg] = useState<string>('');

  const presets = [50, 75, 90, 100];

  const handleSelectPreset = (val: number) => {
    setMaxNumber(val);
    setCustomInput(String(val));
    setErrorMsg('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomInput(valStr);

    const val = parseInt(valStr, 10);
    if (isNaN(val) || val < 10 || val > 999) {
      setErrorMsg('上限番号は 10 ～ 999 の範囲で設定してください。');
    } else {
      setErrorMsg('');
      setMaxNumber(val);
    }
  };

  const handleStartNew = () => {
    const val = parseInt(customInput, 10);
    if (isNaN(val) || val < 10 || val > 999) {
      setErrorMsg('10 ～ 999 の正しい数値を入力してください。');
      return;
    }
    onStartNewGame(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] text-center flex flex-col items-center">
        {/* Glow Header Accent */}
        <div className="absolute -top-10 w-48 h-20 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo / Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-400/30 text-amber-300 font-extrabold text-xs tracking-widest uppercase mb-4">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          Event Bingo Lottery Stage
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight mb-2 drop-shadow">
          BINGO PARTY
        </h1>
        <p className="text-sm text-slate-300 font-medium mb-8">
          使用する抽選番号の上限を設定してビンゴ大会をスタートしてください。
        </p>

        {/* Resume Session Prompt if saved data exists */}
        {hasSavedSession && (
          <div className="w-full mb-6 p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                前回の抽選データが保存されています
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                抽選済み: <span className="font-extrabold text-white">{savedDrawnCount} 個</span>
              </div>
            </div>

            <button
              onClick={onResumeGame}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              前回の続きから再開
            </button>
          </div>
        )}

        {/* Number Upper Limit Selector */}
        <div className="w-full bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-left mb-6">
          <label className="block text-xs font-extrabold text-slate-300 mb-2 uppercase tracking-wider">
            抽選番号の上限 (初期値: 75)
          </label>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`py-2.5 rounded-xl font-black text-base transition border ${
                  maxNumber === preset && customInput === String(preset)
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                1 ～ {preset}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">自由入力 (10-999):</span>
            <input
              type="number"
              min={10}
              max={999}
              value={customInput}
              onChange={handleCustomChange}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-black text-xl text-amber-300 text-center focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-rose-400 mt-2">{errorMsg}</p>
          )}
        </div>

        {/* Start Game Action Button */}
        <button
          onClick={handleStartNew}
          disabled={Boolean(errorMsg)}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 bg-[length:200%_auto] hover:bg-right text-white font-black text-xl tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.4)] border border-amber-300 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          {hasSavedSession ? '新しいビンゴ大会を始める' : 'ビンゴ大会を開始する'}
        </button>
      </div>
    </div>
  );
};
