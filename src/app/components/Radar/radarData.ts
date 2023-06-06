import memoize from "lodash/memoize";
import { TCardModel } from "app/services/problems";
import { TLeetcode } from "app/api/leetcode";
import { neetcodeProblems } from "app/neetcode.g";
import { TCardType, getCardTypeAt } from "app/helpers/card";
import { TDateAgoFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";

function createMap(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const dateEnd = getDateAgo(dateAgo);
  const map: Record<
    TDsa,
    { ids: string[]; submap: Record<TCardType, number> }
  > = dataStructures.reduce((acc: any, dsa) => {
    acc[dsa] = { ids: [], submap: {} };
    return acc;
  }, {});

  for (const card of cards) {
    if (!card.leetcode) {
      continue;
    }

    const cardType = getCardTypeAt(card, dateEnd);
    if (cardType === "New") continue;

    for (const tag of card.leetcode.topicTags) {
      const tagName = tag.name as TDsa;

      if (dataStructureSet.has(tagName)) {
        const { submap } = map[tagName];

        map[tagName].ids.push(card.leetcodeId);
        submap[cardType] = (submap[cardType] ?? 0) + 1;
      }
    }
  }

  return map;
}

export const dataStructures = [
  "Array",
  "String",
  "Hash Table",
  "Linked List",
  "Stack",
  "Matrix",
  "Tree",
  "Heap (Priority Queue)",
  "Graph",
] as const;
export const dataStructureSet = new Set(dataStructures);
type TDsa = (typeof dataStructures)[number];

const blacklistCategory = new Set([
  "Binary Search",
  "Graphs",
  // "Advanced Graphs",
  "Backtracking",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
]);

const computeProblemsByDsa = memoize((leetcodes: Record<string, TLeetcode>) => {
  const group: Record<TDsa, number> = dataStructures.reduce((acc, dsa) => {
    acc[dsa] = 0;
    return acc;
  }, {} as any);

  for (const category2 in neetcodeProblems) {
    const category = category2 as keyof typeof neetcodeProblems;
    if (blacklistCategory.has(category)) {
      continue;
    }

    for (const id of neetcodeProblems[category]) {
      const leetcode = leetcodes[id];

      if (!leetcode) {
        continue;
      }

      for (const tag of leetcode.topicTags) {
        const tagName = tag.name as TDsa;
        if (dataStructureSet.has(tagName)) {
          group[tagName]++;
        }
      }
    }
  }

  return group;
});

export type TRadarDatum = {
  dsa: string;
  leetcodeIds: string[];
  Learning: number;
  Young: number;
  Mature: number;
};

export function prepareChartData(
  cards: TCardModel[],
  leetcodes: Record<string, TLeetcode>,
  dateAgo: TDateAgoFilter
) {
  const data: TRadarDatum[] = [];
  const map = createMap(cards, dateAgo);
  const problemsByDsa = computeProblemsByDsa(leetcodes);

  for (const dsa2 in problemsByDsa) {
    const dsa = dsa2 as TDsa;
    const matureCount = map[dsa]?.submap["Mature"] ?? 0;
    const youngCount = (map[dsa]?.submap["Young"] ?? 0) + matureCount;
    const learningCount = (map[dsa]?.submap["Learning"] ?? 0) + youngCount;

    data.push({
      dsa,
      leetcodeIds: map[dsa].ids,
      Learning: (learningCount / problemsByDsa[dsa]) * 100,
      Young: (youngCount / problemsByDsa[dsa]) * 100,
      Mature: (matureCount / problemsByDsa[dsa]) * 100,
    });
  }

  return { data };
}
