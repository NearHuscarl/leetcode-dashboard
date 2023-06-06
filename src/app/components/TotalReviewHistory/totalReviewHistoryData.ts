import { Datum, Serie } from "@nivo/line";
import { formatDate, getDateStart, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { TDateFilter } from "app/store/filterSlice";

type TStats = string[];
type TDate = string;
type TDifficulty = "Easy" | "Medium" | "Hard";

export interface TLineDatum extends Datum {
  leetcodeIds: string[];
}

function createMap(cards: TCardModel[]) {
  const totalMap: Record<TDate, { reviews: TStats; news: TStats }> = {};
  const newMap: Record<TDate, Record<TDifficulty, TStats>> = {};
  const reviewMap: Record<TDate, Record<TDifficulty, TStats>> = {};
  const createStats = () => [];
  const createSubmap = () => ({
    Easy: createStats(),
    Medium: createStats(),
    Hard: createStats(),
  });

  for (const card of cards) {
    if (!card.leetcode) continue;

    const { difficulty } = card.leetcode;

    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const isNewCard = i === 0;

      if (isNewCard) {
        const submap = newMap[date] ?? (newMap[date] = createSubmap()); // Initialize the submap if it doesn't exist
        submap[difficulty].push(card.leetcodeId);
      }

      const submap = reviewMap[date] ?? (reviewMap[date] = createSubmap()); // Initialize the submap if it doesn't exist
      submap[difficulty].push(card.leetcodeId);

      totalMap[date] ??= { reviews: createStats(), news: createStats() };
      totalMap[date].reviews.push(card.leetcodeId);

      if (isNewCard) {
        totalMap[date].news.push(card.leetcodeId);
      }
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
    reviewPoints: [] as TLineDatum[],
    newPoints: [] as TLineDatum[],
  });
  const totalLookup = {
    Easy: createTotalLookup(),
    Medium: createTotalLookup(),
    Hard: createTotalLookup(),
    Total: createTotalLookup(),
  };

  for (const date of dates) {
    for (const difficulty of difficulties) {
      const r = reviewMap[date]?.[difficulty] ?? [];
      const n = newMap[date]?.[difficulty] ?? [];

      totalLookup[difficulty].reviews += r.length;
      totalLookup[difficulty].reviewPoints.push({
        x: date,
        y: totalLookup[difficulty].reviews,
        leetcodeIds: r,
      });

      totalLookup[difficulty].news += n.length;
      totalLookup[difficulty].newPoints.push({
        x: date,
        y: totalLookup[difficulty].news,
        leetcodeIds: n,
      });
    }

    const n = totalMap[date]?.news ?? [];
    totalLookup["Total"].news += n.length;
    totalLookup["Total"].newPoints.push({
      x: date,
      y: totalLookup["Total"].news,
      leetcodeIds: n,
    });

    const r = totalMap[date]?.reviews ?? [];
    totalLookup["Total"].reviews += r.length;
    totalLookup["Total"].reviewPoints.push({
      x: date,
      y: totalLookup["Total"].reviews,
      leetcodeIds: r,
    });
  }

  const reviewData: Serie[] = difficulties.map((difficulty) => ({
    id: difficulty,
    data: totalLookup[difficulty].reviewPoints,
  }));
  const newData: Serie[] = difficulties.map((difficulty) => ({
    id: difficulty,
    data: totalLookup[difficulty].newPoints,
  }));
  const totalData: Serie[] = [
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
