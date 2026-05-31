import React from 'react';
import { useStore } from './store';
import { getMonthStats } from './rotationUtils';
import { CalendarDays } from 'lucide-react';

export default function AnnualProjection({ year }) {
  const { anchorDate, travelDays, extraWorkDays, normalRate, travelRate, allowances, currency, mmkMonthlyAmount, rotationOn, rotationOff } = useStore();
  const r = { normalRate, travelRate, allowances, currency };
  const fc = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

  if (!anchorDate) {
    return (
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 text-center">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Annual Projection</h3>
        <p className="text-xs text-slate-500">Set anchor date to see annual earnings projection</p>
      </div>
    );
  }

  const ms = Array.from({ length: 12 }, (_, i) => getMonthStats(new Date(year, i, 1), anchorDate, travelDays, extraWorkDays, r, rotationOn, rotationOff, mmkMonthlyAmount));
  const aG = ms.reduce((a, m) => a + m.gross, 0);
  const aW = ms.reduce((a, m) => a + m.workDaysCount, 0), aTr = ms.reduce((a, m) => a + m.travelDaysCount, 0), aExtra = ms.reduce((a, m) => a + m.extraWorkDaysCount, 0);
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-sky-400" /> Annual Projection ({year})</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-800/50 rounded-lg"><p className="text-slate-500 text-[10px] uppercase font-bold">Total Gross</p><p className="text-lg font-bold text-emerald-400">{fc(aG)}</p></div>
        <div className="p-3 bg-slate-800/50 rounded-lg"><p className="text-slate-500 text-[10px] uppercase font-bold">Work / Travel / Extra</p><p className="text-lg font-bold text-slate-100">{aW} <span className="text-slate-500">/</span> {aTr} <span className="text-slate-500">/</span> {aExtra}</p></div>
      </div>
      <div className="space-y-1">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-slate-800/30">
            <span className="text-slate-400 w-8">{l}</span>
            <span className="text-amber-400/80 w-8 text-right">{ms[i].workDaysCount}d</span>
            <span className="text-sky-400/80 w-8 text-right">{ms[i].travelDaysCount > 0 ? ms[i].travelDaysCount + 'd' : ''}</span>
            <span className="text-emerald-300/80 w-10 text-right">{ms[i].extraWorkDaysCount > 0 ? ms[i].extraWorkDaysCount + 'd' : ''}</span>
            <span className="text-emerald-400/80 w-24 text-right font-medium">{fc(ms[i].gross)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
