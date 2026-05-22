import React from 'react';
import { useStore } from './store';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User } from 'lucide-react';

const Settings = () => {
  const { 
    anchorDate, setAnchorDate,
    normalRate, travelRate, allowances, currency, setRates, setCurrency,
    mmkMonthlyAmount, setMmkMonthlyAmount,
    rotationPreset, setRotationPreset, resetAll, user
  } = useStore();

  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setRates({ [name]: parseFloat(value) || 0 });
  };

  const inputClasses = "w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 pb-10">
      {user && (
        <section className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Logged In As</p>
              <p className="text-sm font-semibold text-slate-200">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="p-2 bg-slate-800 hover:bg-slate-700/80 hover:text-rose-400 rounded-xl border border-slate-700/40 text-slate-400 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          📅 Rotation Schedule
        </h3>
        <div>
          <label className={labelClasses}>Rotation Pattern</label>
          <select value={rotationPreset} onChange={(e) => setRotationPreset(e.target.value)} className={inputClasses}>
            <option value="28/28">28 days On / 28 days Off</option>
            <option value="35/35">35 days On / 35 days Off</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Anchor Date (Start of "On" Cycle)</label>
          <input 
            type="date" 
            value={anchorDate || ''} 
            onChange={(e) => setAnchorDate(e.target.value)}
            className={inputClasses}
          />
          <p className="text-[10px] text-slate-500 mt-1">{anchorDate ? 'Rotation starts from this date.' : 'Select a date to start your rotation schedule.'}</p>
        </div>
      </section>

      <hr className="border-slate-800" />

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          💰 Financial Rates
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClasses}>Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClasses}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="MMK">MMK - Myanmar Kyat</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Normal Daily Rate</label>
            <input 
              type="number" 
              name="normalRate"
              value={normalRate} 
              onChange={handleRateChange}
              className={inputClasses}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className={labelClasses}>Travel Daily Rate</label>
            <input 
              type="number" 
              name="travelRate"
              value={travelRate} 
              onChange={handleRateChange}
              className={inputClasses}
              placeholder="0.00"
            />
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>Fixed Monthly Allowances</label>
            <input 
              type="number" 
              name="allowances"
              value={allowances} 
              onChange={handleRateChange}
              className={inputClasses}
              placeholder="0.00"
            />
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>MMK Monthly Amount (for Tax Calc)</label>
            <input 
              type="number" 
              value={mmkMonthlyAmount} 
              onChange={(e) => setMmkMonthlyAmount(parseFloat(e.target.value) || 0)}
              className={inputClasses}
              placeholder="0"
            />
            <p className="text-[10px] text-slate-500 mt-1">Enter your monthly income in MMK for Myanmar tax calculation. Used when your currency is USD but tax is calculated in MMK.</p>
          </div>
        </div>
      </section>

      <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4">
        <p className="text-xs text-sky-200/70 leading-relaxed">
          <strong>Note on Tax:</strong> Enter your monthly income in MMK for tax reference. Tax calculation uses progressive Myanmar brackets. Tax is calculated separately from your USD income and not shown in earnings reports due to currency mismatch.
        </p>
      </div>

      <button
        onClick={() => { if (window.confirm('Reset all data to defaults?')) resetAll(); }}
        className="w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm font-bold hover:bg-rose-500/20 transition-colors"
      >
        Reset All Data
      </button>
    </div>
  );
};

export default Settings;
