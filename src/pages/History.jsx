import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockHistory } from '../data/mockHistory';
import FileIcon from '../components/ui/FileIcon';
import Badge from '../components/ui/Badge';
import ResultTabs from '../components/features/ResultTabs';

export default function History() {
  const navigate  = useNavigate();
  const { history, clearHistory, deleteHistoryItem, setCurrentResult, setCurrentFile } = useApp();

  // Merge real history with mock data (mock shown only if history is empty)
  const allItems = history.length > 0 ? history : mockHistory;

  // State
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');   // all | high | medium | low
  const [sortBy,    setSortBy]    = useState('date');  // date | confidence | value
  const [selected,  setSelected]  = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Derived list
  const filtered = allItems
    .filter(item => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || item.filename?.toLowerCase().includes(q)
        || item.document_id?.toLowerCase().includes(q)
        || item.parties?.some(p => p.name?.toLowerCase().includes(q))
        || item.jurisdiction?.toLowerCase().includes(q);

      const conf = item.confidence_score ?? 0;
      const matchFilter =
        filter === 'all'    ? true :
        filter === 'high'   ? conf >= 0.9 :
        filter === 'medium' ? conf >= 0.7 && conf < 0.9 :
        filter === 'low'    ? conf < 0.7 : true;

      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date')       return new Date(b.processed_at) - new Date(a.processed_at);
      if (sortBy === 'confidence') return (b.confidence_score ?? 0) - (a.confidence_score ?? 0);
      if (sortBy === 'value')      return (b.contract_value?.amount ?? 0) - (a.contract_value?.amount ?? 0);
      return 0;
    });

  const openItem = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const loadInResults = (item) => {
    setCurrentResult(item);
    setCurrentFile(item.filename);
    navigate('/results');
  };

  const confVariant = (c) => c >= 0.9 ? 'green' : c >= 0.7 ? 'amber' : 'red';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 500, marginBottom: 8 }}>
          Extraction History
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          {allItems.length} contract{allItems.length !== 1 ? 's' : ''} processed
          {history.length === 0 && <span style={{ fontFamily: 'var(--mono)', fontSize: 11, marginLeft: 8, color: 'var(--amber)' }}>· showing demo data</span>}
        </p>
      </div>

      {/* Search + Filter + Sort bar */}
      <div className="fade-up delay-1" style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by filename, party, or jurisdiction…"
            style={{
              width: '100%', padding: '9px 12px 9px 32px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 7, fontFamily: 'var(--sans)', fontSize: 13,
              color: 'var(--text)', outline: 'none',
            }}
          />
        </div>

        {/* Filter */}
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{
          padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 7, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', cursor: 'pointer',
        }}>
          <option value="all">All confidence</option>
          <option value="high">High (≥90%)</option>
          <option value="medium">Medium (70–89%)</option>
          <option value="low">Low (&lt;70%)</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 7, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', cursor: 'pointer',
        }}>
          <option value="date">Sort: Date</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="value">Sort: Value</option>
        </select>

        {/* Clear */}
        {history.length > 0 && (
          <button onClick={clearHistory} style={{
            padding: '9px 14px', background: 'var(--red-dim)', border: '1px solid rgba(192,57,43,0.2)',
            borderRadius: 7, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)', cursor: 'pointer',
          }}>
            Clear all
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
        Showing {filtered.length} of {allItems.length} contracts
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
          <p style={{ fontSize: 15, marginBottom: 6 }}>No contracts match your search</p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>Try a different keyword or filter</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((item, i) => {
            const conf = item.confidence_score ?? 0;
            const date = new Date(item.processed_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            const client = item.parties?.find(p => p.role === 'client')?.name || item.parties?.[0]?.name || '—';
            return (
              <div
                key={item.id}
                className={`fade-up delay-${Math.min(i + 1, 5)}`}
                onClick={() => openItem(item)}
                style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto',
                  gap: 14, alignItems: 'center',
                  padding: '14px 18px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', cursor: 'pointer',
                  boxShadow: 'var(--shadow)', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <FileIcon filename={item.filename} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.filename}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    {item.document_id} · {client}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{date}</span>
                {item.contract_value?.amount ? (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {item.contract_value.currency} {item.contract_value.amount.toLocaleString()}
                  </span>
                ) : <span />}
                <Badge variant={confVariant(conf)}>{Math.round(conf * 100)}%</Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && selected && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileIcon filename={selected.filename} size={30} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{selected.filename}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{selected.document_id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { loadInResults(selected); setShowModal(false); }} style={{
                  padding: '6px 12px', background: 'var(--accent)', color: '#fff',
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                }}>
                  Open in Results →
                </button>
                <button onClick={() => setShowModal(false)} style={{
                  padding: '6px 10px', background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
                }}>✕</button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: 20 }}>
              <ResultTabs result={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
