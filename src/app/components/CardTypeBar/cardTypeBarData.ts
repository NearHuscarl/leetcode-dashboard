import differenceInDays from "date-fns/differenceInDays";
import uniqBy from "lodash/uniqBy";
import {
  TCardType,
  getCardType,
  getCardTypeFromReview,
} from "app/helpers/card";
import { formatDate } from "app/helpers/date";
import { TCardModel } from "app/services/problems";
import { BarDatum } from "@nivo/bar";
import { TDateView } from "app/store/filterSlice";

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
function createMap(cards: TCardModel[], dateFormat: string) {
  const map: Record<TDate, Record<TCardType, TDiff>> = {};

  for (const card of cards) {
    if (!card.leetcode) continue;

    const createdTime = formatDate(card.cardId, dateFormat);
    const submap = map[createdTime] ?? (map[createdTime] = createSubmap()); // Initialize the submap if it doesn't exist
    submap.New.add = (submap.New.add ?? 0) + 1;

    for (let i = 0; i < card.reviews.length; i++) {
      const date = formatDate(card.reviews[i].id, dateFormat);
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

export interface TBarDatum extends BarDatum {
  date: number;
  New: number;
  Learning: number;
  Young: number;
  Mature: number;
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

  for (const { date, dateFormat } of dates) {
    const lastItem: TBarDatum = data.at(-1) ?? {
      date: 0,
      New: 0,
      Learning: 0,
      Young: 0,
      Mature: 0,
    };

    data.push({
      date,
      Mature:
        lastItem.Mature +
        (map[dateFormat]?.["Mature"]?.add ?? 0) -
        (map[dateFormat]?.["Mature"]?.sub ?? 0),
      New:
        lastItem.New +
        (map[dateFormat]?.["New"]?.add ?? 0) -
        (map[dateFormat]?.["New"]?.sub ?? 0),
      Learning:
        lastItem.Learning +
        (map[dateFormat]?.["Learning"]?.add ?? 0) -
        (map[dateFormat]?.["Learning"]?.sub ?? 0),
      Young:
        lastItem.Young +
        (map[dateFormat]?.["Young"]?.add ?? 0) -
        (map[dateFormat]?.["Young"]?.sub ?? 0),
    });
  }

  return {
    data: data.slice(data.length - 6, data.length),
  };
}
