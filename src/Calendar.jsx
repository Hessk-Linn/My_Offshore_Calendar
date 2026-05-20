import React, { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useStore } from './store';
import { isWorkDay } from './rotationUtils';
import { getHolidaysForMonth, COUNTRY_COLORS } from './holidays';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [cm, setCm] = useState(new Date());
  const { anchorDate, travelDays, toggleTravelDay, rotationOn, rotationOff } = useStore();
  const nm = useCallback(() => setCm(addMonths(cm, 1)), [cm]);
  const pm = useCallback(() => setCm(subMonths(cm, 1)), [cm]);
  const td = () => setCm(new Date());
  useEffect(() => {
    const h = (e) => { if (e.key === 'ArrowLeft') pm(); else if (e.key === 'ArrowRight') nm(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [pm, nm]);

  const ms = startOfMonth(cm), me = endOfMonth(ms);
  const days = eachDayOfInterval({ start: startOfWeek(ms), end: endOfWeek(me) });
  const hols = getHolidaysForMonth(cm.getFullYear(), cm.getMonth() + 1);
  const hm = {}; hols.forEach(h => { hm[h.date] = h; });
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100">{format(cm, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button onClick={pm} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={td} className="px-3 py-1 text-xs font-bold text-sky-400 hover:bg-sky-500/10 rounded-full transition-colors">Today</button>
          <button onClick={nm} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {wd.map(d => <div key={d} className={`text-center text-xs font-semibold py-2 ${d==='Sun'||d==='Sat'?'text-rose-400/70':'text-slate-500'}`}>{d}</div>)}
        {days.map((day, i) => {
          const ds = format(day, 'yyyy-MM-dd');
          const on = isWorkDay(day, anchorDate, rotationOn, rotationOff);
          const tr = travelDays.includes(ds);
          const cmo = isSameMonth(day, ms);
          const hol = hm[ds];
          const we = day.getDay() === 0 || day.getDay() === 6;
          let bg = 'bg-transparent', bc = 'border-transparent';
          if (tr) { bg = 'bg-sky-500/40'; bc = 'border-sky-500/50'; }
          else if (hol) { bg = COUNTRY_COLORS[hol.country].bg; bc = COUNTRY_COLORS[hol.country].border; }
          else if (on) { bg = 'bg-amber-500/20'; bc = 'border-amber-500/30'; }
          else if (cmo) { bg = 'bg-slate-800/30'; bc = 'border-slate-700/20'; }
          return (
            <button key={i} onClick={() => toggleTravelDay(ds)} className={`relative h-12 flex flex-col items-center justify-center rounded-lg border transition-all ${cmo?'text-slate-100':'text-slate-600'} ${bg} ${bc} ${isToday(day)?'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0b1220]':''} hover:scale-105 active:scale-95`}>
              <span className={`text-sm font-medium ${we&&!on&&!tr&&!hol?'text-rose-400/60':''}`}>{format(day, 'd')}</span>
              {tr && <div className="absolute bottom-1 w-1 h-1 bg-sky-400 rounded-full" />}
              {hol && !tr && <div className={`absolute bottom-1 w-1 h-1 ${COUNTRY_COLORS[hol.country].dot} rounded-full`} />}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /><span className="text-slate-400">On Rotation</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-sky-500/40 border border-sky-500/50" /><span className="text-slate-400">Travel Day</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-800/30 border border-slate-700/20" /><span className="text-slate-400">Off Rotation</span></div>
        {['MM','US','UK','TH'].map(c => <div key={c} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${COUNTRY_COLORS[c].bg} border ${COUNTRY_COLORS[c].border}`} /><span className="text-slate-400">{c==='MM'?'Myanmar':c==='US'?'US':c==='UK'?'UK':'Thailand'}</span></div>)}
      </div>
    </div>
  );
}
