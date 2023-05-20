import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import { TDateFilter } from "app/store/filterSlice";

export const formatDate = (date: number | Date, dateFormat = "yyyy-MM-dd") => {
  return format(date, dateFormat);
};

export const formatDisplayedDate = (date: number | Date) => {
  return format(date, "EEEE, MMM d, yyyy");
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

export function getDateStart(filter: TDateFilter): Date | undefined {
  const date = new Date();

  switch (filter) {
    case "week":
      return new Date(date.setDate(date.getDate() - 6));
    case "month":
      return new Date(date.setMonth(date.getMonth() - 1));
    case "quarter":
      return new Date(date.setMonth(date.getMonth() - 3));
    case "year":
      return new Date(date.setFullYear(date.getFullYear() - 1));
  }
}
