"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
// TypeScript type error'ni e'tiborsiz qoldirish - react-quill Next.js dynamic import bilan muammo
// @ts-expect-error - react-quill type definition issue with Next.js dynamic import
const ReactQuill = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] bg-slate-900/50 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400">Yuklanmoqda...</div>
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CSS'ni dynamic import qilish (production uchun) - faqat client-side'da
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    
    const loadEditor = async () => {
      try {
        setIsLoading(true);
        
        // CSS'ni yuklash
        await import('react-quill/dist/quill.snow.css');
        
        if (mounted) {
          setIsMounted(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load RichTextEditor:', err);
        if (mounted) {
          setError('Editor yuklanmadi');
          setIsLoading(false);
        }
      }
    };
    
    loadEditor();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Hooks must be called before any conditional returns (Rules of Hooks)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          input.onchange = async () => {
            const file = input.files?.[0];
            if (file && quillRef.current) {
              // Convert image to base64
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                if (range) {
                  quill.insertEmbed(range.index, 'image', base64);
                  quill.setSelection(range.index + 1);
                }
              };
              reader.readAsDataURL(file);
            }
          };
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // SSR paytida yoki xato bo'lsa loading ko'rsatish (hooks'dan keyin)
  if (!isMounted || isLoading || error) {
    return (
      <div className="h-[300px] bg-slate-900/50 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400">
        {error || 'Yuklanmoqda...'}
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Matn yozing..."}
        className="bg-slate-900/50 rounded-xl"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 14px;
          font-family: inherit;
          min-height: 300px;
          color: #e2e8f0;
          background-color: rgba(15, 23, 42, 0.5);
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #334155;
        }
        
        .rich-text-editor .ql-container.ql-snow {
          border-color: #334155;
        }
        
        .rich-text-editor .ql-toolbar {
          background-color: rgba(15, 23, 42, 0.8);
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #334155;
          padding: 12px;
        }
        
        .rich-text-editor .ql-toolbar.ql-snow {
          border-color: #334155;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #cbd5e1;
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #cbd5e1;
        }
        
        .rich-text-editor .ql-toolbar .ql-picker-label {
          color: #cbd5e1;
        }
        
        .rich-text-editor .ql-toolbar .ql-picker-label:hover {
          color: #06b6d4;
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #06b6d4;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #06b6d4;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #06b6d4;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 300px;
          color: #e2e8f0;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
        
        .rich-text-editor .ql-editor pre.ql-syntax {
          background-color: #1e293b;
          color: #06b6d4;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 0.5rem 0;
          overflow-x: auto;
        }
        
        .rich-text-editor .ql-editor code {
          background-color: #1e293b;
          color: #06b6d4;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #06b6d4;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #94a3b8;
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3,
        .rich-text-editor .ql-editor h4,
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          color: #06b6d4;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-editor .ql-editor h1 { font-size: 2rem; }
        .rich-text-editor .ql-editor h2 { font-size: 1.5rem; }
        .rich-text-editor .ql-editor h3 { font-size: 1.25rem; }
        
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor .ql-editor ul li,
        .rich-text-editor .ql-editor ol li {
          margin: 0.25rem 0;
        }
        
        .rich-text-editor .ql-editor a {
          color: #06b6d4;
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: #0891b2;
        }
        
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          background-color: #1e293b;
          border-color: #334155;
        }
        
        .rich-text-editor .ql-snow .ql-picker-options .ql-picker-item {
          color: #cbd5e1;
        }
        
        .rich-text-editor .ql-snow .ql-picker-options .ql-picker-item:hover {
          color: #06b6d4;
          background-color: #334155;
        }
      `}</style>
    </div>
  );
}

