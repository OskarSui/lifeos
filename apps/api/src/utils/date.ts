export function getTodayRange() {
  const now = new Date();

  const startOfDay = new Date(now);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);

  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
}

export function getDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
