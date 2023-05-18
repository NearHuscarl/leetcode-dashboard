import { CalendarData } from "@nivo/calendar";
import { formatDate, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import endOfYear from "date-fns/endOfYear";

type TDate = string;
type TCategory = "Review" | "New";

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[]) {
  const map: Record<TDate, Record<TCategory, number>> = {};

  for (const card of cards) {
    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const submap = map[date];
      const isNewCard = i === 0;
      const category = isNewCard ? "New" : "Review";

      if (submap) {
        submap[category] = (submap[category] ?? 0) + 1;
      } else {
        map[date] = { [category]: 1 } as any;
      }
    }
  }

  // Return the map
  return map;
}

export function prepareChartData(cards: TCardModel[], year: number) {
  // Find the earliest and latest review dates
  const yearStart = new Date(year, 0, 1);
  const yearEnd = endOfYear(yearStart);
  const dateNow = new Date();

  const minDate = yearStart;
  const maxDate = yearEnd < dateNow ? yearEnd : dateNow;

  console.log({ minDate, maxDate });

  // Get all the dates between the earliest and latest review dates
  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const newData: CalendarData["data"] = [];
  const reviewData: CalendarData["data"] = [];

  for (const category of ["New", "Review"] as const) {
    for (const date of dates) {
      const value = map[date]?.[category] ?? 0;
      if (category === "New") {
        newData.push({ day: date, value });
      } else {
        reviewData.push({ day: date, value });
      }
    }
  }

  // TODO: implement
  // let currentStreak = 0;
  // let longestStreakThisYear = 0;

  return {
    newData,
    reviewData,
    from: minDate,
    to: maxDate,
  };
}
