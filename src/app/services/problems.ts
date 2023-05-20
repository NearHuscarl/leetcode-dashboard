import { TCard, useCards } from "app/api/deck";
import { TLeetcode, useLeetcodeProblems } from "app/api/leetcode";

export type TCardModel = TCard & {
  leetcode?: TLeetcode;
};

export const useProblems = (): TCardModel[] => {
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const { data: cards = [] } = useCards();

  return cards.map((card) => {
    return {
      ...card,
      leetcode: leetcodes[card.leetcodeId],
    };
  });
};
