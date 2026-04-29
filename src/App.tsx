import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { analytics } from './lib/firebase';
import { logEvent } from 'firebase/analytics';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Journey from './pages/Journey';
import Simulator from './pages/Simulator';
import Quiz from './pages/Quiz';
import AIAssistant from './pages/AIAssistant';
import SignIn from './pages/SignIn';
import Booth from './pages/Booth';
import Ranking from './pages/Ranking';
import ErrorBoundary from './components/layout/ErrorBoundary';

function AnimatedRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home key={location.pathname} />} />
        <Route path="/signin" element={<SignIn key={location.pathname} />} />
        <Route path="/journey" element={<Journey key={location.pathname} />} />
        <Route path="/simulator" element={<Simulator key={location.pathname} />} />
        <Route path="/quiz" element={<Quiz key={location.pathname} />} />
        <Route path="/assistant" element={<AIAssistant key={location.pathname} />} />
        <Route path="/booth" element={<Booth key={location.pathname} />} />
        <Route path="/ranking" element={<Ranking key={location.pathname} />} />
      </Routes>
    </AnimatePresence>
  );
}

function LayoutContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/assistant'];
  const isFullHeight = hideFooterRoutes.includes(location.pathname);

  return (
    <div className={`flex flex-col min-h-screen relative overflow-x-hidden ${isFullHeight ? 'h-[100dvh] overflow-hidden' : ''}`}>
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary-fixed/40 via-background to-background"></div>
      
      <Navbar />
      
      <main className={`flex-grow flex flex-col mt-16 ${isFullHeight ? 'overflow-hidden' : 'pb-20 md:pb-0'}`}>
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </main>
      
      {!isFullHeight && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutContent />
    </BrowserRouter>
  );
}
