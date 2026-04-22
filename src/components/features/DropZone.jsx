import { useRef, useState, useCallback } from 'react';

const ACCEPTED = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.tiff';

export default function DropZone({ onFiles }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handle = useCallback((files) => {
    const arr = Array.from(files).filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf','doc','docx','png','jpg','jpeg','tiff'].includes(ext);
    });
    if (arr.length) onFiles(arr);
  }, [onFiles]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      style={{
        border: `1.5px dashed ${drag ? 'var(--accent)' : 'var(--border2)'}`,
        borderRadius: 'var(--radius)',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: drag ? 'var(--accent-dim)' : 'var(--surface2)',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED}
        style={{ display: 'none' }}
        onChange={e => handle(e.target.files)}
      />

      {/* Icon */}
      <div style={{
        width: 44, height: 44, margin: '0 auto 16px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
        {drag ? 'Drop to upload' : 'Drop your contract here'}
      </p>
      <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 16 }}>
        or click to browse files
      </p>

      {/* Type tags */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
        {['PDF', 'DOCX', 'PNG', 'JPG', 'TIFF'].map(t => (
          <span key={t} style={{
            fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--muted)', letterSpacing: '0.04em',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
