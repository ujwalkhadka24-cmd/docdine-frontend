export default function ProgressBar({ progress, label, style }) {
  return (
    <div style={{ ...style }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
        marginBottom: '6px',
      }}>
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div style={{
        height: '3px', background: 'var(--hint)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'var(--accent)', borderRadius: '2px',
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}
