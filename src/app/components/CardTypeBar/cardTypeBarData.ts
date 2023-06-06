import differenceInDays from "date-fns/differenceInDays";
import uniqBy from "lodash/uniqBy";
import {
  TCardType,
  getCardType,
  getCardTypeFromReview,
} from "app/helpers/card";
import { formatDate } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { TDateView } from "app/store/filterSlice";
import { setDifference } from "app/helpers/lang";

type TDate = string;
type TDiff = {
  add: number;
  sub: number;
  addIds: Set<string>;
  subIds: Set<string>;
};

export const cardTypes: TCardType[] = ["New", "Learning", "Young", "Mature"];

const createSubmap = (): Record<TCardType, TDiff> =>
  cardTypes.reduce((acc, type) => {
    acc[type] = { add: 0, sub: 0, addIds: new Set(), subIds: new Set() };
    return acc;
  }, {} as any);

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[], dateFormat: string) {
  const map: Record<TDate, Record<TCardType, TDiff>> = {};

  for (const card of cards) {
    if (!card.leetcode) continue;

    const createdTime = formatDate(card.cardId, dateFormat);
    const submap = map[createdTime] ?? (map[createdTime] = createSubmap()); // Initialize the submap if it doesn't exist

    submap.New.add += 1;
    submap.New.addIds.add(card.leetcodeId);

    for (let i = 0; i < card.reviews.length; i++) {
      const date = formatDate(card.reviews[i].id, dateFormat);
      const submap = map[date] ?? (map[date] = createSubmap()); // Initialize the submap if it doesn't exist
      const cardTypeBeforeReview =
        i === 0 ? "New" : getCardTypeFromReview(card.reviews[i]);
      const cardTypeAfterReview = card.reviews[i + 1]
        ? getCardTypeFromReview(card.reviews[i + 1])
        : getCardType(card);

      if (cardTypeBeforeReview !== cardTypeAfterReview) {
        submap[cardTypeBeforeReview].sub += 1;
        submap[cardTypeBeforeReview].subIds.add(card.leetcodeId);
        submap[cardTypeAfterReview].add += 1;
        submap[cardTypeAfterReview].addIds.add(card.leetcodeId);
      }
    }
  }

  return map;
}

function getDatesBetween(start: Date, end: Date, dateFormat: string) {
  const dates: { dateFormat: string; date: number }[] = [];
  const diff = differenceInDays(end, start);

  for (let i = 0; i <= diff; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push({
      dateFormat: formatDate(date, dateFormat),
      date: date.valueOf(),
    });
  }

  return uniqBy(dates, (d) => d.dateFormat);
}

export interface TBarDatum {
  date: number;
  New: number;
  Learning: number;
  Young: number;
  Mature: number;
  leetcodeIds: Set<string>;
}

const getDateFormat = (dateView: TDateView) => {
  switch (dateView) {
    case "day":
      return "yyyy-MM-dd";
    case "week":
      return "yyyy-w";
    case "month":
      return "yyyy-MM";
    case "quarter":
      return "yyyy-Q";
  }
};

export function prepareChartData(cards: TCardModel[], dateView: TDateView) {
  let minCreationDate = new Date();
  for (const card of cards) {
    const creationDate = new Date(card.cardId);
    if (creationDate < minCreationDate) minCreationDate = creationDate;
  }

  let minDate = minCreationDate;
  let maxDate = new Date();

  const dateFormat = getDateFormat(dateView);
  const dates = getDatesBetween(minDate, maxDate, dateFormat);
  const map = createMap(cards, dateFormat);
  const data: TBarDatum[] = [];
  const cardTypes = ["New", "Learning", "Young", "Mature"] as const;

  for (const { date, dateFormat } of dates) {
    const lastItem: TBarDatum = data.at(-1) ?? {
      date: 0,
      New: 0,
      Learning: 0,
      Young: 0,
      Mature: 0,
      leetcodeIds: new Set<string>(),
    };

    let leetcodeIds = new Set<string>(lastItem.leetcodeIds);
    for (const cardType of cardTypes) {
      const diff = map[dateFormat]?.[cardType];
      if (diff) {
        const ids = setDifference(diff.addIds, diff.subIds);
        for (const id of ids) {
          leetcodeIds.add(id);
        }
      }
    }
    const total = cardTypes.map(
      (t) =>
        lastItem[t] +
        (map[dateFormat]?.[t]?.add ?? 0) -
        (map[dateFormat]?.[t]?.sub ?? 0)
    );

    data.push({
      date,
      leetcodeIds,
      New: total[0],
      Learning: total[1],
      Young: total[2],
      Mature: total[3],
    });
  }

  return {
    data: data.slice(data.length - 6, data.length),
  };
}
