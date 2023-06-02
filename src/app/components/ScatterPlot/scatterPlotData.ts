import { TCardModel } from "app/services/problems";
import { TDueStatus, getDueDateDistance, getDueStatus } from "app/helpers/card";
import { TDateAgoFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";
import { ScatterPlotDatum, ScatterPlotRawSerie } from "@nivo/scatterplot";

export interface TWaffleDatum {
  id: TDueStatus;
  label: string;
  value: number;
}

export interface TScatterPlotDatum extends ScatterPlotDatum {
  id: string;
  dueStatus: TDueStatus;
}

export interface TScatterPlotRawSerie
  extends ScatterPlotRawSerie<TScatterPlotDatum> {}

export function prepareChartData(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const data: TScatterPlotDatum[] = [];
  const total: Record<string, TWaffleDatum> = {};
  const dateEnd = getDateAgo(dateAgo);

  for (const card of cards) {
    const dueStatus = getDueStatus(card, dateEnd);
    const dueDistance = getDueDateDistance(card, dateEnd);

    if (dueDistance === null) continue;

    if (!total[dueStatus]) {
      total[dueStatus] = {
        id: dueStatus,
        label: dueStatus,
        value: 0,
      };
    }
    total[dueStatus].value++;

    data.push({
      x: dueDistance,
      y: card.leetcode?.acRate ?? 0,
      id: card.leetcodeId,
      dueStatus,
    });
  }

  return {
    data: [{ id: "all", data }] as TScatterPlotRawSerie[],
    total: Object.values(total),
  };
}
