import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ResultTabs from '../components/features/ResultTabs';
import FileIcon from '../components/ui/FileIcon';
import Badge from '../components/ui/Badge';

export default function Results() {
  const navigate = useNavigate();
  const { currentResult, currentFile } = useApp();

  if (!currentResult) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, margin: '0 auto 20px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--hint)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, marginBottom: 8 }}>No results yet</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Upload a contract on the Home page to see extracted results here.</p>
        <button onClick={() => navigate('/')} style={{
          padding: '10px 24px', background: 'var(--accent)', color: '#fff',
          fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.05em', border: 'none', borderRadius: 7, cursor: 'pointer',
        }}>
          ← Go to Upload
        </button>
      </div>
    );
  }

  const processedAt = new Date(currentResult.processed_at).toLocaleString('en-AU', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Page header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            Extraction Result
          </p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 500, lineHeight: 1.2 }}>
            {currentResult.document_id}
          </h1>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            Processed {processedAt}
          </p>
        </div>
        <button onClick={() => navigate('/')} style={{
          padding: '8px 16px', background: 'var(--surface)', color: 'var(--muted)',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.04em', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer',
        }}>
          ← New Upload
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left — File info + summary cards */}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* File card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Source File</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileIcon filename={currentFile} size={36} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{currentFile}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{currentResult.extraction_method}</div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Parties</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(currentResult.parties || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.role}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  </div>
                  <Badge variant={p.confidence >= 0.9 ? 'green' : p.confidence >= 0.75 ? 'amber' : 'red'}>
                    {Math.round(p.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          {currentResult.flags?.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>⚠ Flags</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentResult.flags.map((flag, i) => (
                  <div key={i} style={{ padding: '7px 12px', background: 'var(--amber-dim)', border: '1px solid rgba(184,92,0,0.2)', borderRadius: 6, fontSize: 12, color: 'var(--amber)' }}>
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Full result tabs */}
        <div className="fade-up delay-2">
          <ResultTabs result={currentResult} />
        </div>
      </div>
    </div>
  );
}
