import { TCard } from "app/api/deck";
import { getIntervalTime } from "./stats";

export const getCardType = (card: TCard) => {
  switch (card.type) {
    case 0:
      return "New";
    case 1:
      return "Learning";
    case 2:
      const interval = getIntervalTime(card.reviews.at(-1)?.ivl!);
      // A mature card is one that has an interval of 21 days or greater.
      // https://docs.ankiweb.net/getting-started.html#cards
      if (interval / 1000 / 60 / 60 / 24 >= 21) {
        return "Mature";
      }
      return "Young";
    case 3:
      return "Relearning";
    default:
      return "Unknown";
  }
};
