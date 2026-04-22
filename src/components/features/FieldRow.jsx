export default function FieldRow({ fieldKey, key: _k, val, conf, ...rest }) {
  // support both `fieldKey` and `key` prop names
  const label = fieldKey || rest.label || '';
  const confColor = !conf ? null : conf >= 0.9 ? 'var(--green)' : conf >= 0.75 ? 'var(--amber)' : 'var(--red)';
  const confBg    = !conf ? null : conf >= 0.9 ? 'var(--green-dim)' : conf >= 0.75 ? 'var(--amber-dim)' : 'var(--red-dim)';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr auto',
      gap: 10, alignItems: 'start',
      padding: '9px 12px',
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 7,
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 500, wordBreak: 'break-word' }}>
        {val || '—'}
      </span>
      {conf !== undefined && (
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 6px',
          borderRadius: 4, background: confBg, color: confColor,
          whiteSpace: 'nowrap',
        }}>
          {Math.round(conf * 100)}%
        </span>
      )}
    </div>
  );
}
