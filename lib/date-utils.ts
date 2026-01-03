// lib/date-utils.ts

export function getISTDate() {
  const now = new Date();

  // 1. Get string parts for Asia/Kolkata
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Asia/Kolkata', 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
  };
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  // 2. Map parts to variables
  const map: Record<string, string> = {};
  parts.forEach(p => map[p.type] = p.value);
  
  // 3. Construct UTC Midnight for that IST Day
  // This acts as a universal ID for "Today in India"
  const year = parseInt(map.year);
  const month = parseInt(map.month) - 1; // JS months are 0-11
  const day = parseInt(map.day);

  return new Date(Date.UTC(year, month, day));
}

export function getNextDayIST(date: Date) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}