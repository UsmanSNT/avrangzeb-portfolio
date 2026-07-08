"use client";

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImageToBox, uploadImage } from '@/lib/upload';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
  </svg>
);

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    const current = value || '';

    if (!textarea) {
      onChange(current ? `${current}\n${snippet}\n` : `${snippet}\n`);
      return;
    }

    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;
    const needsLeadingNewline = start > 0 && current[start - 1] !== '\n';
    const before = current.slice(0, start);
    const after = current.slice(end);
    const insertion = `${needsLeadingNewline ? '\n' : ''}${snippet}\n`;
    const next = `${before}${insertion}${after}`;

    onChange(next);

    // Move cursor to just after the inserted snippet on the next tick
    requestAnimationFrame(() => {
      const cursor = before.length + insertion.length;
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError("Faqat rasm fayllarini yuklash mumkin");
      return;
    }

    setUploadError('');
    setIsUploadingImage(true);
    try {
      // Compresses to fit a ~400x600 box (desktop display size) while
      // preserving the source aspect ratio - landscape or portrait alike.
      const compressed = await compressImageToBox(file, 480, 640, 0.85);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setUploadError("Rasm yuklash uchun tizimga kiring");
        return;
      }

      const result = await uploadImage(compressed, 'notes', token);
      if (!result.success || !result.url) {
        setUploadError(result.error || "Rasm yuklanmadi");
        return;
      }

      insertAtCursor(`![rasm](${result.url})`);
    } catch (error) {
      console.error('Note image upload error:', error);
      setUploadError("Rasm yuklashda xatolik yuz berdi");
    } finally {
      setIsUploadingImage(false);
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
      <div className="mb-2 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-hover/[0.05] px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:border-accent-cyan/40 hover:text-cyan-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploadingImage ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
          ) : (
            <ImageIcon />
          )}
          {isUploadingImage ? 'Yuklanmoqda...' : 'Rasm qo\'shish'}
        </button>
        {uploadError && <span className="text-xs text-red-400">{uploadError}</span>}
      </div>

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
        <p>Maslahat: Markdown formatidan foydalaning:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li><code className="bg-card px-1 rounded">## Sarlavha</code></li>
          <li><code className="bg-card px-1 rounded">**qalin**</code> yoki <code className="bg-card px-1 rounded">*yotiq*</code></li>
          <li><code className="bg-card px-1 rounded">`code`</code></li>
          <li>Rasm qo&apos;shish uchun yuqoridagi tugmadan foydalaning - u avtomatik ravishda kichraytiriladi</li>
          <li>Satrlar masofasi avtomatik saqlanadi</li>
        </ul>
      </div>
    </div>
  );
}
