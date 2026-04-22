// ── ClauseCard ──────────────────────────────────────────────
export function ClauseCard({ clause }) {
  const conf = clause.confidence ?? 0;
  const confColor = conf >= 0.9 ? 'var(--green)' : conf >= 0.75 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{
      padding: '12px 14px',
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: 7,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 6,
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {clause.type?.replace(/_/g, ' ')}
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10,
          color: confColor, fontWeight: 600,
        }}>
          {Math.round(conf * 100)}%
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
        {clause.text}
      </p>
    </div>
  );
}

export default ClauseCard;

// ── FieldRow ─────────────────────────────────────────────────
export function FieldRow({ fieldKey, val, conf }) {
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
        {fieldKey}
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
