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
        className="w-full min-h-[300px] px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y font-sans text-sm leading-relaxed"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          lineHeight: '1.75',
        }}
      />
      <div className="mt-2 text-xs text-slate-500 space-y-1">
        <p>Maslahat: Markdown formatidan foydalaning:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li><code className="bg-slate-800 px-1 rounded">## Sarlavha</code></li>
          <li><code className="bg-slate-800 px-1 rounded">**qalin**</code> yoki <code className="bg-slate-800 px-1 rounded">*yotiq*</code></li>
          <li><code className="bg-slate-800 px-1 rounded">`code`</code></li>
          <li>Satrlar masofasi avtomatik saqlanadi</li>
        </ul>
      </div>
    </div>
  );
}
