"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase ulanishi
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function KnowledgeHub() {
  const [activePanel, setActivePanel] = useState('notes');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ma'lumotlarni Supabase'dan yuklash
  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('portfolio_calendar_events')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // HTML fayldagi dizaynni Next.js ga moslash
  return (
    <div className="hub">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Sora:wght@300;400;600&display=swap');
        
        :root {
          --obsidian: #0B0E14; --obsidian2: #111520; --obsidian3: #161B26;
          --slate: #1E2433; --slate2: #252D40; --border: rgba(0,225,255,0.08);
          --border2: rgba(0,225,255,0.15); --cyan: #00E5FF; --cyan3: rgba(0,229,255,0.1);
          --cyan4: rgba(0,229,255,0.05); --text: #C8D6E5; --text2: #7A8FA6; --text3: #4A5A72;
          --green: #00FF88; --amber: #FFB800; --red: #FF4D6D; --purple: #A78BFA;
          --mono: 'JetBrains Mono', monospace; --sans: 'Sora', sans-serif;
        }

        body { background: var(--obsidian); color: var(--text); font-family: var(--sans); margin: 0; }
        .hub { display: grid; grid-template-columns: 200px 1fr 220px; grid-template-rows: 48px 1fr; min-height: 100vh; }

        /* Topbar Styles */
        .topbar { grid-column: 1/-1; background: var(--obsidian2); border-bottom: 1px solid var(--border2); display: flex; align-items: center; padding: 0 16px; gap: 16px; position: sticky; top: 0; z-index: 100; }
        .logo { font-family: var(--mono); font-size: 12px; color: var(--cyan); letter-spacing: 2px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-dot { width: 8px; height: 8px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); }
        
        .tnav { background: none; border: 1px solid transparent; color: var(--text2); font-family: var(--mono); font-size: 11px; padding: 5px 12px; border-radius: 4px; cursor: pointer; transition: all .2s; }
        .tnav:hover, .tnav.active { border-color: var(--border2); color: var(--cyan); background: var(--cyan4); }

        /* Main Section */
        .main { background: var(--obsidian3); overflow-y: auto; padding: 20px; }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .section-title { font-family: var(--mono); font-size: 14px; color: var(--cyan); font-weight: 700; }
        .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border2) 0%, transparent 100%); }

        /* Notes Grid */
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .note-card { background: var(--slate); border: 1px solid var(--border); border-radius: 8px; padding: 16px; transition: all .25s; }
        .note-card:hover { border-color: var(--border2); transform: translateY(-2px); }
        .note-cat { font-family: var(--mono); font-size: 9px; padding: 2px 8px; border-radius: 3px; border: 1px solid rgba(0,225,255,0.2); color: var(--cyan); background: var(--cyan3); }
        .note-title { font-size: 13px; font-weight: 600; color: var(--text); margin: 10px 0 8px; }
        .note-preview { font-size: 11px; color: var(--text2); line-height: 1.6; }
        .note-code { font-family: var(--mono); font-size: 10px; background: var(--obsidian); color: var(--green); padding: 8px; border-radius: 4px; margin-top: 10px; border-left: 2px solid var(--green); overflow: hidden; }

        /* Sidebar & Utility */
        .sidebar { background: var(--obsidian2); border-right: 1px solid var(--border); padding: 16px 0; }
        .utility { background: var(--obsidian2); border-left: 1px solid var(--border); padding: 16px 12px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; color: var(--text2); font-size: 12px; cursor: pointer; }
        .sidebar-item.active { color: var(--cyan); background: var(--cyan4); }
      `}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="logo"><div className="logo-dot"></div>NETHUB // v2.4.1</div>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button className={`tnav ${activePanel === 'notes' ? 'active' : ''}`} onClick={() => setActivePanel('notes')}>NOTES</button>
          <button className={`tnav ${activePanel === 'calendar' ? 'active' : ''}`} onClick={() => setActivePanel('calendar')}>CALENDAR</button>
          <button className={`tnav ${activePanel === 'roadmap' ? 'active' : ''}`} onClick={() => setActivePanel('roadmap')}>ROADMAP</button>
        </nav>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ padding: '0 12px 16px' }}>
          <div style={{ fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase' }}>Domains</div>
          <div className="sidebar-item active"><span style={{ color: 'var(--cyan)' }}>◈</span> All Notes</div>
          <div className="sidebar-item"><span>⟳</span> Routing</div>
          <div className="sidebar-item"><span>⇄</span> Switching</div>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="main">
        {activePanel === 'notes' && (
          <div id="panel-notes">
            <div className="section-header">
              <div className="section-title">// KNOWLEDGE.BASE</div>
              <div className="section-line"></div>
              <div className="section-badge" style={{ fontSize: '9px', background: 'var(--cyan3)', color: 'var(--cyan)', padding: '3px 8px' }}>
                {notes.length} RECORDS
              </div>
            </div>

            <div className="notes-grid">
              {loading ? (
                <div style={{ color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Loading encrypted data...</div>
              ) : (
                notes.map((note) => (
                  <article key={note.id} className="note-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="note-cat">{note.category || 'GENERAL'}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="note-title">{note.title}</h3>
                    <p className="note-preview">{note.description}</p>
                    {note.code_snippet && (
                      <div className="note-code">{note.code_snippet}</div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        )}
        
        {activePanel === 'calendar' && (
          <div style={{ color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>// CALENDAR.MATRIX_LOADED</div>
        )}
      </main>

      {/* UTILITY BAR */}
      <aside className="utility">
        <div style={{ fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', marginBottom: '10px' }}>// SYSTEM STATUS</div>
        <div style={{ fontSize: '10px', color: 'var(--green)' }}>● Online</div>
      </aside>
    </div>
  );
}