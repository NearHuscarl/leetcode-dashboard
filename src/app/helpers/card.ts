import { TCard } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { getIntervalTime } from "./stats";
import { MSS } from "app/settings";

export type TCardType =
  | "New"
  | "Learning"
  | "Young"
  | "Mature"
  | "Relearning"
  | "Unknown";

export const getCardTypeAt = (card: TCard, date: number) => {
  if (card.reviews.length === 0) {
    return "New" as const;
  }

  // card.type: the latest type as of now AFTER the last review
  // card.reviews[i].type: the type BEFORE this review
  for (let i = 0; i < card.reviews.length; i++) {
    const review = card.reviews[i];

    if (date < review.id) {
      if (i === 0) {
        return "New" as const;
      }
      return getCardTypeFromReview(review);
    }
  }

  return getCardType(card);
};

// A mature card is one that has an interval of 21 days or greater.
// https://docs.ankiweb.net/getting-started.html#cards
const isMatureInterval = (ivl: number) => {
  const interval = getIntervalTime(ivl);
  return interval / MSS.oneDay >= 21;
};

export const getCardType = (card: TCard): TCardType => {
  switch (card.type) {
    case 0:
      return "New";
    case 1:
      return "Learning";
    case 2:
      if (isMatureInterval(card.reviews.at(-1)?.ivl!)) {
        return "Mature";
      }
      return "Young";
    case 3:
      return "Relearning";
    default:
      return "Unknown";
  }
};
export const getCardTypeFromReview = (review: TCardReview): TCardType => {
  switch (review.type) {
    case 0:
      return "Learning";
    case 1:
      if (isMatureInterval(review.lastIvl)) {
        return "Mature";
      }
      return "Young";
    case 2:
      return "Relearning";
    default:
      return "Unknown";
  }
};

export const getNextReviewTime = (
  card: TCard,
  dateEndProps?: number
): number => {
  let review = card.reviews.at(-1);

  if (dateEndProps !== undefined) {
    const dateEnd = dateEndProps ?? Date.now();

    for (let i = 0; i < card.reviews.length; i++) {
      if (dateEnd < card.reviews[i].id) {
        review = card.reviews[i - 1];
        break;
      }
    }
  }

  if (!review) return 0;

  // there are 2 interval properties:
  // - card.interval: the next interval, if the card is overdue, then this is 0
  // - card.reviews.at(-1).ivl: the next interval
  const { id: reviewDate, ivl } = review;
  const interval = getIntervalTime(ivl!);

  return reviewDate + interval;
};

export const getDueDateDistance = (card: TCard, dateEnd?: number) => {
  dateEnd = dateEnd ?? Date.now();

  // card does not exist at this point
  if (dateEnd < card.cardId) {
    return null;
  }

  const nextInterviewTime = getNextReviewTime(card, dateEnd);

  // new card without any review
  if (nextInterviewTime == 0) {
    return 0;
  }

  return nextInterviewTime - dateEnd;
};

export type TDueStatus =
  | "stale"
  | "bad"
  | "now"
  | "soon"
  | "good"
  | "safe"
  | "none";

export const getDueStatus = (card: TCard, dateEnd?: number): TDueStatus => {
  const distance = getDueDateDistance(card, dateEnd);

  // card does not exist at this point
  if (distance === null) {
    return "none";
  }

  // new card without any review
  if (distance == 0) {
    return "now";
  }

  if (distance < -MSS.oneMonth) {
    return "stale";
  } else if (distance < -MSS.oneDay) {
    return "bad";
  } else if (distance >= -MSS.oneDay && distance <= MSS.oneDay) {
    return "now";
  } else if (distance < MSS.oneWeek) {
    return "soon";
  } else if (distance < MSS.oneMonth) {
    return "good";
  }
  return "safe";
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

export type TEaseLabel = "again" | "hard" | "good" | "easy" | "unknown";

export const getEaseLabel = (ease: number): TEaseLabel => {
  switch (ease) {
    case 1:
      return "again";
    case 2:
      return "hard";
    case 3:
      return "good";
    case 4:
      return "easy";
  }
  return "unknown";
};
