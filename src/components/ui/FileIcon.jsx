const types = {
  pdf:  { label: 'PDF', bg: 'rgba(192,57,43,0.1)',    color: 'var(--red)',    border: 'rgba(192,57,43,0.25)'  },
  docx: { label: 'DOC', bg: 'var(--accent-dim)',       color: 'var(--accent)', border: 'rgba(42,95,214,0.25)'  },
  doc:  { label: 'DOC', bg: 'var(--accent-dim)',       color: 'var(--accent)', border: 'rgba(42,95,214,0.25)'  },
  png:  { label: 'IMG', bg: 'var(--amber-dim)',        color: 'var(--amber)',  border: 'rgba(184,92,0,0.25)'   },
  jpg:  { label: 'IMG', bg: 'var(--amber-dim)',        color: 'var(--amber)',  border: 'rgba(184,92,0,0.25)'   },
  jpeg: { label: 'IMG', bg: 'var(--amber-dim)',        color: 'var(--amber)',  border: 'rgba(184,92,0,0.25)'   },
  tiff: { label: 'IMG', bg: 'var(--amber-dim)',        color: 'var(--amber)',  border: 'rgba(184,92,0,0.25)'   },
};

export function getFileType(filename) {
  return (filename || '').split('.').pop().toLowerCase();
}

export default function FileIcon({ filename, size = 28 }) {
  const ext  = getFileType(filename);
  const type = types[ext] || types.png;
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: '5px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: '8px', fontWeight: 600,
      letterSpacing: '0.02em',
      background: type.bg, color: type.color,
      border: `1px solid ${type.border}`,
    }}>
      {type.label}
    </div>
  );
}
