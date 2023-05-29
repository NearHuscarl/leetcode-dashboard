import { BarDatum } from "@nivo/bar";
import memoize from "lodash/memoize";
import { TCardModel } from "app/services/problems";
import { TLeetcode } from "app/api/leetcode";
import { neetcodeProblems } from "app/neetcode.g";
import { TCardType, getCardTypeAt } from "app/helpers/card";
import { TDateAgoFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";

function createMap(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const dateEnd = getDateAgo(dateAgo);
  const map: Record<TPattern, Record<TCardType, number>> = patterns.reduce(
    (acc: any, pattern) => {
      acc[pattern] = {};
      return acc;
    },
    {}
  );

  for (const card of cards) {
    if (!card.leetcode) {
      continue;
    }

    const cardType = getCardTypeAt(card, dateEnd);
    if (cardType === "New") continue;

    for (const tag of card.leetcode.topicTags) {
      const tagName = tag.name as TPattern;

      if (patternSet.has(tagName)) {
        const submap = map[tagName];
        submap[cardType] = (submap[cardType] ?? 0) + 1;
      }
    }
  }

  return map;
}

export const patternShortNames = {
  "Depth-First Search": "DFS",
  "Breadth-First Search": "BFS",
  "Binary Search": "Bin Search",
  "Two Pointers": "2P",
  "Sliding Window": "SWin",
  "Prefix Sum": "pSum",
  Backtracking: "BTr",
  "Dynamic Programming": "DP",
  Greedy: "Greedy",
  Math: "Math",
  Geometry: "Geometry",
  "Bit Manipulation": "BitM",
  Sorting: "Sorting",
};

export const patterns = [
  "Depth-First Search",
  "Breadth-First Search",
  "Binary Search",
  "Two Pointers",
  "Sliding Window",
  "Prefix Sum",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  // "Intervals", // not categoried on leetcode but has one section on neetcode
  "Math",
  "Geometry",
  "Bit Manipulation",
  "Sorting",
] as const;
const patternSet = new Set(patterns);
export type TPattern = (typeof patterns)[number];

const computeProblemsByPattern = memoize(
  (leetcodes: Record<string, TLeetcode>) => {
    const group: Record<TPattern, number> = patterns.reduce((acc, pattern) => {
      acc[pattern] = 0;
      return acc;
    }, {} as any);

    for (const category2 in neetcodeProblems) {
      const category = category2 as keyof typeof neetcodeProblems;

      for (const id of neetcodeProblems[category]) {
        const leetcode = leetcodes[id];

        if (!leetcode) {
          continue;
        }

        for (const tag of leetcode.topicTags) {
          const tagName = tag.name as TPattern;
          if (patternSet.has(tagName)) {
            group[tagName]++;
          }
        }
      }
    }

    return group;
  }
);

export interface TBarDatum extends BarDatum {
  pattern: TPattern;
  Unsolved: number;
  Learning: number;
  Young: number;
  Mature: number;
}

export function prepareChartData(
  cards: TCardModel[],
  leetcodes: Record<string, TLeetcode>,
  dateAgo: TDateAgoFilter
) {
  const data: TBarDatum[] = [];
  const map = createMap(cards, dateAgo);
  const problemsByPattern = computeProblemsByPattern(leetcodes);

  for (const pattern2 in problemsByPattern) {
    const pattern = pattern2 as TPattern;
    const matureCount = map[pattern]?.["Mature"] ?? 0;
    const youngCount = map[pattern]?.["Young"] ?? 0;
    const learningCount = map[pattern]?.["Learning"] ?? 0;

    data.push({
      pattern,
      Unsolved:
        problemsByPattern[pattern] - matureCount - youngCount - learningCount,
      Learning: learningCount,
      Young: youngCount,
      Mature: matureCount,
    });
  }

  return { data };
}
