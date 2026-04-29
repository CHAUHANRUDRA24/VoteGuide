import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CircleUserRound, Menu, Vote, Map as MapIcon, BarChart2, Lightbulb, Bot, LogOut, X, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Upcoming Election', message: 'General Elections 2024 (Phase 1) is starting soon in your registered region.', date: 'April 19, 2024', read: false },
    { id: '2', title: 'Voter List Update', message: 'The final electoral roll has been published. Verify your details.', date: 'Jan 5, 2024', read: true },
  ]);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('voteGuide_reminders');
      if (saved) {
        try {
          const reminders = JSON.parse(saved);
          const mappedNotifications = reminders.map((r: any) => ({
            id: r.id,
            title: 'Election Reminder',
            message: `Reminder for ${r.electionName}`,
            date: new Date(r.date).toLocaleDateString(),
            read: false
          }));
          
          setNotifications(prev => {
            const staticNotifs = prev.filter(n => n.id === '1' || n.id === '2');
            return [...mappedNotifications, ...staticNotifs];
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Custom event to trigger update within the same window
    window.addEventListener('voteGuide_reminders_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('voteGuide_reminders_updated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navLinks = [
    { name: 'Journey', path: '/journey', icon: MapIcon },
    { name: 'Simulator', path: '/simulator', icon: BarChart2 },
    { name: 'Quiz', path: '/quiz', icon: Lightbulb },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Booth Map', path: '/booth', icon: MapIcon },
    { name: 'Ranking', path: '/ranking', icon: BarChart2 },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between relative">
        <div className="w-1/3 flex justify-start">
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tighter text-blue-950">
            <Vote className="w-6 h-6 text-primary" />
            VoteGuide AI
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center justify-center font-medium tracking-tight w-1/3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={user ? link.path : '/signin'}
              className={`transition-all duration-200 hover:opacity-80 active:scale-95 whitespace-nowrap ${
                location.pathname === link.path
                  ? 'text-secondary border-b-2 border-secondary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center justify-end gap-3 sm:gap-4 w-1/3">
          {/* Notification bell removed by user request */}
          
          {user ? (
            <div className="flex items-center gap-2 h-auto bg-surface/50 rounded-full p-1.5 border border-outline-variant/30 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
              {/* Only show Profile pic on internal pages */}
              {!['/', '/signin'].includes(location.pathname) && (
                <div className="relative flex items-center h-full" ref={profileRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="focus:outline-none rounded-full shrink-0 hover:ring-2 hover:ring-primary/20 transition-all"
                    aria-label="User Profile"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="menu"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="User Profile" 
                        className="w-8 h-8 rounded-full shadow-sm object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-sm text-sm">
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-surface-variant overflow-hidden origin-top-right z-50">
                      <div className="p-5 flex flex-col gap-1 items-center border-b border-surface-variant/50">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full mb-2 shadow-md border-2 border-white" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md border-2 border-white text-2xl mb-2">
                            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <p className="font-bold text-on-surface truncate w-full text-center" title={user.displayName || 'User'}>
                          {user.displayName || 'Viter'}
                        </p>
                        <p className="text-xs text-on-surface-variant/80 font-medium truncate w-full text-center">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <div className="px-4 py-2 text-xs font-semibold tracking-wider text-primary uppercase flex items-center gap-2">
                           Age: 18+ Years
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Only show log out on internal pages */}
              {location.pathname !== '/' && (
                <button 
                  onClick={handleSignOut} 
                  className="text-on-surface-variant hover:text-white transition-colors flex items-center justify-center w-8 h-8 md:w-auto md:px-4 md:py-1.5 md:rounded-full hover:bg-error gap-2 shrink-0 rounded-full bg-transparent border border-transparent" 
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold hidden md:inline whitespace-nowrap">Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            /* Only show Sign-in icon on internal pages */
            !['/', '/signin'].includes(location.pathname) && (
              <Link to="/signin" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant" title="Sign In">
                <CircleUserRound className="w-6 h-6" />
              </Link>
            )
          )}
        </div>

        <button className="md:hidden text-primary ml-2 flex-shrink-0 p-2" aria-label="Toggle Menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-white/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center pt-3 pb-6 px-2">
        <Link to="/" className={`flex-1 flex flex-col items-center justify-center ${location.pathname === '/' ? 'text-secondary scale-110' : 'text-slate-500 hover:text-secondary'}`}>
          <Vote className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        {navLinks.map((link) => {
          return (
            <Link key={link.path} to={user ? link.path : '/signin'} className={`flex-1 flex flex-col items-center justify-center transition-all ${location.pathname === link.path ? 'text-secondary scale-110' : 'text-slate-500 hover:text-secondary'}`}>
              <link.icon className={`w-5 h-5 mb-1`} />
              <span className="text-[10px] font-bold uppercase">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        {user && location.pathname !== '/' && (
          <button onClick={handleSignOut} className="flex-1 flex flex-col items-center justify-center transition-all text-error hover:text-error/80">
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase">Exit</span>
          </button>
        )}
      </nav>
    </header>
  );
}
