import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { useStore } from './store';
import { isWorkDay } from './rotationUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { anchorDate, travelDays, toggleTravelDay } = useStore();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isOn = isWorkDay(day, anchorDate);
          const isTravel = travelDays.includes(dateStr);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          let bgColor = 'bg-transparent';
          if (isOn) bgColor = 'bg-amber-500/20 border-amber-500/30';
          if (isTravel) bgColor = 'bg-sky-500/40 border-sky-500/50';
          
          return (
            <button
              key={idx}
              onClick={() => toggleTravelDay(dateStr)}
              className={`
                relative h-12 flex flex-col items-center justify-center rounded-lg border transition-all
                ${isCurrentMonth ? 'text-slate-100' : 'text-slate-600'}
                ${bgColor}
                ${isToday(day) ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0b1220]' : ''}
                hover:scale-105 active:scale-95
              `}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {isTravel && <div className="absolute bottom-1 w-1 h-1 bg-sky-400 rounded-full" />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
          <span className="text-slate-400">On Rotation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-sky-500/40 border border-sky-500/50" />
          <span className="text-slate-400">Travel Day</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
