import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const navLinks = [
  { to: '/',        label: 'Upload'  },
  { to: '/results', label: 'Results' },
  { to: '/history', label: 'History' },
  { to: '/about',   label: 'About'   },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { apiOnline } = useApp();

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 58,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(42,95,214,0.3)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>
            doc<span style={{ color: 'var(--accent)' }}>dine</span>
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
            www.docdine.com
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} style={{
                fontFamily: 'var(--mono)', fontSize: 12,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.04em',
                padding: '5px 12px',
                borderRadius: 6,
                color: active ? 'var(--accent)' : 'var(--muted)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* API status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: apiOnline === null ? 'var(--amber)' : apiOnline ? 'var(--green)' : 'var(--red)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            {apiOnline === null ? 'CHECKING' : apiOnline ? 'API ONLINE' : 'API OFFLINE'}
          </span>
        </div>
      </div>
    </nav>
  );
}
