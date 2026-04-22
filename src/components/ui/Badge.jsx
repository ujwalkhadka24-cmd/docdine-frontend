const variants = {
  green:  { bg: 'var(--green-dim)',  color: 'var(--green)',  border: 'rgba(26,122,74,0.25)' },
  amber:  { bg: 'var(--amber-dim)',  color: 'var(--amber)',  border: 'rgba(184,92,0,0.25)'  },
  red:    { bg: 'var(--red-dim)',    color: 'var(--red)',    border: 'rgba(192,57,43,0.25)' },
  blue:   { bg: 'var(--accent-dim)', color: 'var(--accent)', border: 'rgba(42,95,214,0.25)' },
  gray:   { bg: 'var(--surface2)',   color: 'var(--muted)',  border: 'var(--border)'        },
};

export default function Badge({ variant = 'gray', children, style }) {
  const v = variants[variant] || variants.gray;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--mono)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      padding: '2px 8px',
      borderRadius: '99px',
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
}
