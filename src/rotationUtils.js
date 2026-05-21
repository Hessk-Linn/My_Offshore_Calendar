import { 
  addDays, 
  differenceInDays, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  parseISO
} from 'date-fns';

/**
 * Calculates if a given date is an "On" day based on an anchor date and 28/28 rotation.
 */
export const isWorkDay = (date, anchorDate, onDays = 28, offDays = 28) => {
  if (!anchorDate) return false;
  const start = parseISO(anchorDate);
  const diff = differenceInDays(date, start);
  const cycle = onDays + offDays;
  const position = ((diff % cycle) + cycle) % cycle;
  return position < onDays;
};

/**
 * Calculates Myanmar Income Tax based on monthly income brackets.
 * Brackets (Monthly MMK):
 * 0 - 2,000,000: 0%
 * 2,000,001 - 10,000,000: 5%
 * 10,000,001 - 30,000,000: 10%
 * 30,000,001 - 50,000,000: 15%
 * 50,000,001 - 70,000,000: 20%
 * 70,000,001+: 25%
 */
export const calculateMyanmarTax = (monthlyGross) => {
  let tax = 0;
  
  const brackets = [
    { limit: 2000000, rate: 0 },
    { limit: 10000000, rate: 0.05 },
    { limit: 30000000, rate: 0.10 },
    { limit: 50000000, rate: 0.15 },
    { limit: 70000000, rate: 0.20 },
    { limit: Infinity, rate: 0.25 },
  ];

  let remaining = monthlyGross;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const amountInBracket = Math.min(remaining, bracket.limit - previousLimit);
    if (amountInBracket <= 0) break;
    
    tax += amountInBracket * bracket.rate;
    remaining -= amountInBracket;
    previousLimit = bracket.limit;
  }

  return tax;
};

/**
 * Gets stats for a specific month
 */
export const getMonthStats = (monthDate, anchorDate, travelDays, rates, rotationOn = 28, rotationOff = 28, mmkMonthlyAmount = 0) => {
  // Return zeros if no anchor date set
  if (!anchorDate) {
    return { workDaysCount: 0, travelDaysCount: 0, gross: 0, tax: 0 };
  }

  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start, end });

  let workDaysCount = 0;
  let travelDaysCount = 0;

  days.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isOn = isWorkDay(day, anchorDate, rotationOn, rotationOff);
    const isTravel = travelDays.includes(dateStr);

    if (isOn) workDaysCount++;
    if (isTravel) travelDaysCount++;
  });

  const gross = (workDaysCount * rates.normalRate) + 
                (travelDaysCount * rates.travelRate) + 
                rates.allowances;
  
  // Use manual MMK amount for tax calculation if provided, otherwise fall back to gross if currency is MMK
  const taxBase = mmkMonthlyAmount > 0 ? mmkMonthlyAmount : (rates.currency === 'MMK' ? gross : 0);
  const tax = taxBase > 0 ? calculateMyanmarTax(taxBase) : 0;

  // Note: Net is not calculated because tax (MMK) and gross (USD) are different currencies
  return {
    workDaysCount,
    travelDaysCount,
    gross,
    tax, // Always in MMK
  };
};
