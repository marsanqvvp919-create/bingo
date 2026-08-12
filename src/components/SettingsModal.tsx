import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, Sliders, Palette, Clock, ListOrdered, Mic, Type, Play } from 'lucide-react';
import { AppSettings, AnimationSpeed, AppTheme } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (newSettings: Partial<AppSettings>) => void;
  gameInProgress: boolean;
  onRequestChangeMaxNumber: (newMax: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  gameInProgress,
  onRequestChangeMaxNumber,
}) => {
  const [maxInput, setMaxInput] = useState<string>(String(settings.maxNumber));
  const [titleInput, setTitleInput] = useState<string>(settings.eventTitle || 'BINGO PARTY');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleMaxNumberSubmit = () => {
    const val = parseInt(maxInput, 10);
    if (isNaN(val) || val < 10 || val > 999) {
      setErrorMsg('10 ～ 999 の範囲で設定してください。');
      return;
    }

    if (val !== settings.maxNumber) {
      if (gameInProgress) {
        onRequestChangeMaxNumber(val);
      } else {
        onSaveSettings({ maxNumber: val });
      }
    }
  };

  const handleTitleSubmit = () => {
    onSaveSettings({ eventTitle: titleInput.trim() || 'BINGO PARTY' });
  };

  const speedOptions: { id: AnimationSpeed; label: string; desc: string }[] = [
    { id: 'short', label: '短い', desc: '約 2 秒' },
    { id: 'standard', label: '標準', desc: '約 4 秒' },
    { id: 'long', label: '長い', desc: '約 6 秒' },
  ];

  const themeOptions: { id: AppTheme; label: string; color: string }[] = [
    { id: 'dark-stage', label: 'ダークステージ', color: 'from-slate-900 to-slate-950 border-amber-500' },
    { id: 'neon-cyber', label: 'ネオンサイバー', color: 'from-cyan-950 to-indigo-950 border-cyan-400' },
    { id: 'gold-luxury', label: 'ゴールドラグジュアリー', color: 'from-amber-950 to-yellow-950 border-yellow-400' },
    { id: 'classic-royal', label: 'クラシックロイヤル', color: 'from-purple-950 to-slate-950 border-purple-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">アプリ詳細設定</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-4 text-xs sm:text-sm">
          {/* Event Title Setting */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-amber-400" /> イベントタイトル表示
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="例: 2026年度 懇親ビンゴ大会"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleTitleSubmit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shrink-0"
              >
                保存
              </button>
            </div>
          </div>

          {/* Max Number Setting */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>🎯</span> 上限番号の設定 (10 ~ 999)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={10}
                max={999}
                value={maxInput}
                onChange={(e) => {
                  setMaxInput(e.target.value);
                  setErrorMsg('');
                }}
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl font-black text-lg text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleMaxNumberSubmit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition"
              >
                変更適用
              </button>
            </div>
            {errorMsg && <p className="text-xs font-bold text-rose-400">{errorMsg}</p>}
            {gameInProgress && (
              <p className="text-[11px] text-amber-400/90 font-medium">
                ※ 抽選中に上限番号を変更すると、現在の履歴がリセットされます。
              </p>
            )}
          </div>

          {/* Animation Speed */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> 抽選アニメーションの速度
            </label>
            <div className="grid grid-cols-3 gap-2">
              {speedOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSaveSettings({ animSpeed: opt.id })}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition ${
                    settings.animSpeed === opt.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-black text-base">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Speech Readout Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-amber-400" /> 番号の自動音声読み上げ (日本語)
            </label>
            <button
              onClick={() => onSaveSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`px-3 py-1 rounded-full font-bold text-xs transition ${
                settings.voiceEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto Draw Interval */}
          <div className="space-y-2 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center font-extrabold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Play className="w-4 h-4 text-amber-400" /> 自動抽選モードの間隔 (秒)
              </span>
              <span className="text-amber-400">{settings.autoDrawInterval} 秒</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={settings.autoDrawInterval}
              onChange={(e) => onSaveSettings({ autoDrawInterval: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Sound & Volume */}
          <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                効果音 (SFX)
              </label>
              <button
                onClick={() => onSaveSettings({ soundEnabled: !settings.soundEnabled })}
                className={`px-3 py-1 rounded-full font-bold text-xs transition ${
                  settings.soundEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>音量</span>
                  <span>{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => onSaveSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Confetti Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> 確定時の紙吹雪演出
            </label>
            <button
              onClick={() => onSaveSettings({ confettiEnabled: !settings.confettiEnabled })}
              className={`px-3 py-1 rounded-full font-bold text-xs transition ${
                settings.confettiEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.confettiEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Stage Background Theme */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" /> 背景テーマデザイン
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  onClick={() => onSaveSettings({ theme: th.id })}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between bg-gradient-to-r ${th.color} transition ${
                    settings.theme === th.id
                      ? 'ring-2 ring-amber-400 font-bold shadow-lg scale-102'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="font-bold text-white text-xs">{th.label}</span>
                  {settings.theme === th.id && <span className="text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Recent History Display Count */}
          <div className="space-y-2 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center font-extrabold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-amber-400" /> 直近履歴の強調表示件数
              </span>
              <span className="text-amber-400">{settings.recentCount} 件</span>
            </div>
            <input
              type="range"
              min="5"
              max="10"
              step="1"
              value={settings.recentCount}
              onChange={(e) => onSaveSettings({ recentCount: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition"
          >
            完了 (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
