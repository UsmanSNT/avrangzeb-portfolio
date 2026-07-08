"use client";

import { useEffect, useRef, useState } from 'react';
import { compressImageToBox, uploadImage } from '@/lib/upload';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type ToolbarAction =
  | { type: 'wrap'; before: string; after?: string; placeholder: string }
  | { type: 'linePrefix'; prefix: string }
  | { type: 'insert'; text: string; cursorOffset: number };

const TOOLBAR_BUTTONS: { label: string; title: string; action: ToolbarAction }[] = [
  { label: 'B', title: 'Qalin matn (bold)', action: { type: 'wrap', before: '**', placeholder: 'qalin matn' } },
  { label: 'I', title: "Yotiq matn (italic)", action: { type: 'wrap', before: '*', placeholder: 'yotiq matn' } },
  { label: '</>', title: 'Ichki kod (inline code)', action: { type: 'wrap', before: '`', placeholder: 'kod' } },
  { label: 'H', title: 'Sarlavha', action: { type: 'linePrefix', prefix: '## ' } },
  { label: '•', title: "Ro'yxat elementi", action: { type: 'linePrefix', prefix: '- ' } },
  { label: '🔗', title: 'Havola qo\'shish', action: { type: 'insert', text: '[matn](https://)', cursorOffset: 1 } },
  {
    label: '{ }',
    title: "Kod bloki qo'shish",
    action: { type: 'insert', text: '\n```\n\n```\n', cursorOffset: 5 },
  },
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const focusSelection = (start: number, end: number) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  };

  const runAction = (action: ToolbarAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const current = value || '';
    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;

    if (action.type === 'wrap') {
      const after = action.after ?? action.before;
      const selected = current.slice(start, end) || action.placeholder;
      const next = current.slice(0, start) + action.before + selected + after + current.slice(end);
      onChange(next);
      focusSelection(start + action.before.length, start + action.before.length + selected.length);
      return;
    }

    if (action.type === 'linePrefix') {
      const lineStart = current.lastIndexOf('\n', start - 1) + 1;
      const next = current.slice(0, lineStart) + action.prefix + current.slice(lineStart);
      onChange(next);
      const cursor = start + action.prefix.length;
      focusSelection(cursor, cursor);
      return;
    }

    // insert
    const next = current.slice(0, start) + action.text + current.slice(end);
    onChange(next);
    const cursor = start + action.text.length - action.cursorOffset;
    focusSelection(cursor, cursor);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      // Fits the image inside a ~480x600 box (desktop display size) while
      // preserving its source aspect ratio - landscape or portrait alike -
      // instead of only capping width, which left tall portrait images huge.
      const compressed = await compressImageToBox(file, 480, 640, 0.85);
      const result = await uploadImage(compressed, 'notes');

      if (result.success && result.url) {
        const textarea = textareaRef.current;
        const current = value || '';
        const start = textarea?.selectionStart ?? current.length;
        const end = textarea?.selectionEnd ?? current.length;
        const markdown = `![${file.name}](${result.url})\n`;
        const next = current.slice(0, start) + markdown + current.slice(end);
        onChange(next);
        focusSelection(start + markdown.length, start + markdown.length);
      } else {
        setUploadError(result.error || 'Rasm yuklanmadi');
      }
    } catch {
      setUploadError('Rasm yuklanmadi');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  if (!isMounted) {
    return (
      <div className="h-[300px] bg-surface/50 border border-line rounded-xl flex items-center justify-center text-muted">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <div className="flex flex-wrap items-center gap-1 mb-2 p-1.5 bg-surface/50 border border-line rounded-lg">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.title}
            type="button"
            onClick={() => runAction(btn.action)}
            title={btn.title}
            aria-label={btn.title}
            className="min-w-8 h-8 px-2 rounded-md text-sm font-semibold text-secondary hover:text-foreground hover:bg-card transition-colors"
          >
            {btn.label}
          </button>
        ))}
        <span className="w-px h-5 bg-line mx-1" aria-hidden="true" />
        <button
          type="button"
          onClick={handleImageButtonClick}
          disabled={isUploading}
          title="Rasm yuklash"
          aria-label="Rasm yuklash"
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-sm font-semibold text-secondary hover:text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 16V6a2 2 0 012-2h12a2 2 0 012 2v10" />
            </svg>
          )}
          <span>{isUploading ? 'Yuklanmoqda...' : 'Rasm'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {uploadError && (
        <p className="mb-2 text-xs text-red-400">{uploadError}</p>
      )}

      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Matn yozing..."}
        className="w-full min-h-[300px] px-4 py-3 bg-surface/50 border border-line rounded-xl text-foreground placeholder-subtle focus:outline-none focus:border-accent-cyan transition-colors resize-y font-sans text-sm leading-relaxed"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          lineHeight: '1.75',
        }}
      />
      <div className="mt-2 text-xs text-subtle space-y-1">
        <p>Yuqoridagi tugmalar yoki Markdown formatidan foydalaning:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li><code className="bg-card px-1 rounded">## Sarlavha</code></li>
          <li><code className="bg-card px-1 rounded">**qalin**</code> yoki <code className="bg-card px-1 rounded">*yotiq*</code></li>
          <li><code className="bg-card px-1 rounded">`kod`</code> yoki uch backtick bilan kod bloki</li>
          <li><code className="bg-card px-1 rounded">![tavsif](rasm-url)</code> - rasm qo&apos;shish uchun &quot;Rasm&quot; tugmasidan foydalaning</li>
          <li>Satrlar masofasi avtomatik saqlanadi</li>
        </ul>
      </div>
    </div>
  );
}
