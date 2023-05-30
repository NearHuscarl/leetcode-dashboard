import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import { TCardModel } from "app/services/problems";
import { getDueDateDistance, getDueStatus } from "app/helpers/card";
import { TDateAgoFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";
import { ScatterPlotDatum, ScatterPlotRawSerie } from "@nivo/scatterplot";

export interface TScatterPlotDatum extends ScatterPlotDatum {
  leetcodeId: string;
  color: string;
}

export interface TScatterPlotRawSerie
  extends ScatterPlotRawSerie<TScatterPlotDatum> {}

const colorLookup: Record<string, string> = {
  stale: red[500],
  bad: orange[500],
  now: amber[500],
  good: lightGreen[500],
  none: "",
};

export function prepareChartData(cards: TCardModel[], dateAgo: TDateAgoFilter) {
  const data: TScatterPlotDatum[] = [];
  const dateEnd = getDateAgo(dateAgo);

  for (const card of cards) {
    const dueStatus = getDueStatus(card, dateEnd);
    const dueDistance = getDueDateDistance(card, dateEnd);

    data.push({
      x: dueDistance ?? Number.MIN_SAFE_INTEGER,
      y: card.leetcode?.acRate ?? 0,
      leetcodeId: card.leetcodeId,
      color: colorLookup[dueStatus],
    });
  }

  return {
    data: [{ id: "all", data }] as TScatterPlotRawSerie[],
  };
}
