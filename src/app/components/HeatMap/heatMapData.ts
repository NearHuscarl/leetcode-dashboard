import { HeatMapDatum, HeatMapSerie } from "@nivo/heatmap";
import getHours from "date-fns/getHours";
import { TDateFilter } from "app/store/filterSlice";
import { TCardModel } from "app/services/problems";
import { formatDate, getDateStart } from "app/helpers/date";

type THour = string;
type TDay = string;

const workingHour: Record<number, string> = {
  7: "7_9",
  8: "7_9",
  9: "9_11",
  10: "9_11",
  11: "11_13",
  12: "11_13",
  13: "13_15",
  14: "13_15",
  15: "15_17",
  16: "15_17",
  17: "17_19",
  18: "17_19",
  19: "19_21",
  20: "19_21",
  21: "21_23",
  22: "21_23",
  23: "23_1",
  0: "23_1",
};
const hourKeys = [
  "7_9",
  "9_11",
  "11_13",
  "13_15",
  "15_17",
  "17_19",
  "19_21",
  "21_23",
  "23_1",
];

const dayPriority = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

type TStats = {
  value: number;
  leetcodeIds: string[];
};

const createSubmap = (): Record<TDay, TStats> =>
  Object.keys(dayPriority).reduce((acc: any, day) => {
    acc[day] = { value: 0, leetcodeIds: [] };
    return acc;
  }, {});

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[], dateStart: Date) {
  const map: Record<THour, Record<TDay, TStats>> = hourKeys.reduce(
    (acc: any, hour) => {
      acc[hour] = createSubmap();
      return acc;
    },
    {}
  );

  for (const card of cards) {
    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const reviewDate = new Date(review.id);
      if (reviewDate < dateStart) continue;

      const hour = getHours(reviewDate);
      const hourKey = workingHour[hour];

      if (!hourKey) continue;

      const submap = map[hourKey];
      const day = formatDate(review.id, "E");

      submap[day].value++;
      submap[day].leetcodeIds.push(card.leetcodeId);
    }
  }

  return map;
}

export interface THeatMapDatum extends HeatMapDatum {
  leetcodeIds: string[];
}

export function prepareChartData(cards: TCardModel[], dateFilter: TDateFilter) {
  const data: HeatMapSerie<THeatMapDatum, {}>[] = [];
  const dateStart = getDateStart(dateFilter);
  const map = createMap(cards, dateStart ?? new Date(0));
  let totalReviews = 0;

  for (const hour of hourKeys) {
    data.push({
      id: hour,
      data: Object.keys(map[hour] ?? {})
        // @ts-ignore
        .sort((a, b) => dayPriority[a] - dayPriority[b])
        .map((day) => {
          const stats = map[hour]?.[day];
          const value = stats.value ?? 0;
          totalReviews += value;

          return { x: day, y: value, leetcodeIds: stats.leetcodeIds };
        }),
    });
  }

  return {
    data,
    totalReviews,
  };
}
