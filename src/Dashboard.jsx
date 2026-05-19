import React from 'react';
import { useStore } from './store';
import { getMonthStats, isWorkDay } from './rotationUtils';
import { format, addDays, differenceInDays } from 'date-fns';
import { TrendingUp, Wallet, Clock, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { anchorDate, travelDays, normalRate, travelRate, allowances, currency } = useStore();
  
  const today = new Date();
  const stats = getMonthStats(today, anchorDate, travelDays, {
    normalRate,
    travelRate,
    allowances,
    currency
  });

  // Calculate Crew Change Countdown
  let nextCrewChange = new Date();
  let found = false;
  let safety = 0;
  const currentlyOn = isWorkDay(today, anchorDate);

  while (!found && safety < 100) {
    nextCrewChange = addDays(nextCrewChange, 1);
    if (isWorkDay(nextCrewChange, anchorDate) !== currentlyOn) {
      found = true;
    }
    safety++;
  }
  const daysToChange = differenceInDays(nextCrewChange, today);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-amber-200/70 text-sm font-medium mb-1">
            {currentlyOn ? 'Next Crew Change (Off)' : 'Next Crew Change (On)'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{daysToChange}</span>
            <span className="text-xl font-medium text-amber-200">Days</span>
          </div>
          <p className="text-amber-200/50 text-xs mt-2">
            Expected: {format(nextCrewChange, 'EEEE, MMM do')}
          </p>
        </div>
        <Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/10 -rotate-12" />
      </div>

      {/* Earnings Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Monthly Gross</p>
            <p className="text-xl font-bold text-slate-100">{formatCurrency(stats.gross)}</p>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Myanmar Tax (Est.)</p>
            <p className="text-xl font-bold text-slate-100">{formatCurrency(stats.tax)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sky-200/70 text-xs uppercase tracking-wider font-bold">Estimated Net Pay</p>
            <p className="text-2xl font-black text-white">{formatCurrency(stats.net)}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Month Breakdown ({format(today, 'MMMM')})</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-500 text-[10px] uppercase font-bold">On-Shift Days</p>
            <p className="text-lg font-bold text-amber-400">{stats.workDaysCount}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Travel Days</p>
            <p className="text-lg font-bold text-sky-400">{stats.travelDaysCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
