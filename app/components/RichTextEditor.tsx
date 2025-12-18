"use client";

import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] bg-slate-900/50 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Matn yozing..."}
        className="w-full h-[300px] px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono text-sm"
      />
      <p className="text-xs text-slate-500 mt-2">
        Maslahat: Markdown formatidan foydalaning (## sarlavha, **qalin**, *yotiq*, `code`)
      </p>
    </div>
  );
}
