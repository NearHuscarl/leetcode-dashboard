import subWeeks from "date-fns/subWeeks";
import subMonths from "date-fns/subMonths";
import { TSwarmPlotDateFilter } from "app/store/filterSlice";
import { TCardType, getCardType, getEaseRate } from "app/helpers/card";
import { TCardModel } from "app/services/problems";
import { TCardReview } from "app/api/stats";

export type TSwarmPlotDatum = {
  group: string;
  id: string;
  value: number;
  volume: number;
  acRate: number;
  reviews: TCardReview[];
};

const typePriority = {
  Relearning: -1,
  Learning: 0,
  Young: 1,
  Mature: 2,
} as const;

export function getDateEnd(filter: TSwarmPlotDateFilter): number {
  const dateNow = new Date();

  switch (filter) {
    case "week":
      return subWeeks(dateNow, 1).valueOf();
    case "2week":
      return subWeeks(dateNow, 2).valueOf();
    case "month":
      return subMonths(dateNow, 1).valueOf();
    case "3month":
      return subMonths(dateNow, 3).valueOf();
    default:
      return dateNow.valueOf();
  }
}

export function prepareChartData(
  cards: TCardModel[],
  dateAgo: TSwarmPlotDateFilter
) {
  const points: TSwarmPlotDatum[] = [];
  const types = new Set<TCardType>();
  const dateEnd = getDateEnd(dateAgo);

  for (const card of cards) {
    const type = getCardType(card);
    const easeRate = getEaseRate(card.reviews.filter((r) => r.id <= dateEnd));

    if (type === "New") continue; // Skip new cards (they don't have ease rate)

    types.add(type);
    points.push({
      id: card.leetcodeId,
      value: easeRate,
      acRate: card.leetcode?.acRate ?? 0,
      group: type,
      volume: card.reviews.length,
      reviews: card.reviews,
    });
  }

  return {
    data: points,
    // @ts-ignore
    types: [...types].sort((a, b) => typePriority[a] - typePriority[b]),
  };
}
