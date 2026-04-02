"use client";

import { useMemo, useState } from "react";
import seed from "./knowledge-hub-seed.json";

type Language = "uz" | "en" | "ko";

type KnowledgeDomain = "routing" | "switching" | "security" | "python" | "bgp";
type ImageSize = "small" | "large";
type KnowledgeImage = { url: string; size: ImageSize; caption: string };

type KnowledgeCodeBlock = { lang: string; content: string };
type KnowledgeNote = {
  id: string;
  title: string;
  category: KnowledgeDomain;
  body_markdown: string;
  code_blocks: KnowledgeCodeBlock[];
  images: KnowledgeImage[];
  starred: boolean;
  created_at: string;
  updated_at: string;
  roadmap_milestone_ids: string[];
};

type CalendarEventType = "task" | "lab" | "review" | "study";
type CalendarEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  title: string;
  tags: string[];
  type: CalendarEventType;
};

type MicroNote = {
  id: string;
  date: string;
  content: string;
  is_command: boolean;
};

type RoadmapMilestone = {
  id: string;
  stage: number; // integer(1-4)
  title: string;
  category: KnowledgeDomain;
  completed: boolean;
  completed_at: string | null;
  linked_note_ids: string[];
};

type SeedData = {
  notes: KnowledgeNote[];
  calendar_events: CalendarEvent[];
  micro_notes: MicroNote[];
  roadmap_milestones: RoadmapMilestone[];
};

const seedData = seed as SeedData;

// Extract a readable preview from markdown-ish text.
function toPreview(markdown: string, maxLen = 150) {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, " ");
  const withoutHeadings = withoutCodeBlocks.replace(/^#{1,6}\s+/gm, "");
  const withoutBullets = withoutHeadings.replace(/^[-*]\s+/gm, "");
  const withoutBackticks = withoutBullets.replace(/`([^`]+)`/g, "$1");
  const compact = withoutBackticks.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLen) return compact;
  return compact.slice(0, maxLen) + "...";
}

function formatMonthDay(isoDate: string) {
  const d = new Date(isoDate);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

const ImageGrid = ({ images }: { images: KnowledgeImage[] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "6px",
        marginTop: "10px",
      }}
    >
      {images.map((img) => {
        const type = img.size === "large" ? "full" : "thumb";
        return (
          <div
            key={img.url}
            style={{
              gridColumn: type === "full" ? "1 / -1" : "span 1",
              aspectRatio: type === "full" ? "16 / 7" : "16 / 9",
              overflow: "hidden",
              borderRadius: "4px",
              background: "#1E2433",
            }}
            title={img.caption}
          >
            <img
              src={img.url}
              alt={img.caption}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default function KnowledgeHubPage() {
  const [activePanel, setActivePanel] = useState<"notes" | "calendar" | "roadmap">("notes");
  const [activeDomain, setActiveDomain] = useState<"all" | KnowledgeDomain>("all");
  const [language, setLanguage] = useState<Language>("uz");

  const t = useMemo(() => {
    const dict: Record<Language, any> = {
      uz: {
        notesTitle: "// KNOWLEDGE.BASE",
        notesBadge: "RECORDS",
        calendarTitle: "// SCHEDULE.MATRIX",
        roadmapTitle: "// ENGINEER.ROADMAP",
        utilityLabel: "// QUICK COMMANDS",
      },
      en: {
        notesTitle: "// KNOWLEDGE.BASE",
        notesBadge: "RECORDS",
        calendarTitle: "// SCHEDULE.MATRIX",
        roadmapTitle: "// ENGINEER.ROADMAP",
        utilityLabel: "// QUICK COMMANDS",
      },
      ko: {
        notesTitle: "// KNOWLEDGE.BASE",
        notesBadge: "레코드",
        calendarTitle: "// SCHEDULE.MATRIX",
        roadmapTitle: "// ENGINEER.ROADMAP",
        utilityLabel: "// QUICK COMMANDS",
      },
    };
    return dict[language];
  }, [language]);

  const notes = seedData.notes;
  const calendarEvents = seedData.calendar_events;
  const microNotes = seedData.micro_notes;
  const milestones = seedData.roadmap_milestones;

  const domainMeta: Record<KnowledgeDomain, { badgeClass: string; icon: string; label: string }> = {
    routing: { badgeClass: "cat-routing", icon: "⟳", label: "Routing" },
    switching: { badgeClass: "cat-switching", icon: "⇄", label: "Switching" },
    security: { badgeClass: "cat-security", icon: "⛊", label: "Security" },
    python: { badgeClass: "cat-python", icon: "⌬", label: "Python" },
    bgp: { badgeClass: "cat-bgp", icon: "⬡", label: "BGP/OSPF" },
  };

  const notesCounts = useMemo(() => {
    const counts: Record<"all" | KnowledgeDomain, number> = {
      all: notes.length,
      routing: 0,
      switching: 0,
      security: 0,
      python: 0,
      bgp: 0,
    };
    for (const n of notes) counts[n.category] += 1;
    return counts;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (activeDomain === "all") return notes;
    return notes.filter((n) => n.category === activeDomain);
  }, [notes, activeDomain]);

  const monthLabel = useMemo(() => {
    const first = calendarEvents
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!first) return "January 2025";
    const d = new Date(first.date);
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${month} ${year}`;
  }, [calendarEvents]);

  const sortedMilestones = useMemo(() => {
    return milestones.slice().sort((a, b) => a.stage - b.stage);
  }, [milestones]);

  const quickCommands = useMemo(() => microNotes.filter((m) => m.is_command).slice(0, 8), [microNotes]);

  return (
    <div className="knowledgeHubPage">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@300;400;500;600&display=swap');

        .knowledgeHubPage {
          --obsidian: #0B0E14;
          --obsidian2: #111520;
          --obsidian3: #161B26;
          --slate: #1E2433;
          --slate2: #252D40;
          --slate3: #2E3850;
          --border: rgba(0,225,255,0.08);
          --border2: rgba(0,225,255,0.15);
          --cyan: #00E5FF;
          --cyan2: #00B8CC;
          --cyan3: rgba(0,229,255,0.1);
          --cyan4: rgba(0,229,255,0.05);
          --text: #C8D6E5;
          --text2: #7A8FA6;
          --text3: #4A5A72;
          --green: #00FF88;
          --amber: #FFB800;
          --red: #FF4D6D;
          --purple: #A78BFA;
          --mono: 'JetBrains Mono', monospace;
          --sans: 'Sora', sans-serif;

          background: var(--obsidian);
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .knowledgeHubPage * { box-sizing: border-box; margin: 0; padding: 0; }
        .hub { display: grid; grid-template-columns: 200px 1fr 220px; grid-template-rows: 48px 1fr; min-height: 100vh; }

        .topbar {
          grid-column: 1/-1;
          background: var(--obsidian2);
          border-bottom: 1px solid var(--border2);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo { font-family: var(--mono); font-size: 12px; color: var(--cyan); letter-spacing: 2px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-dot { width: 8px; height: 8px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 8px var(--cyan); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }

        .topbar-nav { display: flex; gap: 4px; margin-left: auto; }
        .tnav { background: none; border: 1px solid transparent; color: var(--text2); font-family: var(--mono); font-size: 11px; padding: 5px 12px; border-radius: 4px; cursor: pointer; transition: all .2s; letter-spacing: .5px; }
        .tnav:hover, .tnav.active { border-color: var(--border2); color: var(--cyan); background: var(--cyan4); }
        .status-bar { display: flex; align-items: center; gap: 8px; margin-left: 16px; }
        .status-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; box-shadow: 0 0 6px var(--green); }
        .status-txt { font-family: var(--mono); font-size: 10px; color: var(--text3); }

        .sidebar { background: var(--obsidian2); border-right: 1px solid var(--border); padding: 16px 0; overflow-y: auto; }
        .sidebar-section { padding: 0 12px 16px; }
        .sidebar-label { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; padding: 0 8px 8px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: all .2s; color: var(--text2); font-size: 12px; border: 1px solid transparent; margin-bottom: 2px; }
        .sidebar-item:hover { background: var(--slate); color: var(--text); border-color: var(--border); }
        .sidebar-item.active { background: var(--cyan4); color: var(--cyan); border-color: var(--border2); }
        .sidebar-icon { font-family: var(--mono); font-size: 14px; width: 20px; text-align: center; }
        .cat-badge { margin-left: auto; font-family: var(--mono); font-size: 9px; background: var(--slate2); color: var(--text3); padding: 2px 6px; border-radius: 3px; }
        .divider { height: 1px; background: var(--border); margin: 8px 12px; }

        .main { background: var(--obsidian3); overflow-y: auto; padding: 20px; }
        .panel { display: none; }
        .panel.active { display: block; }

        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .section-title { font-family: var(--mono); font-size: 14px; color: var(--cyan); font-weight: 700; letter-spacing: 1px; }
        .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border2) 0%, transparent 100%); }
        .section-badge { font-family: var(--mono); font-size: 9px; background: var(--cyan3); color: var(--cyan); padding: 3px 8px; border-radius: 3px; border: 1px solid var(--border2); letter-spacing: 1px; }

        /* Notes */
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .note-card { background: var(--slate); border: 1px solid var(--border); border-radius: 8px; padding: 16px; cursor: pointer; transition: all .25s; position: relative; overflow: hidden; }
        .note-card:hover { border-color: var(--border2); transform: translateY(-2px); }
        .note-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .note-cat { font-family: var(--mono); font-size: 9px; padding: 2px 8px; border-radius: 3px; letter-spacing: 1px; }
        .cat-routing { background: rgba(0,229,255,.1); color: var(--cyan); border: 1px solid rgba(0,229,255,.2); }
        .cat-security { background: rgba(255,77,109,.1); color: var(--red); border: 1px solid rgba(255,77,109,.2); }
        .cat-python { background: rgba(167,139,250,.1); color: var(--purple); border: 1px solid rgba(167,139,250,.2); }
        .cat-switching { background: rgba(0,255,136,.1); color: var(--green); border: 1px solid rgba(0,255,136,.2); }
        .cat-bgp { background: rgba(255,184,0,.1); color: var(--amber); border: 1px solid rgba(255,184,0,.2); }
        .note-date { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-left: auto; }
        .note-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
        .note-preview { font-size: 11px; color: var(--text2); line-height: 1.6; }
        .note-code { font-family: var(--mono); font-size: 10px; background: var(--obsidian); color: var(--green); padding: 8px 10px; border-radius: 4px; margin-top: 10px; border-left: 2px solid var(--green); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

        /* Utility */
        .utility { background: var(--obsidian2); border-left: 1px solid var(--border); padding: 16px 12px; overflow-y: auto; }
        .util-section { margin-bottom: 20px; }
        .util-label { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 2px; margin-bottom: 10px; }
        .cmd-list { display: flex; flex-direction: column; gap: 6px; }
        .cmd-chip { background: var(--obsidian); border: 1px solid var(--border); border-radius: 4px; padding: 7px 10px; font-family: var(--mono); font-size: 10px; color: var(--green); }

        @media (max-width: 980px) {
          .hub { grid-template-columns: 1fr; grid-template-rows: 48px auto; }
          .sidebar { display: none; }
          .utility { display: none; }
          .main { grid-column: 1 / -1; }
        }
      `}</style>

      <div className="hub">
        <div className="topbar">
          <div className="logo">
            <div className="logo-dot" />
            NETHUB // v2.4.1
          </div>
          <div className="topbar-nav">
            <button className={`tnav ${activePanel === "notes" ? "active" : ""}`} onClick={() => setActivePanel("notes")}>
              NOTES
            </button>
            <button
              className={`tnav ${activePanel === "calendar" ? "active" : ""}`}
              onClick={() => setActivePanel("calendar")}
            >
              CALENDAR
            </button>
            <button
              className={`tnav ${activePanel === "roadmap" ? "active" : ""}`}
              onClick={() => setActivePanel("roadmap")}
            >
              ROADMAP
            </button>
          </div>
          <div className="status-bar">
            <div className="status-dot" />
            <span className="status-txt">SYS.ONLINE // {notes.length} NOTES</span>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Domains</div>
            <div
              className={`sidebar-item ${activeDomain === "all" ? "active" : ""}`}
              onClick={() => setActiveDomain("all")}
            >
              <span className="sidebar-icon">◈</span>
              All Notes
              <span className="cat-badge">{notesCounts.all}</span>
            </div>
            {(Object.keys(domainMeta) as KnowledgeDomain[]).map((cat) => {
              const meta = domainMeta[cat];
              return (
                <div
                  key={cat}
                  className={`sidebar-item ${activeDomain === cat ? "active" : ""}`}
                  onClick={() => setActiveDomain(cat)}
                >
                  <span className="sidebar-icon" style={{ color: "inherit" }}>
                    {meta.icon}
                  </span>
                  {meta.label}
                  <span className="cat-badge">{notesCounts[cat]}</span>
                </div>
              );
            })}
          </div>

          <div className="divider" />
          <div className="sidebar-section">
            <div className="sidebar-label">Quick Filters</div>
            <div className="sidebar-item" onClick={() => setActiveDomain("all")}>
              <span className="sidebar-icon">★</span>
              Starred Notes
            </div>
          </div>
        </div>

        <div className="main">
          <div id="panel-notes" className={`panel ${activePanel === "notes" ? "active" : ""}`}>
            <div className="section-header">
              <div className="section-title">{t.notesTitle}</div>
              <div className="section-line" />
              <div className="section-badge">{notes.length} RECORDS</div>
            </div>

            <div className="notes-grid">
              {filteredNotes.map((note) => {
                const code = note.code_blocks?.[0]?.content?.trim() ?? "";
                return (
                  <div key={note.id} className="note-card" role="button" tabIndex={0}>
                    <div className="note-meta">
                      <span className={`note-cat ${domainMeta[note.category].badgeClass}`}>
                        {note.category.toUpperCase()}
                      </span>
                      <span className="note-date">{formatMonthDay(note.created_at)}</span>
                    </div>

                    <div className="note-title">
                      {note.starred ? <span style={{ color: "#FFB800", marginRight: 6 }}>⭐</span> : null}
                      {note.title}
                    </div>
                    <div className="note-preview">{toPreview(note.body_markdown, 160)}</div>
                    {code ? <div className="note-code">{code}</div> : null}
                    {note.images?.length ? <ImageGrid images={note.images} /> : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div id="panel-calendar" className={`panel ${activePanel === "calendar" ? "active" : ""}`}>
            <div className="section-header">
              <div className="section-title">{t.calendarTitle}</div>
              <div className="section-line" />
              <div className="section-badge">{monthLabel.toUpperCase()}</div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {calendarEvents
                .slice()
                .sort((a, b) => (a.date + "T" + a.time).localeCompare(b.date + "T" + b.time))
                .map((evt) => (
                  <div
                    key={evt.id}
                    className="note-card"
                    style={{ cursor: "default" }}
                  >
                    <div className="note-meta">
                      <span className="note-cat cat-routing">{evt.type.toUpperCase()}</span>
                      <span className="note-date">
                        {formatMonthDay(evt.date)} · {evt.time}
                      </span>
                    </div>
                    <div className="note-title">{evt.title}</div>
                    <div className="note-preview" style={{ marginTop: 6 }}>
                      Tags: {evt.tags.map((x) => `#${x}`).join(" ")}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div id="panel-roadmap" className={`panel ${activePanel === "roadmap" ? "active" : ""}`}>
            <div className="section-header">
              <div className="section-title">{t.roadmapTitle}</div>
              <div className="section-line" />
              <div className="section-badge">ROADMAP</div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {sortedMilestones.map((m) => {
                const linkedCount = m.linked_note_ids.length;
                const done = m.completed;
                const pct = done ? 100 : 0;
                return (
                  <div
                    key={m.id}
                    className="note-card"
                    style={{ cursor: "default" }}
                  >
                    <div className="note-meta">
                      <span className="note-cat cat-routing" style={{ background: done ? "rgba(0,255,136,.12)" : undefined }}>
                        STAGE {String(m.stage).padStart(2, "0")}
                      </span>
                      <span className="note-date">{done ? "DONE" : "IN PROGRESS"}</span>
                    </div>
                    <div className="note-title">{m.title}</div>
                    <div style={{ marginTop: 10, height: 8, background: "rgba(0,229,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: done ? "var(--green)" : "var(--cyan)",
                          transition: "width .5s",
                        }}
                      />
                    </div>
                    <div className="note-preview" style={{ marginTop: 8 }}>
                      Category: {m.category.toUpperCase()} · Linked notes: {linkedCount}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="utility">
          <div className="util-section">
            <div className="util-label">{t.utilityLabel}</div>
            <div className="cmd-list">
              {quickCommands.length ? (
                quickCommands.map((cmd) => (
                  <div key={cmd.id} className="cmd-chip">
                    {cmd.content}
                  </div>
                ))
              ) : (
                <div className="cmd-chip" style={{ color: "#7A8FA6" }}>
                  No commands yet
                </div>
              )}
            </div>
          </div>

          <div className="util-section">
            <div className="util-label">Language</div>
            <div className="cmd-list" style={{ gap: 8 }}>
              {(["uz", "en", "ko"] as Language[]).map((lng) => (
                <button
                  key={lng}
                  className="cmd-chip"
                  style={{
                    cursor: "pointer",
                    color: lng === language ? "#00E5FF" : "#00FF88",
                    borderColor: lng === language ? "rgba(0,229,255,0.35)" : "rgba(0,225,255,0.08)",
                  }}
                  onClick={() => setLanguage(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

