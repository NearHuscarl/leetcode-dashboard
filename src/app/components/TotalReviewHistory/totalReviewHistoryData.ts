import { Serie } from "@nivo/line";
import { formatDate, getDateStart, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { TDateFilter } from "app/store/filterSlice";

type TDate = string;
type TDifficulty = "Easy" | "Medium" | "Hard";

function createMap(cards: TCardModel[]) {
  const totalMap: Record<TDate, { reviews: number; news: number }> = {};
  const newMap: Record<TDate, Record<TDifficulty, number>> = {};
  const reviewMap: Record<TDate, Record<TDifficulty, number>> = {};
  const createSubmap = () => ({ Easy: 0, Medium: 0, Hard: 0 });

  for (const card of cards) {
    if (!card.leetcode) continue;

    const { difficulty } = card.leetcode;

    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const isNewCard = i === 0;

      if (isNewCard) {
        const submap = newMap[date] ?? (newMap[date] = createSubmap()); // Initialize the submap if it doesn't exist
        submap[difficulty] = (submap[difficulty] ?? 0) + 1;
      }

      const submap = reviewMap[date] ?? (reviewMap[date] = createSubmap()); // Initialize the submap if it doesn't exist
      submap[difficulty] = (submap[difficulty] ?? 0) + 1;

      totalMap[date] ??= { reviews: 0, news: 0 };
      totalMap[date].reviews += 1;
      if (isNewCard) totalMap[date].news += 1;
    }
  }

  return { reviewMap, newMap, totalMap };
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
  const { reviewMap, newMap, totalMap } = createMap(cards);
  const difficulties = ["Easy", "Medium", "Hard"] as const;

  const createTotalLookup = () => ({
    reviews: 0,
    news: 0,
    reviewPoints: [] as Serie["data"],
    newPoints: [] as Serie["data"],
  });
  const totalLookup = {
    Easy: createTotalLookup(),
    Medium: createTotalLookup(),
    Hard: createTotalLookup(),
    Total: createTotalLookup(),
  };

  for (const date of dates) {
    for (const difficulty of difficulties) {
      const r = reviewMap[date]?.[difficulty] ?? 0;
      const n = newMap[date]?.[difficulty] ?? 0;

      totalLookup[difficulty].reviews += r;
      totalLookup[difficulty].reviewPoints.push({
        x: date,
        y: totalLookup[difficulty].reviews,
      });

      totalLookup[difficulty].news += n;
      totalLookup[difficulty].newPoints.push({
        x: date,
        y: totalLookup[difficulty].news,
      });
    }

    totalLookup["Total"].news += totalMap[date]?.news ?? 0;
    totalLookup["Total"].newPoints.push({
      x: date,
      y: totalLookup["Total"].news,
    });

    totalLookup["Total"].reviews += totalMap[date]?.reviews ?? 0;
    totalLookup["Total"].reviewPoints.push({
      x: date,
      y: totalLookup["Total"].reviews,
    });
  }

  const reviewData = difficulties.map((difficulty) => ({
    id: difficulty,
    data: totalLookup[difficulty].reviewPoints,
  }));
  const newData = difficulties.map((difficulty) => ({
    id: difficulty,
    data: totalLookup[difficulty].newPoints,
  }));
  const totalData = [
    { id: "Problems", data: totalLookup["Total"].newPoints },
    { id: "Reviews", data: totalLookup["Total"].reviewPoints },
  ];

  let totalReviews = 0;
  let totalReviewsThisWeek = 0;
  reviewData.forEach((d) => {
    const todayCount = (d.data.at(-1)?.y as number) ?? 0;
    const lastSevenDaysCount = (d.data.at(-1 - 7)?.y as number) ?? 0;

    totalReviews += todayCount;
    totalReviewsThisWeek += todayCount - lastSevenDaysCount ?? 0;
  });

  let totalProblems = 0;
  let totalProblemsThisWeek = 0;
  newData.forEach((d) => {
    const todayCount = (d.data.at(-1)?.y as number) ?? 0;
    const lastSevenDaysCount = (d.data.at(-1 - 7)?.y as number) ?? 0;

    totalProblems += todayCount;
    totalProblemsThisWeek += todayCount - lastSevenDaysCount ?? 0;
  });

  return {
    totalProblems,
    totalProblemsThisWeek,
    totalReviews,
    totalReviewsThisWeek,
    totalData,
    reviewData,
    newData,
  };
}
