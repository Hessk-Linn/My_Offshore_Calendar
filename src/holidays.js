const FIXED_HOLIDAYS = [
  { month: 1, day: 4, name: 'Independence Day', country: 'MM' },
  { month: 2, day: 12, name: 'Union Day', country: 'MM' },
  { month: 3, day: 2, name: "Peasants' Day", country: 'MM' },
  { month: 3, day: 27, name: 'Armed Forces Day', country: 'MM' },
  { month: 5, day: 1, name: 'May Day', country: 'MM' },
  { month: 7, day: 19, name: "Martyrs' Day", country: 'MM' },
  { month: 12, day: 25, name: 'Christmas Day', country: 'MM' },
  { month: 1, day: 1, name: "New Year's Day", country: 'US' },
  { month: 7, day: 4, name: 'Independence Day', country: 'US' },
  { month: 11, day: 11, name: 'Veterans Day', country: 'US' },
  { month: 12, day: 25, name: 'Christmas Day', country: 'US' },
  { month: 1, day: 1, name: "New Year's Day", country: 'UK' },
  { month: 12, day: 25, name: 'Christmas Day', country: 'UK' },
  { month: 12, day: 26, name: 'Boxing Day', country: 'UK' },
  { month: 1, day: 1, name: "New Year's Day", country: 'TH' },
  { month: 4, day: 6, name: 'Chakri Day', country: 'TH' },
  { month: 5, day: 4, name: 'Coronation Day', country: 'TH' },
  { month: 7, day: 28, name: "HM King's Birthday", country: 'TH' },
  { month: 8, day: 12, name: "HM Queen Mother's Birthday", country: 'TH' },
  { month: 10, day: 13, name: 'King Bhumibol Memorial', country: 'TH' },
  { month: 10, day: 23, name: 'Chulalongkorn Day', country: 'TH' },
  { month: 12, day: 5, name: "HM King's Birthday", country: 'TH' },
  { month: 12, day: 10, name: 'Constitution Day', country: 'TH' },
  { month: 12, day: 31, name: "New Year's Eve", country: 'TH' },
];

function getNthWeekdayOfMonth(year, month, weekday, n) {
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getMonth() !== month - 1) break;
    if (date.getDay() === weekday) { count++; if (count === n) return d; }
  }
  return null;
}

function getLastWeekdayOfMonth(year, month, weekday) {
  const lastDay = new Date(year, month, 0);
  while (lastDay.getDay() !== weekday) lastDay.setDate(lastDay.getDate() - 1);
  return lastDay.getDate();
}

function getEasterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getVariableHolidays(year) {
  const easter = getEasterSunday(year);
  const gf = new Date(easter); gf.setDate(easter.getDate() - 2);
  const em = new Date(easter); em.setDate(easter.getDate() + 1);
  const r = [];
  const add = (m, d, name, c) => { if (d) r.push({ month: m, day: d, name, country: c }); };
  add(1, getNthWeekdayOfMonth(year, 1, 1, 3), 'Martin Luther King Jr. Day', 'US');
  add(2, getNthWeekdayOfMonth(year, 2, 1, 3), "Presidents' Day", 'US');
  add(5, getLastWeekdayOfMonth(year, 5, 1), 'Memorial Day', 'US');
  add(9, getNthWeekdayOfMonth(year, 9, 1, 1), 'Labor Day', 'US');
  add(10, getNthWeekdayOfMonth(year, 10, 1, 2), 'Columbus Day', 'US');
  add(11, getNthWeekdayOfMonth(year, 11, 4, 4), 'Thanksgiving', 'US');
  r.push({ month: gf.getMonth() + 1, day: gf.getDate(), name: 'Good Friday', country: 'UK' });
  r.push({ month: em.getMonth() + 1, day: em.getDate(), name: 'Easter Monday', country: 'UK' });
  add(5, getNthWeekdayOfMonth(year, 5, 1, 1), 'Early May Bank Holiday', 'UK');
  add(5, getLastWeekdayOfMonth(year, 5, 1), 'Spring Bank Holiday', 'UK');
  add(8, getLastWeekdayOfMonth(year, 8, 1), 'Summer Bank Holiday', 'UK');
  r.push({ month: 4, day: 13, name: 'Songkran Festival', country: 'TH' });
  r.push({ month: 4, day: 14, name: 'Songkran Festival', country: 'TH' });
  r.push({ month: 4, day: 15, name: 'Songkran Festival', country: 'TH' });
  return r;
}

export const COUNTRY_COLORS = {
  MM: { bg: 'bg-yellow-500/25', border: 'border-yellow-500/40', dot: 'bg-yellow-400', label: 'MM' },
  US: { bg: 'bg-red-500/25', border: 'border-red-500/40', dot: 'bg-red-400', label: 'US' },
  UK: { bg: 'bg-blue-500/25', border: 'border-blue-500/40', dot: 'bg-blue-400', label: 'UK' },
  TH: { bg: 'bg-purple-500/25', border: 'border-purple-500/40', dot: 'bg-purple-400', label: 'TH' },
};

export function getHolidaysForYear(year) {
  const fixed = FIXED_HOLIDAYS.map(h => ({
    ...h,
    date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
  }));
  const variable = getVariableHolidays(year).map(h => ({
    ...h,
    date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
  }));
  return [...fixed, ...variable];
}

export function getHolidaysForMonth(year, month) {
  return getHolidaysForYear(year).filter(h => h.month === month);
}
