import { useState, useRef, useCallback } from "react";

// ── API config ──────────────────────────────────────────────
const API_BASE = "https://docdine-api-1.onrender.com";

const api = {
  async upload(file, onProgress) {
    const form = new FormData();
    form.append("file", file);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/extract`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 40));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try { reject(new Error(JSON.parse(xhr.responseText).detail || "Server error")); }
          catch { reject(new Error(`Server error ${xhr.status}`)); }
        }
      };
      xhr.onerror = () => reject(new Error("Network error — is api.docdine.com reachable?"));
      xhr.send(form);
    });
  },

  async pollStatus(jobId, onProgress) {
    const start = Date.now();
    const timeout = 120_000;
    while (Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, 1500));
      const res = await fetch(`${API_BASE}/jobs/${jobId}`);
      if (!res.ok) throw new Error(`Status check failed (${res.status})`);
      const data = await res.json();
      if (data.progress) onProgress(40 + Math.round(data.progress * 0.6));
      if (data.status === "done") return data.result;
      if (data.status === "failed") throw new Error(data.error || "Extraction failed");
    }
    throw new Error("Timed out waiting for extraction");
  },

  async health() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
      return res.ok;
    } catch { return false; }
  }
};
// ────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f2f7;
    --surface: #ffffff;
    --surface2: #f5f6fa;
    --border: #e2e5ee;
    --border-hover: #c8ccd9;
    --text: #1a1d2e;
    --muted: #7b82a0;
    --hint: #d0d4e3;
    --accent: #2563eb;
    --accent-dim: rgba(37,99,235,0.08);
    --amber: #d97706;
    --amber-dim: rgba(217,119,6,0.09);
    --red: #dc2626;
    --red-dim: rgba(220,38,38,0.08);
    --blue: #2563eb;
    --blue-dim: rgba(37,99,235,0.08);
    --green: #16a34a;
    --green-dim: rgba(22,163,74,0.09);
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --radius: 12px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); }

  .app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon {
    width: 32px; height: 32px;
    background: var(--accent-dim);
    border: 1px solid rgba(37,99,235,0.3);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
  }
  .logo-icon svg { width: 16px; height: 16px; color: var(--accent); }
  .logo-text { font-family: var(--mono); font-size: 14px; font-weight: 500; letter-spacing: 0.04em; color: var(--text); }
  .logo-text span { color: var(--accent); }
  .logo-domain { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-left: 4px; }

  .header-right { display: flex; align-items: center; gap: 14px; }
  .header-meta { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }
  .status-dot {
    display: inline-block; width: 6px; height: 6px;
    border-radius: 50%; margin-right: 6px;
    animation: pulse 2s ease-in-out infinite;
  }
  .dot-green { background: var(--green); }
  .dot-red   { background: var(--red); }
  .dot-amber { background: var(--amber); }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  .main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
    padding-bottom: 48px;
  }
  @media (max-width: 780px) { .main { grid-template-columns: 1fr; } }

  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--border);
  }
  .panel-title { font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; }
  .panel-badge { font-family: var(--mono); font-size: 10px; padding: 2px 8px; border-radius: 99px; letter-spacing: 0.04em; }
  .badge-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(22,163,74,0.25); }
  .badge-amber { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(217,119,6,0.25); }
  .badge-red   { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(220,38,38,0.25); }
  .badge-gray  { background: var(--surface2);  color: var(--muted); border: 1px solid var(--border); }

  .dropzone {
    margin: 18px;
    border: 1.5px dashed var(--border-hover);
    border-radius: var(--radius);
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
  }
  .dropzone:hover, .dropzone.drag-over { border-color: var(--accent); background: var(--accent-dim); }
  .dropzone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .drop-icon {
    width: 40px; height: 40px; margin: 0 auto 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); display: flex; align-items: center; justify-content: center;
  }
  .drop-icon svg { width: 20px; height: 20px; color: var(--muted); }
  .drop-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
  .drop-sub { font-size: 12px; color: var(--muted); font-family: var(--mono); }
  .drop-types { display: flex; justify-content: center; gap: 6px; margin-top: 14px; }
  .type-tag { font-family: var(--mono); font-size: 10px; padding: 3px 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 4px; color: var(--muted); letter-spacing: 0.04em; }

  .file-list { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 8px; }
  .file-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    cursor: pointer; transition: border-color 0.15s;
  }
  .file-item:hover { border-color: var(--border-hover); }
  .file-item.selected { border-color: var(--accent); background: var(--accent-dim); }
  .file-icon {
    width: 28px; height: 28px; flex-shrink: 0; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: 0.02em;
  }
  .icon-pdf  { background: rgba(220,38,38,0.1);    color: var(--red);   border: 1px solid rgba(220,38,38,0.25); }
  .icon-docx { background: var(--blue-dim);         color: var(--blue);  border: 1px solid rgba(37,99,235,0.25); }
  .icon-img  { background: var(--amber-dim);        color: var(--amber); border: 1px solid rgba(217,119,6,0.25); }
  .file-info { flex: 1; min-width: 0; }
  .file-name { font-size: 12px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-meta { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 2px; }

  .process-bar { padding: 0 18px 18px; }
  .btn-process {
    width: 100%; padding: 12px;
    background: var(--accent); color: #ffffff;
    font-family: var(--mono); font-size: 12px; font-weight: 500;
    letter-spacing: 0.06em; border: none; border-radius: var(--radius-sm);
    cursor: pointer; transition: opacity 0.15s; text-transform: uppercase;
  }
  .btn-process:hover { opacity: 0.9; }
  .btn-process:disabled { opacity: 0.35; cursor: not-allowed; }

  .progress-wrap { padding: 0 18px 14px; }
  .progress-label { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 10px; color: var(--muted); margin-bottom: 6px; }
  .progress-track { height: 3px; background: var(--hint); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease; }

  .error-banner {
    margin: 0 18px 14px;
    padding: 10px 14px;
    background: var(--red-dim);
    border: 1px solid rgba(220,38,38,0.25);
    border-radius: var(--radius-sm);
    font-family: var(--mono); font-size: 11px; color: var(--red);
    display: flex; align-items: flex-start; gap: 8px;
  }
  .error-banner button { margin-left: auto; background: none; border: none; color: var(--red); cursor: pointer; font-size: 14px; line-height: 1; flex-shrink: 0; }

  .result-empty { padding: 60px 24px; text-align: center; }
  .result-empty-icon {
    width: 48px; height: 48px; margin: 0 auto 16px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); display: flex; align-items: center; justify-content: center;
  }
  .result-empty-icon svg { width: 22px; height: 22px; color: var(--hint); }
  .result-empty-title { font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 4px; }
  .result-empty-sub { font-family: var(--mono); font-size: 11px; color: var(--hint); }

  .json-toolbar { display: flex; gap: 6px; padding: 10px 18px; border-bottom: 1px solid var(--border); }
  .btn-tab {
    font-family: var(--mono); font-size: 10px; padding: 4px 10px;
    border-radius: 4px; border: 1px solid transparent;
    cursor: pointer; background: transparent; color: var(--muted);
    letter-spacing: 0.04em; transition: all 0.15s;
  }
  .btn-tab.active { background: var(--surface2); border-color: var(--border); color: var(--text); }
  .btn-tab:hover:not(.active) { color: var(--text); }

  .json-body { padding: 18px; overflow: auto; max-height: 520px; }
  .json-pre { font-family: var(--mono); font-size: 12px; line-height: 1.7; color: var(--text); white-space: pre; }
  .j-key   { color: #1d4ed8; }
  .j-str   { color: #15803d; }
  .j-num   { color: #b45309; }
  .j-bool  { color: #7c3aed; }
  .j-null  { color: var(--muted); }
  .j-brace { color: var(--muted); }

  .fields-list { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .field-row { display: grid; grid-template-columns: 140px 1fr auto; gap: 10px; align-items: start; padding: 10px 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .field-key { font-family: var(--mono); font-size: 11px; color: var(--muted); padding-top: 1px; }
  .field-val { font-size: 12px; color: var(--text); font-weight: 500; word-break: break-word; }
  .field-conf { font-family: var(--mono); font-size: 10px; padding: 2px 6px; border-radius: 4px; white-space: nowrap; }
  .conf-high { background: var(--green-dim); color: var(--green); }
  .conf-mid  { background: var(--amber-dim); color: var(--amber); }
  .conf-low  { background: var(--red-dim);   color: var(--red); }

  .result-footer { padding: 12px 18px; border-top: 1px solid var(--border); display: flex; gap: 8px; }
  .btn-dl { flex: 1; padding: 9px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); }
  .btn-dl:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .btn-dl.primary { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
  .btn-dl.primary:hover { background: var(--accent); color: #ffffff; }

  .clause-list { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .clause-item { padding: 12px 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); border-left: 3px solid var(--accent); }
  .clause-type { font-family: var(--mono); font-size: 10px; color: var(--accent); margin-bottom: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
  .clause-text { font-size: 12px; color: var(--text); line-height: 1.6; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 14px; height: 14px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
`;

function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) return /:$/.test(match) ? `<span class="j-key">${match}</span>` : `<span class="j-str">${match}</span>`;
      if (/true|false/.test(match)) return `<span class="j-bool">${match}</span>`;
      if (/null/.test(match)) return `<span class="j-null">${match}</span>`;
      return `<span class="j-num">${match}</span>`;
    }
  ).replace(/[{}[\]]/g, m => `<span class="j-brace">${m}</span>`);
}

function fileTypeIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return { label: 'PDF', cls: 'icon-pdf' };
  if (['doc', 'docx'].includes(ext)) return { label: 'DOC', cls: 'icon-docx' };
  return { label: 'IMG', cls: 'icon-img' };
}

function confClass(v) {
  if (v >= 0.9) return 'conf-high';
  if (v >= 0.75) return 'conf-mid';
  return 'conf-low';
}

const STAGE_LABELS = {
  uploading:   "Uploading file…",
  ingesting:   "Ingesting document…",
  ocr:         "Running OCR…",
  extracting:  "Extracting clauses…",
  validating:  "Validating schema…",
  done:        "Complete",
};

export default function App() {
  const [files, setFiles]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag]         = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage]       = useState('');
  const [results, setResults]   = useState({});
  const [errors, setErrors]     = useState({});
  const [tab, setTab]           = useState('fields');
  const [apiOnline, setApiOnline] = useState(null);
  const fileRef = useRef();

  // Health-check on mount
  useState(() => {
    api.health().then(ok => setApiOnline(ok));
  }, []);

  const addFiles = useCallback((incoming) => {
    const arr = Array.from(incoming).map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...arr]);
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  const processFile = async (fileObj) => {
    const { id, file } = fileObj;
    setProcessing(true); setProgress(0); setStage(STAGE_LABELS.uploading);
    setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });

    try {
      // Step 1 — upload + get job_id back (0–40%)
      setStage(STAGE_LABELS.uploading);
      const { job_id } = await api.upload(file, (p) => {
        setProgress(p);
      });

      // Step 2 — poll for result (40–100%)
      setStage(STAGE_LABELS.ingesting);
      const result = await api.pollStatus(job_id, (p) => {
        setProgress(p);
        if (p < 55) setStage(STAGE_LABELS.ocr);
        else if (p < 75) setStage(STAGE_LABELS.extracting);
        else setStage(STAGE_LABELS.validating);
      });

      setProgress(100); setStage(STAGE_LABELS.done);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done' } : f));
      setResults(prev => ({ ...prev, [id]: result }));
      setSelected(id);
    } catch (err) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
      setErrors(prev => ({ ...prev, [id]: err.message }));
    } finally {
      setProcessing(false);
    }
  };

  const pendingFiles = files.filter(f => f.status === 'pending');
  const result = selected ? results[selected] : null;
  const currentError = selected ? errors[selected] : null;

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${result.document_id || 'contract'}.json`;
    a.click();
  };

  const dotCls = apiOnline === null ? 'dot-amber' : apiOnline ? 'dot-green' : 'dot-red';
  const dotLabel = apiOnline === null ? 'CHECKING…' : apiOnline ? 'API ONLINE' : 'API OFFLINE';

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="logo-text">doc<span>dine</span></span>
            <span className="logo-domain">www.docdine.com</span>
          </div>
          <div className="header-right">
            <span className="header-meta">
              <span className={`status-dot ${dotCls}`} />
              {dotLabel}
            </span>
          </div>
        </header>

        <div className="main">
          {/* ── LEFT: Upload panel ── */}
          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Document queue</span>
                <span className={`panel-badge ${files.length ? 'badge-amber' : 'badge-gray'}`}>
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div
                className={`dropzone${drag ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.tiff"
                  style={{ display: 'none' }}
                  onChange={e => addFiles(e.target.files)}
                />
                <div className="drop-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="drop-title">{drag ? 'Drop to add' : 'Drop files here'}</p>
                <p className="drop-sub">or click to browse</p>
                <div className="drop-types">
                  <span className="type-tag">.PDF</span>
                  <span className="type-tag">.DOCX</span>
                  <span className="type-tag">.PNG</span>
                  <span className="type-tag">.JPG</span>
                </div>
              </div>

              {files.length > 0 && (
                <div className="file-list">
                  {files.map(f => {
                    const icon = fileTypeIcon(f.name);
                    const hasError = !!errors[f.id];
                    return (
                      <div
                        key={f.id}
                        className={`file-item${selected === f.id ? ' selected' : ''}`}
                        onClick={() => (f.status === 'done' || hasError) && setSelected(f.id)}
                      >
                        <div className={`file-icon ${icon.cls}`}>{icon.label}</div>
                        <div className="file-info">
                          <div className="file-name">{f.name}</div>
                          <div className="file-meta">{f.size} · {hasError ? 'error' : f.status}</div>
                        </div>
                        <div>
                          {f.status === 'done'  && <span className="panel-badge badge-green">done</span>}
                          {hasError             && <span className="panel-badge badge-red">error</span>}
                          {f.status === 'pending' && !hasError && <span className="panel-badge badge-gray">pending</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {processing && (
                <div className="progress-wrap">
                  <div className="progress-label">
                    <span>{stage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {pendingFiles.length > 0 && !processing && (
                <div className="process-bar">
                  <button
                    className="btn-process"
                    disabled={apiOnline === false}
                    onClick={() => processFile(pendingFiles[0])}
                    title={apiOnline === false ? 'API is offline' : ''}
                  >
                    Extract → {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Results panel ── */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Extracted output</span>
              {result && (
                <span className="panel-badge badge-green">
                  confidence {Math.round((result.confidence_score ?? 0) * 100)}%
                </span>
              )}
            </div>

            {currentError ? (
              <div style={{ padding: '18px' }}>
                <div className="error-banner">
                  <span>
                    <strong>Extraction failed:</strong> {currentError}
                  </span>
                </div>
              </div>
            ) : !result ? (
              <div className="result-empty">
                <div className="result-empty-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <p className="result-empty-title">No output yet</p>
                <p className="result-empty-sub">Upload a contract and click Extract</p>
              </div>
            ) : (
              <>
                <div className="json-toolbar">
                  {['fields', 'clauses', 'json'].map(t => (
                    <button key={t} className={`btn-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>

                {tab === 'fields' && (
                  <div className="fields-list">
                    {[
                      { key: 'document_id',    val: result.document_id },
                      { key: 'client',         val: result.parties?.find(p => p.role === 'client')?.name,  conf: result.parties?.find(p => p.role === 'client')?.confidence },
                      { key: 'vendor',         val: result.parties?.find(p => p.role === 'vendor')?.name,  conf: result.parties?.find(p => p.role === 'vendor')?.confidence },
                      { key: 'effective_date', val: result.effective_date },
                      { key: 'expiry_date',    val: result.expiry_date },
                      { key: 'value',          val: result.contract_value ? `${result.contract_value.currency} ${result.contract_value.amount?.toLocaleString()}` : undefined },
                      { key: 'jurisdiction',   val: result.jurisdiction },
                      { key: 'flags',          val: result.flags?.join(' · ') },
                    ].map(({ key, val, conf }) => (
                      <div key={key} className="field-row">
                        <span className="field-key">{key}</span>
                        <span className="field-val">{val || '—'}</span>
                        {conf !== undefined && (
                          <span className={`field-conf ${confClass(conf)}`}>{Math.round(conf * 100)}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'clauses' && (
                  <div className="clause-list">
                    {(result.clauses || []).map((c, i) => (
                      <div key={i} className="clause-item">
                        <div className="clause-type">{c.type?.replace(/_/g, ' ')} · {Math.round((c.confidence ?? 0) * 100)}% conf</div>
                        <div className="clause-text">{c.text}</div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'json' && (
                  <div className="json-body">
                    <pre className="json-pre" dangerouslySetInnerHTML={{ __html: syntaxHighlight(result) }} />
                  </div>
                )}

                <div className="result-footer">
                  <button className="btn-dl primary" onClick={downloadJSON}>↓ Download JSON</button>
                  <button className="btn-dl" onClick={() => setSelected(null)}>Clear</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
