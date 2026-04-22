import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import DropZone from '../components/features/DropZone';
import FileIcon from '../components/ui/FileIcon';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const STAGES = ['Uploading file…','Ingesting document…','Running OCR…','Extracting clauses…','Validating schema…','Done ✓'];

export default function Home() {
  const navigate = useNavigate();
  const { setCurrentResult, setCurrentFile, addToHistory, setApiOnline } = useApp();

  const [files,      setFiles]      = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [stage,      setStage]      = useState('');
  const [error,      setError]      = useState('');

  // Health check
  useEffect(() => {
    api.health().then(ok => setApiOnline(ok));
  }, [setApiOnline]);

  const addFiles = useCallback((incoming) => {
    const arr = incoming.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f, name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...arr]);
    setError('');
  }, []);

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const processFile = async (fileObj) => {
    setProcessing(true); setProgress(0); setStage(STAGES[0]); setError('');
    try {
      const { job_id } = await api.upload(fileObj.file, p => setProgress(p));
      setStage(STAGES[1]);
      const result = await api.pollStatus(job_id, p => {
        setProgress(p);
        if (p < 55) setStage(STAGES[2]);
        else if (p < 75) setStage(STAGES[3]);
        else setStage(STAGES[4]);
      });
      setProgress(100); setStage(STAGES[5]);
      setCurrentResult(result);
      setCurrentFile(fileObj.name);
      addToHistory({ ...result, id: result.document_id + Date.now(), filename: fileObj.name });
      setTimeout(() => navigate('/results'), 600);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const pending = files.filter(f => f.status === 'pending');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 300, lineHeight: 1.15, marginBottom: 16 }}>
          From chaos to data,<br />
          <em style={{ color: 'var(--accent)' }}>one clause at a time.</em>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
          Upload messy contract documents — PDFs, Word files, scanned images — and get clean, structured JSON in seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left — Upload */}
        <div className="fade-up delay-1">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Document Queue</span>
              <Badge variant={files.length ? 'amber' : 'gray'}>{files.length} file{files.length !== 1 ? 's' : ''}</Badge>
            </div>

            <div style={{ padding: 18 }}>
              <DropZone onFiles={addFiles} />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {files.map(f => (
                  <div key={f.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: 'var(--surface2)',
                    border: '1px solid var(--border)', borderRadius: 7,
                  }}>
                    <FileIcon filename={f.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{f.size}</div>
                    </div>
                    <button onClick={() => removeFile(f.id)} style={{
                      background: 'none', border: 'none', color: 'var(--muted)',
                      cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px',
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {processing && (
              <div style={{ padding: '0 18px 14px' }}>
                <ProgressBar progress={progress} label={stage} />
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ margin: '0 18px 14px', padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 7, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)' }}>
                {error}
              </div>
            )}

            {/* Extract button */}
            {pending.length > 0 && !processing && (
              <div style={{ padding: '0 18px 18px' }}>
                <button
                  onClick={() => processFile(pending[0])}
                  style={{
                    width: '100%', padding: 12,
                    background: 'var(--accent)', color: '#fff',
                    fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    border: 'none', borderRadius: 7, cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Extract → {pending.length} file{pending.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right — How it works */}
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 20 }}>How it works</h2>
            {[
              { n: '01', title: 'Upload',    desc: 'Drop a PDF, Word file, or scanned image into the queue.' },
              { n: '02', title: 'Extract',   desc: 'Our AI reads, OCRs, and analyses every clause.' },
              { n: '03', title: 'Structure', desc: 'Get clean JSON with parties, dates, values and clauses.' },
              { n: '04', title: 'Download',  desc: 'Export the JSON or review in the Results page.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', fontWeight: 600, paddingTop: 2, flexShrink: 0 }}>{n}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Supported formats */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Supported formats</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'PDF', desc: 'pdfplumber' },
                { label: 'DOCX', desc: 'python-docx' },
                { label: 'PNG/JPG', desc: 'Tesseract OCR' },
                { label: 'TIFF', desc: 'Tesseract OCR' },
              ].map(({ label, desc }) => (
                <div key={label} style={{ padding: '8px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 700px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
