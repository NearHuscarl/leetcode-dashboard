import keyBy from "lodash/keyBy";
import { ankiConnect } from "./ankiConnect";
import { getCardInfos } from "./card";
import { getNoteInfos } from "./note";
import { getCardReviews } from "./stats";

export const getCardIds = (deck: string): Promise<number[]> => {
  return ankiConnect("findCards", { query: `deck:${deck}` });
};

export const getCards = async (deck: string) => {
  const cardIds = await getCardIds(deck);
  const [cardInfos, cardReviews] = await Promise.all([
    getCardInfos(cardIds),
    getCardReviews(cardIds),
  ]);
  const noteInfos = await getNoteInfos(cardInfos.map((c) => c.note));
  const noteLookup = keyBy(noteInfos, (n) => n.noteId);

  return cardInfos.map((cardInfo) => ({
    ...cardInfo,
    reviews: cardReviews[cardInfo.cardId],
    tags: noteLookup[cardInfo.note].tags.filter(
      (t) => !t.startsWith("leetcode::lvl")
    ),
  }));
};
