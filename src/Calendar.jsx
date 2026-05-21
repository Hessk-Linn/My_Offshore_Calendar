import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO, differenceInDays } from 'date-fns';
import { useStore } from './store';
import { getHolidaysForMonth, COUNTRY_COLORS } from './holidays';
import { ChevronLeft, ChevronRight, Plane } from 'lucide-react';

// Check if day is first day of on-rotation or first day of off-rotation
function isTravelDayAuto(day, anchorDate, onDays, offDays) {
  const start = parseISO(anchorDate);
  const diff = differenceInDays(day, start);
  const cycle = onDays + offDays;
  const position = ((diff % cycle) + cycle) % cycle;
  // Day 0 is first day of on-rotation, day onDays is first day of off-rotation
  return position === 0 || position === onDays;
}

function isWorkDay(day, anchorDate, onDays, offDays) {
  const start = parseISO(anchorDate);
  const diff = differenceInDays(day, start);
  const cycle = onDays + offDays;
  const position = ((diff % cycle) + cycle) % cycle;
  return position < onDays;
}

export default function Calendar() {
  const [cm, setCm] = useState(new Date());
  const { anchorDate, rotationOn, rotationOff } = useStore();
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
  const hm = useMemo(() => {
    const m = {}; hols.forEach(h => { m[h.date] = h; }); return m;
  }, [hols]);
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
      {!anchorDate && (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 text-center mb-2">
          <p className="text-xs text-sky-200/70">Set anchor date in Settings to see rotation schedule</p>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1">
        {wd.map(d => <div key={d} className={`text-center text-xs font-semibold py-2 ${d==='Sun'||d==='Sat'?'text-rose-400/70':'text-slate-500'}`}>{d}</div>)}
        {days.map((day, i) => {
          const ds = format(day, 'yyyy-MM-dd');
          const on = anchorDate ? isWorkDay(day, anchorDate, rotationOn, rotationOff) : false;
          const tr = anchorDate ? isTravelDayAuto(day, anchorDate, rotationOn, rotationOff) : false;
          const cmo = isSameMonth(day, ms);
          const hol = hm[ds];
          const we = day.getDay() === 0 || day.getDay() === 6;
          // Always red font for weekend or holiday
          const isRedFont = we || hol;
          let bg = 'bg-transparent', bc = 'border-transparent';
          if (anchorDate) {
            if (tr) { bg = 'bg-sky-500/40'; bc = 'border-sky-500/50'; }
            else if (on) { bg = 'bg-amber-500/20'; bc = 'border-amber-500/30'; }
            else if (cmo) { bg = 'bg-slate-800/30'; bc = 'border-slate-700/20'; }
          } else {
            // No anchor date
            if (cmo) { bg = 'bg-slate-800/30'; bc = 'border-slate-700/20'; }
          }
          return (
            <div key={i} className={`relative h-12 flex flex-col items-center justify-center rounded-lg border transition-all ${cmo?'':'text-slate-600'} ${isRedFont?'text-rose-400':'text-slate-100'} ${bg} ${bc} ${isToday(day)?'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0b1220]':''}`}>
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {tr && <Plane className="absolute bottom-1 w-3 h-3 text-sky-300" />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /><span className="text-slate-400">On Rotation</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-sky-500/40 border border-sky-500/50 flex items-center justify-center"><Plane className="w-2 h-2 text-sky-300" /></div><span className="text-slate-400">Travel Day</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-800/30 border border-slate-700/20" /><span className="text-slate-400">Off Rotation</span></div>
      </div>

      {/* Holiday Details */}
      {hols.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Holidays this month</h3>
          <div className="space-y-1.5">
            {hols.map(h => (
              <div key={h.date} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${COUNTRY_COLORS[h.country].dot}`} />
                <span className="text-slate-300 font-medium">{h.date.slice(8)}</span>
                <span className="text-slate-400">{h.name}</span>
                <span className="text-xs text-slate-500">({COUNTRY_COLORS[h.country].label})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
