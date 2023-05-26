import { amber, lightGreen, orange } from "@mui/material/colors";
import grey from "@mui/material/colors/grey";
import { TDateAgoFilter } from "app/store/filterSlice";
import { TCardModel } from "app/services/problems";
import { getDateAgo } from "app/helpers/date";
import { getCardTypeFromReview } from "app/helpers/card";

type TRetentionArray = [
  good: { value: number; color: string },
  easy: { value: number; color: string },
  hard: { value: number; color: string },
  again: { value: number; color: string }
];
type TRetentionRateData = {
  Learning: TRetentionArray;
  Young: TRetentionArray;
  Mature: TRetentionArray;
};

const createRetentionArray = (): TRetentionArray => [
  { value: 0, color: orange[500] },
  { value: 0, color: amber[500] },
  { value: 0, color: lightGreen[500] },
  { value: 0, color: grey[300] },
];

export function prepareChartData(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const dateEnd = getDateAgo(dateAgo);
  const data: Record<string, TRetentionArray> = {
    Learning: createRetentionArray(),
    Young: createRetentionArray(),
    Mature: createRetentionArray(),
  } as TRetentionRateData;

  for (const card of cards) {
    for (const review of card.reviews) {
      if (review.id > dateEnd) continue;

      const cardType = getCardTypeFromReview(review);

      if (data[cardType] === undefined) continue;

      if (review.ease === 1) {
        data[cardType][3].value++;
      } else {
        data[cardType][review.ease - 2].value++;
      }
    }
  }

  return {
    data,
  };
}
