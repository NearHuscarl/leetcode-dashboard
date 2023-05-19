import { Serie } from "@nivo/line";
import { formatDate, getDateStart, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { TDateFilter } from "app/store/filterSlice";

type TDate = string;
type TCategory = string;

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[]) {
  const map: Record<TDate, Record<TCategory, number>> = {};

  for (const card of cards) {
    const { difficulty } = card.leetcode;

    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const submap = map[date] ?? (map[date] = {}); // Initialize the submap if it doesn't exist
      const isNewCard = i === 0;

      if (isNewCard) {
        const problemCategory = `${difficulty} Problems`;
        submap[problemCategory] = (submap[problemCategory] ?? 0) + 1;
      }

      const reviewCategory = `${difficulty} Reviews`;
      submap[reviewCategory] = (submap[reviewCategory] ?? 0) + 1;
    }
  }

  // Return the map
  return map;
}

export function prepareChartData(cards: TCardModel[], date: TDateFilter) {
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
  const result: Serie[] = [];
  const categories = [
    "Easy Problems",
    "Easy Reviews",
    "Medium Problems",
    "Medium Reviews",
    "Hard Problems",
    "Hard Reviews",
  ];

  for (const category of categories) {
    const data: Serie["data"] = [];
    let total = 0;

    for (const date of dates) {
      total += map[date]?.[category] ?? 0;
      data.push({ x: date, y: total });
    }

    result.push({ id: category, data });
  }

  let totalProblems = 0;
  let totalProblemsThisWeek = 0;
  let totalReviews = 0;
  let totalReviewsThisWeek = 0;
  result.forEach((d) => {
    const isReview = (d.id as string).endsWith("Reviews");
    const todayCount = (d.data.at(-1)?.y as number) ?? 0;
    const lastSevenDaysCount = (d.data.at(-1 - 7)?.y as number) ?? 0;

    if (isReview) {
      totalReviews += todayCount;
      totalReviewsThisWeek += todayCount - lastSevenDaysCount ?? 0;
    } else {
      totalProblems += todayCount;
      totalProblemsThisWeek += todayCount - lastSevenDaysCount ?? 0;
    }
  });

  return {
    totalProblems,
    totalProblemsThisWeek,
    totalReviews,
    totalReviewsThisWeek,
    data: result,
  };
}
