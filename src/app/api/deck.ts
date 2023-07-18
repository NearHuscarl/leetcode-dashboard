import keyBy from "lodash/keyBy";
import { ankiConnect } from "./ankiConnect";
import { getCardInfos } from "./card";
import { getNoteInfos } from "./note";
import { TCardReview, getCardReviews } from "./stats";
import { useQuery } from "@tanstack/react-query";
import { getCardTypeFromReview } from "app/helpers/card";

export const getCardIds = (deck: string): Promise<number[]> => {
  return ankiConnect("findCards", { query: `deck:${deck}` });
};

export type TCard = {
  reviews: TCardReview[];
  tags: string[];

  leetcodeId: string;
  neetcodeLink: string;
  website: "leetcode" | "lintcode";
  deckName: string;
  modelName: string;
  fieldOrder: number;
  cardId: number;
  interval: number;
  note: number;
  ord: number;
  type: number;
  queue: number;
  due: number;
  reps: number;
  lapses: number;
  left: number;
  mod: number;
};

export const getCards = async (deck: string) => {
  const cardIds = await getCardIds(deck);
  const [cardInfos, cardReviews] = await Promise.all([
    getCardInfos(cardIds),
    getCardReviews(cardIds),
  ]);
  const noteInfos = await getNoteInfos(cardInfos.map((c) => c.note));
  const noteLookup = keyBy(noteInfos, (n) => n.noteId);

  return cardInfos.map(
    (cardInfo) =>
      ({
        ...cardInfo,
        reviews: cardReviews[cardInfo.cardId].filter(
          // cram state is temporary for the filtered deck, it's an afterthought for this app and is not supported.
          (r) => getCardTypeFromReview(r) !== "Cram"
        ),
        tags: noteLookup[cardInfo.note].tags.filter(
          (t) => !t.startsWith("leetcode::lvl")
        ),
      } as TCard)
  );
};

export const useCards = () => {
  return useQuery(["cards"], () => getCards("Leetcode"));
};
