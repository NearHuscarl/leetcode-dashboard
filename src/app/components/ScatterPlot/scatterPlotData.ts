import { TCardType, getCardType, getEaseRate } from "app/helpers/card";
import { TCardModel } from "app/services/problems";
import { ScatterPlotDatum, ScatterPlotRawSerie } from "@nivo/scatterplot";

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[]) {
  const map: Record<
    TCardType,
    { id: string; x: number; y: number; reviews: number }[]
  > = {} as any;

  for (const card of cards) {
    if (!card.leetcode) continue;

    const type = getCardType(card);
    const points = map[type] ?? (map[type] = []); // Initialize the points if it doesn't exist
    const easeRate = getEaseRate(card.reviews);

    points.push({
      id: card.leetcodeId,
      y: easeRate,
      x: card.leetcode.acRate,
      reviews: card.reviews.length,
    });
  }

  // Return the map
  return map;
}

const cardTypes: TCardType[] = [
  "New",
  "Learning",
  "Young",
  "Mature",
  "Relearning",
];

export function prepareChartData(cards: TCardModel[]) {
  const map = createMap(cards);
  const data: ScatterPlotRawSerie<ScatterPlotDatum>[] = [];

  for (const cardType of cardTypes) {
    const d = map[cardType] ?? [];
    data.push({ id: cardType, data: d });
  }

  return {
    data,
  };
}
