import React from 'react';

const shellClasses =
  'min-h-screen bg-[#0b1220] text-slate-100 flex justify-center font-[\"Inter\",\"Segoe UI\",system-ui,-apple-system,sans-serif]';

const containerClasses =
  'relative w-full max-w-[640px] min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0d1528] overflow-hidden';

const headerClasses =
  'sticky top-0 z-10 backdrop-blur bg-[#0c1220d9] border-b border-slate-800';

const headerInner = 'flex items-center justify-between px-4 py-3 md:px-5';

const badge =
  'px-2.5 py-1 rounded-md border border-sky-500/25 bg-sky-500/10 text-sky-200 text-xs font-medium';

const tabBar =
  'sticky bottom-0 z-10 grid grid-cols-3 bg-[#0a0e18e6] border-t border-slate-800 backdrop-blur';

const tabBtnBase =
  'appearance-none bg-none border-0 text-slate-400 hover:text-slate-100 focus-visible:text-slate-100 transition-colors text-sm flex flex-col gap-1 items-center justify-center py-3';

const panel = 'bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/40';

function App() {
  return (
    <div className={shellClasses}>
      <div className={containerClasses}>
        <header className={headerClasses}>
          <div className={headerInner}>
            <div className="flex items-center gap-3 font-bold tracking-tight">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-300 to-orange-600 shadow-[0_10px_25px_rgba(249,115,22,0.35)]" aria-hidden />
              <div>
                <div>Offshore Rotation</div>
                <div className={badge}>Offline-first PWA shell</div>
              </div>
            </div>
            <div className={badge}>v0.1</div>
          </div>
        </header>

        <main className="px-4 pb-24 pt-4 space-y-4 md:px-5">
          <section>
            <div className={panel}>
              <h2 className="text-lg font-semibold mb-1">Calendar (placeholder)</h2>
              <p className="text-slate-400 text-sm">Offline-first layout ready for React logic.</p>
              <div className="grid gap-3 mt-3">
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Calendar grid goes here
                </div>
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Drag-to-paint travel days
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className={panel}>
              <h2 className="text-lg font-semibold mb-1">Dashboard (placeholder)</h2>
              <p className="text-slate-400 text-sm">Countdown & earnings summary will render here.</p>
              <div className="grid gap-3 mt-3">
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Crew change countdown
                </div>
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Monthly income + tax
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className={panel}>
              <h2 className="text-lg font-semibold mb-1">Settings (placeholder)</h2>
              <p className="text-slate-400 text-sm">Anchor date, rates, currency toggle will go here.</p>
              <div className="grid gap-3 mt-3">
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Anchor date input
                </div>
                <div className="min-h-[100px] rounded-xl border border-dashed border-slate-600 bg-gradient-to-br from-sky-500/10 to-amber-500/10 grid place-items-center text-slate-400 text-sm">
                  Daily rate, travel rate, allowances
                </div>
              </div>
            </div>
          </section>
        </main>

        <nav className={tabBar} aria-label="Primary tabs">
          <button className={`${tabBtnBase} text-amber-400`}>📅
            <span>Calendar</span>
          </button>
          <button className={tabBtnBase}>⏱️
            <span>Dashboard</span>
          </button>
          <button className={tabBtnBase}>⚙️
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
