import { Serie } from "@nivo/line";
import { formatDate, getDateStart, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { TDateFilter } from "app/store/filterSlice";

type TDate = string;
type TCategory = string;

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(
  cards: TCardModel[]
): Record<TDate, Record<TCategory, number>> {
  const map: Record<TDate, Record<TCategory, number>> = {};

  for (const card of cards) {
    const { difficulty } = card.leetcode;

    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const submap = map[date];
      const isNewCard = i === 0;
      const category = `${difficulty} - ${isNewCard ? "New" : "Review"}`;

      if (submap) {
        submap[category] = (submap[category] ?? 0) + 1;
      } else {
        map[date] = { [category]: 1 };
      }
    }
  }

  // Return the map
  return map;
}

export function prepareChartData(
  cards: any[],
  date: TDateFilter
): { data: Serie[] } {
  // Find the earliest and latest review dates
  let minReviewDate = new Date();
  for (const card of cards) {
    for (const review of card.reviews) {
      const reviewDate = new Date(review.id);
      if (reviewDate < minReviewDate) minReviewDate = reviewDate;
    }
  }

  // Find the earliest and latest review dates
  let minDate = getDateStart(date) ?? minReviewDate;
  let maxDate = new Date();

  // Get all the dates between the earliest and latest review dates
  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const result: any[] = [];
  const categories = [
    "Easy - New",
    "Easy - Review",
    "Medium - New",
    "Medium - Review",
    "Hard - New",
    "Hard - Review",
  ];

  for (const category of categories) {
    const data: any[] = [];
    let total = 0;

    for (const date of dates) {
      total += map[date]?.[category] ?? 0;
      data.push({ x: date, y: total });
    }

    result.push({ id: category, data });
  }

  return {
    data: result,
  };
}
