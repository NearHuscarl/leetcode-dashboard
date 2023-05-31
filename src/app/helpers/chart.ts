import { formatDate } from "./date";

export const getTickFormattedDate = (date: string, daysRecorded: number) => {
  const [_, __, day] = date.split("-").map(Number);
  if (daysRecorded <= 7) {
    return formatDate(new Date(date), "dd/MM");
  }
  if (daysRecorded <= 31) {
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
