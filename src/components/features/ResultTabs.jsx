import { useState } from 'react';
import Badge from '../ui/Badge';
import FieldRow from './FieldRow';
import ClauseCard from './ClauseCard';

function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      if (/^"/.test(m)) return /:$/.test(m) ? `<span style="color:#1d4ed8">${m}</span>` : `<span style="color:#15803d">${m}</span>`;
      if (/true|false/.test(m)) return `<span style="color:#7c3aed">${m}</span>`;
      if (/null/.test(m))       return `<span style="color:#9ca3af">${m}</span>`;
      return `<span style="color:#b45309">${m}</span>`;
    }
  ).replace(/[{}[\]]/g, s => `<span style="color:#9ca3af">${s}</span>`);
}

const TABS = ['fields', 'clauses', 'json'];

export default function ResultTabs({ result }) {
  const [tab, setTab] = useState('fields');

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${result.document_id || 'contract'}.json`;
    a.click();
  };

  const fields = [
    { key: 'document_id',    val: result.document_id },
    { key: 'client',         val: result.parties?.find(p => p.role === 'client')?.name,  conf: result.parties?.find(p => p.role === 'client')?.confidence },
    { key: 'vendor',         val: result.parties?.find(p => p.role === 'vendor')?.name,  conf: result.parties?.find(p => p.role === 'vendor')?.confidence },
    { key: 'effective_date', val: result.effective_date },
    { key: 'expiry_date',    val: result.expiry_date },
    { key: 'value',          val: result.contract_value ? `${result.contract_value.currency} ${result.contract_value.amount?.toLocaleString()}` : undefined },
    { key: 'jurisdiction',   val: result.jurisdiction },
    { key: 'method',         val: result.extraction_method },
    { key: 'flags',          val: result.flags?.join(' · ') },
  ];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Extracted Output
        </span>
        <Badge variant="green">confidence {Math.round((result.confidence_score ?? 0) * 100)}%</Badge>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 12px',
            borderRadius: 5, border: '1px solid transparent',
            background: tab === t ? 'var(--surface2)' : 'transparent',
            borderColor: tab === t ? 'var(--border)' : 'transparent',
            color: tab === t ? 'var(--text)' : 'var(--muted)',
            cursor: 'pointer', transition: 'all 0.15s',
            letterSpacing: '0.04em',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {tab === 'fields' && (
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fields.map(f => <FieldRow key={f.key} {...f} />)}
          </div>
        )}

        {tab === 'clauses' && (
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(result.clauses || []).map((c, i) => <ClauseCard key={i} clause={c} />)}
          </div>
        )}

        {tab === 'json' && (
          <div style={{ padding: 18 }}>
            <pre style={{
              fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.7,
              whiteSpace: 'pre', color: 'var(--text)',
            }} dangerouslySetInnerHTML={{ __html: syntaxHighlight(result) }} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button onClick={downloadJSON} style={{
          flex: 1, padding: '9px', fontFamily: 'var(--mono)', fontSize: 11,
          fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
          borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s',
          background: 'var(--accent)', color: '#fff', border: 'none',
        }}>
          ↓ Download JSON
        </button>
      </div>
    </div>
  );
}
