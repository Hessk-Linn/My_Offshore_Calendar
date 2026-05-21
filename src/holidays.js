// MYANMAR HOLIDAYS - Fixed (Gregorian) and Variable (Lunar-based)
// ============================================================================
// LUNAR HOLIDAY CONFIGURATION - Update these dates annually based on official
// Myanmar government announcements. Thingyan and other lunar holidays shift
// by 1-2 days each year according to the Burmese lunisolar calendar.
// ============================================================================

const LUNAR_HOLIDAY_CONFIG = {
  // Format: 'YYYY': { thingyanStart: DD, thingyanEnd: DD, newYearDay: DD, wasoDay: DD }
  // Thingyan typically lasts 4 days, followed by New Year's Day
  2025: { thingyanStart: 13, thingyanEnd: 16, newYearDay: 17, wasoDay: 19, thadingyutStart: 5, tazaungdaingStart: 3 },
  2026: { thingyanStart: 13, thingyanEnd: 16, newYearDay: 17, wasoDay: 20, thadingyutStart: 24, tazaungdaingStart: 13 },
  2027: { thingyanStart: 13, thingyanEnd: 16, newYearDay: 17, wasoDay: 20, thadingyutStart: 23, tazaungdaingStart: 12 },
  // Add more years as needed - check official Myanmar government announcements
};

// Default lunar holiday dates (used if year not in config above)
const DEFAULT_LUNAR_DATES = {
  thingyanStart: 13, thingyanEnd: 16, newYearDay: 17,
  wasoDay: 20, thadingyutStart: 24, tazaungdaingStart: 13
};

// ============================================================================

// FIXED HOLIDAYS - These stay the same every year
const FIXED_HOLIDAYS = [
  // MYANMAR Fixed Holidays
  { month: 1, day: 1, name: "New Year's Day", country: 'MM' },
  { month: 1, day: 4, name: 'Independence Day', country: 'MM' },
  { month: 2, day: 12, name: 'Union Day', country: 'MM' },
  { month: 3, day: 2, name: "Peasants' Day", country: 'MM' },
  { month: 3, day: 27, name: 'Armed Forces Day', country: 'MM' },
  { month: 5, day: 1, name: 'Labour Day', country: 'MM' },
  { month: 7, day: 19, name: "Martyrs' Day", country: 'MM' },
  { month: 12, day: 25, name: 'Christmas Day', country: 'MM' },
  { month: 12, day: 31, name: "New Year's Eve", country: 'MM' },

  // THAILAND Fixed Holidays
  { month: 1, day: 1, name: "New Year's Day", country: 'TH' },
  { month: 4, day: 6, name: 'Chakri Memorial Day', country: 'TH' },
  { month: 5, day: 4, name: 'Coronation Day', country: 'TH' },
  { month: 6, day: 3, name: "Queen Suthida's Birthday", country: 'TH' },
  { month: 7, day: 28, name: "HM King's Birthday", country: 'TH' },
  { month: 8, day: 12, name: "HM Queen Mother's Birthday", country: 'TH' },
  { month: 10, day: 13, name: 'King Bhumibol Memorial Day', country: 'TH' },
  { month: 10, day: 23, name: 'Chulalongkorn Day', country: 'TH' },
  { month: 12, day: 5, name: "HM King's Birthday (Father's Day)", country: 'TH' },
  { month: 12, day: 10, name: 'Constitution Day', country: 'TH' },
  { month: 12, day: 31, name: "New Year's Eve", country: 'TH' },
];

/**
 * Generate Myanmar lunar-based holidays for a specific year
 * These dates change annually based on the Burmese lunisolar calendar
 * Update LUNAR_HOLIDAY_CONFIG above with official government announcements
 */
function getMyanmarLunarHolidays(year) {
  const config = LUNAR_HOLIDAY_CONFIG[year] || DEFAULT_LUNAR_DATES;
  const holidays = [];

  // Thingyan Water Festival (4 days)
  for (let day = config.thingyanStart; day <= config.thingyanEnd; day++) {
    holidays.push({ month: 4, day, name: 'Thingyan (Water Festival)', country: 'MM' });
  }

  // Burmese New Year (day after Thingyan)
  holidays.push({ month: 4, day: config.newYearDay, name: 'Burmese New Year', country: 'MM' });

  // Waso (Buddhist Lent Start)
  holidays.push({ month: 7, day: config.wasoDay, name: 'Waso (Buddhist Lent Begins)', country: 'MM' });

  // Thadingyut (Lighting Festival - 3 days)
  holidays.push({ month: 10, day: config.thadingyutStart, name: 'Thadingyut (Lighting Festival)', country: 'MM' });
  holidays.push({ month: 10, day: config.thadingyutStart + 1, name: 'Thadingyut Holiday', country: 'MM' });
  holidays.push({ month: 10, day: config.thadingyutStart + 2, name: 'Thadingyut Holiday', country: 'MM' });

  // Tazaungdaing Festival (3 days)
  holidays.push({ month: 11, day: config.tazaungdaingStart, name: 'Tazaungdaing Festival', country: 'MM' });
  holidays.push({ month: 11, day: config.tazaungdaingStart + 1, name: 'Tazaungdaing Holiday', country: 'MM' });
  holidays.push({ month: 11, day: config.tazaungdaingStart + 2, name: 'Tazaungdaing Holiday', country: 'MM' });

  return holidays;
}

/**
 * Variable holidays - Thailand Songkran (April 13-15 fixed)
 */
function getVariableHolidays(year) {
  return [
    // Thailand Songkran
    { month: 4, day: 13, name: 'Songkran Festival', country: 'TH' },
    { month: 4, day: 14, name: 'Songkran Festival', country: 'TH' },
    { month: 4, day: 15, name: 'Songkran Festival', country: 'TH' },
  ];
}

export const COUNTRY_COLORS = {
  MM: { bg: 'bg-yellow-500/25', border: 'border-yellow-500/40', dot: 'bg-yellow-400', label: 'Myanmar' },
  TH: { bg: 'bg-purple-500/25', border: 'border-purple-500/40', dot: 'bg-purple-400', label: 'Thailand' },
};

export function getHolidaysForYear(year) {
  const fixed = FIXED_HOLIDAYS.map(h => ({
    ...h,
    date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
  }));
  const lunar = getMyanmarLunarHolidays(year).map(h => ({
    ...h,
    date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
  }));
  const variable = getVariableHolidays(year).map(h => ({
    ...h,
    date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
  }));
  return [...fixed, ...lunar, ...variable];
}

export function getHolidaysForMonth(year, month) {
  return getHolidaysForYear(year).filter(h => h.month === month);
}
