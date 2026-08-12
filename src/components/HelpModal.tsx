import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space / Enter', desc: '抽選スタート / ガラガラを回す' },
    { key: 'F', desc: '全画面表示 (フルスクリーン) 切り替え' },
    { key: 'M', desc: '音量 ON / OFF (ミュート) 切り替え' },
    { key: 'H', desc: '履歴表示モード (抽選順 / 一覧表) 切り替え' },
    { key: 'Esc', desc: '設定モーダルや確認ダイアログを閉じる' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">キーボード操作ガイド</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          ステージ上のパソコン操作をキーボードだけでスピーディーに進行できます。入力フォーカス中は誤操作防止のため無効化されます。
        </p>

        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs"
            >
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-amber-300 rounded-lg font-mono font-black">
                {s.key}
              </span>
              <span className="font-bold text-slate-300 text-right">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition text-xs"
          >
            閉じる (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
