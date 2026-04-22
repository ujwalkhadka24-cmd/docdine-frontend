export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
          © 2024 docdine.com — Contract extraction engine
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--hint)' }}>
          Built with React · FastAPI · Claude AI
        </span>
      </div>
    </footer>
  );
}
