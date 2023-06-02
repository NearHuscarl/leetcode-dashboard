import { useMemo } from "react";
import { TCard, useCards } from "app/api/deck";
import { TLeetcode, useLeetcodeProblems } from "app/api/leetcode";

export type TCardModel = TCard & {
  leetcode?: TLeetcode;
};

export const useProblems = (): TCardModel[] => {
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const { data: cards = [] } = useCards();

  return useMemo(() => {
    return cards.map((card) => ({
      ...card,
      leetcode: leetcodes[card.leetcodeId],
    }));
  }, [cards, leetcodes]);
};

export const useProblem = (leetcodeId: string) => {
  const cards = useProblems();

  return useMemo(() => {
    return cards.find((card) => card.leetcodeId === leetcodeId)!;
  }, [cards, leetcodeId]);
};
