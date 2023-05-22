import blue from "@mui/material/colors/blue";
import orange from "@mui/material/colors/orange";
import lightGreen from "@mui/material/colors/lightGreen";
import green from "@mui/material/colors/green";
import red from "@mui/material/colors/red";
import grey from "@mui/material/colors/grey";
import { TCard } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { getIntervalTime } from "./stats";

export type TCardType =
  | "New"
  | "Learning"
  | "Young"
  | "Mature"
  | "Relearning"
  | "Unknown";

export const getCardType = (card: TCard): TCardType => {
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

export const getCardTypeColor = (type: TCardType): string => {
  switch (type) {
    case "New":
      return blue[500];
    case "Learning":
      return orange[500];
    case "Young":
      return lightGreen[500];
    case "Mature":
      return green[500];
    case "Relearning":
      return red[500];
  }
  return grey[500];
};

export const getNextReviewTime = (card: TCard): number => {
  const lastReview = card.reviews.at(-1);
  if (!lastReview) return 0;

  // there are 2 interval properties:
  // - card.interval: the next interval, if the card is overdue, then this is 0
  // - card.reviews.at(-1).ivl: the next interval
  const { id: reviewDate, ivl } = lastReview;
  const interval = getIntervalTime(ivl!);

  return reviewDate + interval;
};

export const getRetentionRate = (card: TCard): number => {
  const successReviews = card.reviews.filter((r) => r.ease > 1).length;

  return successReviews / card.reviews.length;
};

export const getEaseRate = (reviews: TCardReview[]): number => {
  let score = 0;

  for (const review of reviews) {
    switch (review.ease) {
      case 1:
        score += 0;
        break;
      case 2:
        score += 0.5;
        break;
      case 3:
        score += 0.75;
        break;
      case 4:
        score += 1;
        break;
    }
  }
  return score / reviews.length;
};
