import { formatDate } from "./date";

export const getTickFormattedDate = (date: string, daysRecoreded: number) => {
  const [_, __, day] = date.split("-").map(Number);
  if (daysRecoreded <= 7) {
    return formatDate(new Date(date), "dd/MM");
  }
  if (daysRecoreded <= 31) {
    if (day % 5 === 0) {
      return formatDate(new Date(date), "dd/MM");
    }
    return null;
  }

  // Only show the tick labels of the first month
  if (day !== 1) {
    return null;
  }
  return formatDate(new Date(date), "MMM");
};
