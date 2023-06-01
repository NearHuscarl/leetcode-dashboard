import { TDateAgoFilter } from "app/store/filterSlice";
import { TCardModel } from "app/services/problems";
import { getDateAgo } from "app/helpers/date";
import {
  TCardType,
  TEaseLabel,
  getCardTypeFromReview,
  getEaseLabel,
} from "app/helpers/card";
import { MayHaveLabel } from "@nivo/pie";

export interface TRetentionDatum extends MayHaveLabel {
  id: TEaseLabel;
  value: number;
}

type TRetentionRateData = {
  Learning: TRetentionDatum[];
  Young: TRetentionDatum[];
  Mature: TRetentionDatum[];
};

const getEaseIndex = (ease: number) => {
  switch (ease) {
    case 1:
      return 3;
    case 2:
      return 0;
    case 3:
      return 1;
    case 4:
      return 2;
    default:
      return -1;
  }
};

const createDatums = (cardType: TCardType) => [
  { id: getEaseLabel(2), value: 0, cardType },
  { id: getEaseLabel(3), value: 0, cardType },
  { id: getEaseLabel(4), value: 0, cardType },
  { id: getEaseLabel(1), value: 0, cardType },
];

export function prepareChartData(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const dateEnd = getDateAgo(dateAgo);
  const data: Record<string, TRetentionDatum[]> = {
    Learning: createDatums("Learning"),
    Young: createDatums("Young"),
    Mature: createDatums("Mature"),
  } as TRetentionRateData;
  const ease = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    unknown: 0,
  };

  for (const card of cards) {
    for (const review of card.reviews) {
      if (review.id > dateEnd) continue;

      const cardType = getCardTypeFromReview(review);

      if (data[cardType] === undefined) continue;

      const easeLabel = getEaseLabel(review.ease);
      const i = getEaseIndex(review.ease);

      ease[easeLabel] += 1;

      data[cardType][i] = data[cardType][i] ?? {
        id: easeLabel,
        value: 0,
      };
      data[cardType][i].value += 1;
    }
  }

  return {
    data,
    ease,
  };
}
