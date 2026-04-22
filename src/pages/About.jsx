import { Link } from 'react-router-dom';

const stack = [
  { layer: 'Frontend',  tech: 'React 18 + Vite',         desc: 'Component-based UI with client-side routing' },
  { layer: 'Styling',   tech: 'CSS Variables',            desc: 'Design token system, responsive grid' },
  { layer: 'Routing',   tech: 'React Router v6',          desc: 'Multi-page navigation, nested routes' },
  { layer: 'State',     tech: 'Context API + useState',   desc: 'Global shared state across pages' },
  { layer: 'Backend',   tech: 'FastAPI (Python)',          desc: 'Async REST API with background job processing' },
  { layer: 'AI',        tech: 'Claude API (Anthropic)',   desc: 'LLM-powered clause extraction and classification' },
  { layer: 'OCR',       tech: 'Tesseract',                desc: 'Text extraction from scanned images' },
  { layer: 'PDF',       tech: 'pdfplumber',               desc: 'Text layer extraction from PDF files' },
  { layer: 'Word',      tech: 'python-docx',              desc: 'Paragraph extraction from .docx files' },
  { layer: 'Hosting',   tech: 'Vercel + Render',          desc: 'Frontend on Vercel, backend on Render (free tier)' },
];

const requirements = [
  { req: 'Multi-page navigation',       met: true,  how: 'React Router v6 — Home, Results, History, About' },
  { req: 'Reusable component architecture', met: true, how: 'Separated into layout/, ui/, features/, pages/' },
  { req: 'State management',            met: true,  how: 'Context API for global state, useState for local' },
  { req: 'Data handling',               met: true,  how: 'Real API + mock data, async loading, error states' },
  { req: 'User interaction & forms',    met: true,  how: 'Search with validation, filters, sort, modals' },
  { req: 'Responsive design',           met: true,  how: 'CSS Grid with mobile breakpoints on all pages' },
];

export default function About() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <div className="fade-up" style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 42, fontWeight: 300, lineHeight: 1.15, marginBottom: 16 }}>
          About <em style={{ color: 'var(--accent)' }}>DocDine</em>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.7 }}>
          A student project built to demonstrate a scalable, AI-powered document processing pipeline —
          from messy contract files to clean, structured, machine-readable JSON.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Requirements checklist */}
        <div className="fade-up delay-1">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Assignment Requirements
              </p>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {requirements.map(({ req, met, how }) => (
                <div key={req} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{met ? '✅' : '❌'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{req}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{how}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="fade-up delay-2">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Tech Stack
              </p>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stack.map(({ layer, tech, desc }) => (
                <div key={layer} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, padding: '8px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)', fontWeight: 600, paddingTop: 2 }}>{layer}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{tech}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="fade-up delay-3" style={{ marginTop: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>System Architecture</p>
        <pre style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', lineHeight: 1.8, overflowX: 'auto' }}>{`
  www.docdine.com (Vercel)          api.docdine.com (Render)
  ┌─────────────────────┐           ┌──────────────────────────┐
  │  React Frontend     │  ──────►  │  FastAPI Backend          │
  │                     │  POST     │                           │
  │  / Home (upload)    │  /extract │  File ingestor            │
  │  /results           │           │  ├── pdfplumber (PDF)     │
  │  /history           │  ◄──────  │  ├── python-docx (DOCX)  │
  │  /about             │  JSON     │  └── Tesseract (images)   │
  │                     │           │                           │
  │  Context API        │           │  Claude API (Anthropic)   │
  │  React Router v6    │           │  └── Clause extraction    │
  └─────────────────────┘           │                           │
                                    │  Pydantic validation      │
                                    └──────────────────────────┘
        `}</pre>
      </div>

      {/* CTA */}
      <div className="fade-up delay-4" style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/">
          <button style={{
            padding: '12px 32px', background: 'var(--accent)', color: '#fff',
            fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.05em', border: 'none', borderRadius: 8, cursor: 'pointer',
          }}>
            Try it → Upload a Contract
          </button>
        </Link>
      </div>
    </div>
  );
}
