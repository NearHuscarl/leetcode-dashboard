import { TDateAgoFilter } from "app/store/filterSlice";
import { TCardType, getCardTypeAt, getEaseRate } from "app/helpers/card";
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

export function prepareChartData(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const points: TSwarmPlotDatum[] = [];
  const typeSet = new Set<TCardType>();
  const dateEnd = getDateAgo(dateAgo);

  for (const card of cards) {
    const type = getCardTypeAt(card, dateEnd);
    const reviews = card.reviews.filter((r) => r.id <= dateEnd);

    if (reviews.length === 0) continue;

    const easeRate = getEaseRate(reviews);

    if (type === "New") continue; // Skip new cards (they don't have ease rate)

    typeSet.add(type);
    points.push({
      id: card.leetcodeId,
      value: easeRate,
      acRate: card.leetcode?.acRate ?? 0,
      group: type,
      volume: card.reviews.length,
      reviews: card.reviews,
    });
  }

  const types: TCardType[] =
    typeSet.size > 0
      ? // @ts-ignore
        [...typeSet].sort((a, b) => typePriority[a] - typePriority[b])
      : ["Learning", "Young", "Mature"];

  return {
    data: points,
    types,
  };
}
