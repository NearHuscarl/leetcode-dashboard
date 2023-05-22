import { TSwarmPlotDateFilter } from "app/store/filterSlice";
import { TCardType, getCardType, getEaseRate } from "app/helpers/card";
import { TCardModel } from "app/services/problems";
import { TCardReview } from "app/api/stats";
import { getDateAgo } from "app/helpers/date";

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

export function prepareChartData(
  cards: TCardModel[],
  dateAgo: TSwarmPlotDateFilter
) {
  const points: TSwarmPlotDatum[] = [];
  const types = new Set<TCardType>();
  const dateEnd = getDateAgo(dateAgo);

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
    types:
      types.size > 0
        ? // @ts-ignore
          [...types].sort((a, b) => typePriority[a] - typePriority[b])
        : ["Learning", "Young", "Mature"],
  };
}
