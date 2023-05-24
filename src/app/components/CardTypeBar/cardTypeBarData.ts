import differenceInMonths from "date-fns/differenceInMonths";
import {
  TCardType,
  getCardType,
  getCardTypeFromReview,
} from "app/helpers/card";
import { formatDate } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { BarDatum } from "@nivo/bar";

const DATE_FORMAT = "yyyy-MM";

type TDate = string;
type TDiff = {
  add: number;
  sub: number;
};

export const cardTypes: TCardType[] = ["New", "Learning", "Young", "Mature"];

const createSubmap = (): Record<TCardType, TDiff> =>
  cardTypes.reduce((acc, type) => {
    acc[type] = { add: 0, sub: 0 };
    return acc;
  }, {} as any);

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[]) {
  const map: Record<TDate, Record<TCardType, TDiff>> = {};

  for (const card of cards) {
    if (!card.leetcode) continue;

    const createdTime = formatDate(card.cardId, DATE_FORMAT);
    const submap = map[createdTime] ?? (map[createdTime] = createSubmap()); // Initialize the submap if it doesn't exist
    submap.New.add = (submap.New.add ?? 0) + 1;

    for (let i = 0; i < card.reviews.length; i++) {
      const date = formatDate(card.reviews[i].id, DATE_FORMAT);
      const submap = map[date] ?? (map[date] = createSubmap()); // Initialize the submap if it doesn't exist
      const cardTypeAfterReview = card.reviews[i + 1]
        ? getCardTypeFromReview(card.reviews[i + 1])
        : getCardType(card);
      const cardTypeBeforeReview = getCardTypeFromReview(card.reviews[i]);

      submap[cardTypeAfterReview].add =
        (submap[cardTypeAfterReview].add ?? 0) + 1;

      if (i > 0) {
        submap[cardTypeBeforeReview].sub =
          (submap[cardTypeBeforeReview].sub ?? 0) + 1;
      } else {
        submap["New"].sub = (submap["New"].sub ?? 0) + 1;
      }
    }
  }

  // Return the map
  return map;
}

function getDatesBetween(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const diff = differenceInMonths(end, start);
  for (let i = 0; i <= diff; i++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + i);
    dates.push(formatDate(date, DATE_FORMAT));
  }
  return dates;
}

export interface TBarDatum extends BarDatum {
  date: string;
  New: number;
  Learning: number;
  Young: number;
  Mature: number;
}

export function prepareChartData(cards: TCardModel[]) {
  let minCreationDate = new Date();
  for (const card of cards) {
    const creationDate = new Date(card.cardId);
    if (creationDate < minCreationDate) minCreationDate = creationDate;
  }

  let minDate = minCreationDate;
  let maxDate = new Date();

  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const data: TBarDatum[] = [];

  for (const date of dates) {
    const lastItem: TBarDatum = data.at(-1) ?? {
      date: "",
      New: 0,
      Learning: 0,
      Young: 0,
      Mature: 0,
    };

    data.push({
      date,
      Mature:
        lastItem.Mature +
        (map[date]?.["Mature"]?.add ?? 0) -
        (map[date]?.["Mature"]?.sub ?? 0),
      New:
        lastItem.New +
        (map[date]?.["New"]?.add ?? 0) -
        (map[date]?.["New"]?.sub ?? 0),
      Learning:
        lastItem.Learning +
        (map[date]?.["Learning"]?.add ?? 0) -
        (map[date]?.["Learning"]?.sub ?? 0),
      Young:
        lastItem.Young +
        (map[date]?.["Young"]?.add ?? 0) -
        (map[date]?.["Young"]?.sub ?? 0),
    });
  }

  return {
    data,
  };
}
