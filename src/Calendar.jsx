import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { useStore } from './store';
import { getHolidaysForMonth, COUNTRY_COLORS } from './holidays';
import { isWorkDay, isTravelDayAuto } from './rotationUtils';
import { ChevronLeft, ChevronRight, Plane, Briefcase } from 'lucide-react';

export default function Calendar() {
  const [cm, setCm] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const { anchorDate, rotationOn, rotationOff, travelDays, extraWorkDays, toggleTravelDay, toggleExtraWorkDay } = useStore();
  const nm = useCallback(() => setCm(addMonths(cm, 1)), [cm]);
  const pm = useCallback(() => setCm(subMonths(cm, 1)), [cm]);
  const td = () => setCm(new Date());
  
  const lastTapRef = useRef({});

  const handleDayTap = (dateStr) => {
    if (!anchorDate) return;
    setSelectedDay(dateStr);
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    const lastTap = lastTapRef.current[dateStr] || 0;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleTravelDay(dateStr);
      delete lastTapRef.current[dateStr];
    } else {
      lastTapRef.current[dateStr] = now;
    }
  };

  useEffect(() => {
    if (!anchorDate) {
      setSelectedDay(null);
    }
  }, [anchorDate]);

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
      {!anchorDate ? (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 text-center mb-2">
          <p className="text-xs text-sky-200/70">Set anchor date in Settings to see rotation schedule</p>
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-800/40 rounded-lg p-2.5 text-center mb-2 space-y-1">
          <p className="text-[10px] text-slate-400">💡 <strong>Double-tap</strong> any day to manually toggle <strong>Travel Day (✈️)</strong>.</p>
          <p className="text-[10px] text-slate-500">Single tap opens manual overrides for Travel and Extra Work.</p>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1">
        {wd.map(d => <div key={d} className={`text-center text-xs font-semibold py-2 ${d==='Sun'||d==='Sat'?'text-rose-400/70':'text-slate-500'}`}>{d}</div>)}
        {days.map((day, i) => {
          const ds = format(day, 'yyyy-MM-dd');
          const baseOn = anchorDate ? isWorkDay(day, anchorDate, rotationOn, rotationOff) : false;
          const extra = anchorDate ? extraWorkDays.includes(ds) : false;
          const travelToggle = travelDays.includes(ds);
          let tr = false;
          if (anchorDate) {
            const auto = isTravelDayAuto(day, anchorDate, rotationOn, rotationOff);
            tr = auto;
            if (travelToggle) tr = !tr;
            if (extra) tr = false;
          }
          const on = anchorDate ? (baseOn || extra) : false;
          const cmo = isSameMonth(day, ms);
          const hol = hm[ds];
          const we = day.getDay() === 0 || day.getDay() === 6;
          const selected = selectedDay === ds;

          // Determine text color based on holiday, weekend, and month focus
          let textColor = 'text-slate-100';
          if (!cmo) {
            textColor = 'text-slate-600'; // Out-of-month days
          } else if (hol) {
            textColor = 'text-red-600 font-extrabold underline underline-offset-2 decoration-red-500/40'; // Deep, rich blood-red for holidays with solid bold underlines
          } else if (we) {
            textColor = 'text-rose-300/70'; // Soft pale rose for weekends
          }

          let bg = 'bg-transparent', bc = 'border-transparent';
          if (anchorDate) {
            if (tr) { bg = 'bg-sky-500/40'; bc = 'border-sky-500/50'; }
            else if (extra) { bg = 'bg-emerald-500/25'; bc = 'border-emerald-500/40'; }
            else if (on) { bg = 'bg-amber-500/20'; bc = 'border-amber-500/30'; }
            else if (cmo) { bg = 'bg-slate-800/30'; bc = 'border-slate-700/20'; }
          } else {
            // No anchor date
            if (cmo) { bg = 'bg-slate-800/30'; bc = 'border-slate-700/20'; }
          }
          return (
            <div 
              key={i} 
              onClick={() => handleDayTap(ds)}
              className={`relative h-12 flex flex-col items-center justify-center rounded-lg border transition-all select-none cursor-pointer ${textColor} ${bg} ${bc} ${isToday(day)?'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0b1220]':''} ${selected?'outline outline-2 outline-sky-300/60':''}`}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {tr && <Plane className="absolute bottom-1 w-3 h-3 text-sky-300" />}
              {!tr && extra && <Briefcase className="absolute bottom-1 w-3 h-3 text-emerald-200" />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" /><span className="text-slate-400">On Rotation</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center"><Briefcase className="w-2 h-2 text-emerald-200" /></div><span className="text-slate-400">Extra Work Day</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-sky-500/40 border border-sky-500/50 flex items-center justify-center"><Plane className="w-2 h-2 text-sky-300" /></div><span className="text-slate-400">Travel Day</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-800/30 border border-slate-700/20" /><span className="text-slate-400">Off Rotation</span></div>
      </div>

      {selectedDay && anchorDate && (
        <ManualOverridePanel
          day={selectedDay}
          rotationOn={rotationOn}
          rotationOff={rotationOff}
          anchorDate={anchorDate}
          travelDays={travelDays}
          extraWorkDays={extraWorkDays}
          toggleTravelDay={toggleTravelDay}
          toggleExtraWorkDay={toggleExtraWorkDay}
        />
      )}

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

function ManualOverridePanel({ day, rotationOn, rotationOff, anchorDate, travelDays, extraWorkDays, toggleTravelDay, toggleExtraWorkDay }) {
  const date = parseISO(day);
  const label = format(date, 'EEEE, MMM d');
  const baseOn = isWorkDay(date, anchorDate, rotationOn, rotationOff);
  const autoTravel = isTravelDayAuto(date, anchorDate, rotationOn, rotationOff);
  const travelManual = travelDays.includes(day);
  const isExtra = extraWorkDays.includes(day);

  let travelActive = autoTravel;
  if (travelManual) travelActive = !travelActive;
  if (isExtra) travelActive = false;

  const travelLabel = travelActive ? 'Remove Travel' : 'Set as Travel Day';
  const extraLabel = isExtra ? 'Remove Extra Work' : 'Mark as Extra Work Day';
  const disableExtra = baseOn;

  return (
    <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Selected Day</p>
          <p className="text-base font-semibold text-slate-100">{label}</p>
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Base Status:</span> {baseOn ? 'On Rotation' : 'Off Rotation'}
          {isExtra && <span className="ml-2 text-emerald-300 font-medium">(Extra Work)</span>}
          {travelActive && <span className="ml-2 text-sky-300 font-medium">(Travel)</span>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleTravelDay(day)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${travelActive ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40' : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700/70'}`}
        >
          {travelLabel}
        </button>
        <button
          onClick={() => !disableExtra && toggleExtraWorkDay(day)}
          disabled={disableExtra}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${disableExtra ? 'bg-slate-800/40 text-slate-600 border border-slate-700/40 cursor-not-allowed' : isExtra ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700/70'}`}
        >
          {extraLabel}
        </button>
      </div>
      <p className="text-[11px] text-slate-500">Extra work days add to your ON count without changing the base rotation. Travel overrides always win when both are toggled.</p>
    </div>
  );
}
