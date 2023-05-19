import { TCardType, getCardType, getEaseRate } from "app/helpers/card";
import { TCardModel } from "app/services/problems";

export type TSwarmPlotDatum = {
  group: string;
  id: string;
  value: number;
  volume: number;
};

const typePriority = {
  Relearning: -1,
  Learning: 0,
  Young: 1,
  Mature: 2,
} as const;

export function prepareChartData(cards: TCardModel[]) {
  const points: TSwarmPlotDatum[] = [];
  const types = new Set<TCardType>();

  for (const card of cards) {
    const type = getCardType(card);
    const easeRate = getEaseRate(card);

    if (type === "New") continue; // Skip new cards (they don't have ease rate)

    types.add(type);
    points.push({
      id: card.leetcodeId,
      value: easeRate,
      group: type,
      volume: card.reviews.length,
    });
  }

  return {
    data: points,
    // @ts-ignore
    types: [...types].sort((a, b) => typePriority[a] - typePriority[b]),
  };
}
