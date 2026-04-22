import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Current extraction result (passed from Home → Results)
  const [currentResult, setCurrentResult] = useState(null);
  const [currentFile,   setCurrentFile]   = useState(null);

  // History of all past extractions (persisted in localStorage)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('docdine_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // API status
  const [apiOnline, setApiOnline] = useState(null);

  const addToHistory = useCallback((entry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 50); // keep last 50
      try { localStorage.setItem('docdine_history', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem('docdine_history'); } catch {}
  }, []);

  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      try { localStorage.setItem('docdine_history', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      currentResult, setCurrentResult,
      currentFile,   setCurrentFile,
      history,       addToHistory, clearHistory, deleteHistoryItem,
      apiOnline,     setApiOnline,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
