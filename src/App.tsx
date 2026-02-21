import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { LocationProvider } from './hooks/useLocation';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import SurahDetailPage from './pages/SurahDetailPage';
import ZakatPage from './pages/ZakatPage';
import AIChatPage from './pages/AIChatPage';
import ProfilePage from './pages/ProfilePage';
import './i18n';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans selection:bg-primary/20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prayer" element={<HomePage />} /> 
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/quran/:number" element={<SurahDetailPage />} />
        <Route path="/zakat" element={<ZakatPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
      
      {/* Floating AI Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Link to="/ai-chat" className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform">
          <span className="sr-only">AI Chat</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </Link>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
