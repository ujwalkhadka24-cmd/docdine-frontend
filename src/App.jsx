import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import Home    from './pages/Home';
import Results from './pages/Results';
import History from './pages/History';
import About   from './pages/About';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"        element={<Home />}    />
              <Route path="/results" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="/about"   element={<About />}   />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
