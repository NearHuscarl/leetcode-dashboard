import { ankiConnect } from "./ankiConnect";

export type TCardReview = {
  id: number;
  usn: number;
  ease: 1 | 2 | 3 | 4;
  ivl: number;
  lastIvl: number;
  factor: number;
  time: number;
  type: 0 | 1 | 2 | 3;
};

export const getCardReviews = async (cards: number[]) => {
  const result: Record<number, TCardReview[]> = await ankiConnect(
    "getReviewsOfCards",
    { cards }
  );
  return result;
};
