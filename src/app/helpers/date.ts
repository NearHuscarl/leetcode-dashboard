import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";

export const formatDate = (date: number | Date, dateFormat = "yyyy-MM-dd") => {
  return format(date, dateFormat);
};

// A helper function that returns an array of dates between two dates
export function getDatesBetween(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const diff = differenceInDays(end, start);
  for (let i = 0; i <= diff; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
}
