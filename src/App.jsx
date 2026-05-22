import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Dashboard from './Dashboard';
import Settings from './Settings';
import Login from './Login';
import { useStore } from './store';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Calendar as CalendarIcon, LayoutDashboard, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';

const shellClasses =
  'min-h-screen bg-[#0b1220] text-slate-100 flex justify-center font-["Inter","Segoe UI",system-ui,-apple-system,sans-serif]';

const containerClasses =
  'relative w-full max-w-[640px] min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0d1528] overflow-hidden flex flex-col';

const headerClasses =
  'sticky top-0 z-10 backdrop-blur bg-[#0c1220d9] border-b border-slate-800';

const headerInner = 'flex items-center justify-between px-4 pt-3 pb-1 md:px-5';

const badge =
  'px-2.5 py-1 rounded-md border border-sky-500/25 bg-sky-500/10 text-sky-200 text-[10px] font-bold uppercase tracking-wider';

const tabNav =
  'grid grid-cols-3 bg-[#0a0e1899] border-b border-slate-800 backdrop-blur-sm pb-1';

const tabBtnBase =
  'appearance-none bg-none border-0 text-slate-500 hover:text-slate-100 transition-colors text-[10px] font-bold uppercase tracking-widest flex flex-col gap-1 items-center justify-center py-2.5';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const { theme, setTheme, user, setUser, syncWithFirestore } = useStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Monitor Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const u = { uid: firebaseUser.uid, email: firebaseUser.email };
        setUser(u);
        await syncWithFirestore(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser, syncWithFirestore]);

  // Sync back to Firestore when browser online connection is restored
  useEffect(() => {
    const handleOnline = async () => {
      if (user) {
        console.log('🌐 Connection restored! Syncing with Firestore...');
        await syncWithFirestore(user.uid);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user, syncWithFirestore]);

  if (checkingAuth) {
    return (
      <div className={`${shellClasses} ${theme} flex items-center justify-center`}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center animate-pulse mx-auto">
            <div className="w-4 h-4 rounded-full bg-sky-400 animate-ping" />
          </div>
          <p className="text-xs text-slate-500">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${shellClasses} ${theme}`}>
      <div className={containerClasses}>
        <header className={headerClasses}>
          <div className={headerInner}>
            <div className="flex items-center gap-3 font-bold tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-500/20" />
              <div>
                <div className="text-sm leading-none mb-0.5">Offshore Rotation</div>
                <div className="text-[10px] text-slate-500 font-medium">Planner & Earnings</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={badge}>v1.0</div>
            </div>
          </div>
          
          {user && (
            <nav className={tabNav} aria-label="Primary tabs">
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`${tabBtnBase} ${activeTab === 'calendar' ? 'text-amber-400' : ''}`}
              >
                <CalendarIcon className={`w-4 h-4 ${activeTab === 'calendar' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-[9px]">Calendar</span>
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`${tabBtnBase} ${activeTab === 'dashboard' ? 'text-sky-400' : ''}`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-sky-400' : 'text-slate-500'}`} />
                <span className="text-[9px]">Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`${tabBtnBase} ${activeTab === 'settings' ? 'text-slate-100' : ''}`}
              >
                <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-slate-100' : 'text-slate-500'}`} />
                <span className="text-[9px]">Settings</span>
              </button>
            </nav>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {!user ? (
            <Login />
          ) : (
            <>
              {activeTab === 'calendar' && <Calendar />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'settings' && <Settings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
