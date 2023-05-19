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
      const submap = map[date] ?? (map[date] = {} as any); // Initialize the submap if it doesn't exist
      const isNewCard = i === 0;
      const category = isNewCard ? "New" : "Review";

      submap[category] = (submap[category] ?? 0) + 1;
    }
  }

  // Return the map
  return map;
}

function hasProblemsSolved(
  map: Record<TDate, Record<TCategory, number>>,
  date: TDate
) {
  return map[date]?.["New"] > 0 || map[date]?.["Review"] > 0;
}

export function prepareChartData(cards: TCardModel[], year: number) {
  // Find the earliest and latest review dates
  const yearStart = new Date(year, 0, 1);
  const yearEnd = endOfYear(yearStart);
  const dateNow = new Date();

  const minDate = yearStart;
  const maxDate = yearEnd < dateNow ? yearEnd : dateNow;

  // Get all the dates between the earliest and latest review dates
  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const newData: CalendarData["data"] = [];
  const reviewData: CalendarData["data"] = [];

  // Initialize the current streak and the longest streak to zero
  let currentStreak = 0;
  let longestStreakThisYear = 0;

  for (const date of dates) {
    for (const category of ["New", "Review"] as const) {
      const value = map[date]?.[category] ?? 0;
      if (category === "New") {
        newData.push({ day: date, value });
      } else {
        reviewData.push({ day: date, value });
      }
    }

    // If the date has any problems solved, increment the current streak
    if (hasProblemsSolved(map, date)) {
      currentStreak++;
    } else if (date < formatDate(dateNow)) {
      // If the date has no problems solved, reset the current streak to zero
      currentStreak = 0;
    }

    // Update the longest streak if the current streak is longer
    if (currentStreak > longestStreakThisYear) {
      longestStreakThisYear = currentStreak;
    }
  }

  return {
    newData,
    reviewData,
    from: minDate,
    to: maxDate,
    currentStreak,
    longestStreakThisYear,
  };
}
