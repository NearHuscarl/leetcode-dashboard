import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import grey from "@mui/material/colors/grey";
import { TCardModel } from "app/services/problems";
import { getDueDateDistance, getDueStatus } from "app/helpers/card";
import { TDateAgoFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";
import { ScatterPlotDatum, ScatterPlotRawSerie } from "@nivo/scatterplot";
import { TMuiColor } from "app/provider/ThemeProvider";

export interface TWaffleDatum {
  id: string;
  label: string;
  value: number;
  color: TMuiColor;
}

export interface TScatterPlotDatum extends ScatterPlotDatum {
  leetcodeId: string;
  color: TMuiColor;
}

export interface TScatterPlotRawSerie
  extends ScatterPlotRawSerie<TScatterPlotDatum> {}

const colorLookup: Record<string, TMuiColor> = {
  stale: red,
  bad: orange,
  now: amber,
  good: lightGreen,
  none: grey,
};

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
        color: colorLookup[dueStatus],
      };
    }
    total[dueStatus].value++;

    data.push({
      x: dueDistance,
      y: card.leetcode?.acRate ?? 0,
      leetcodeId: card.leetcodeId,
      color: colorLookup[dueStatus],
    });
  }

  return {
    data: [{ id: "all", data }] as TScatterPlotRawSerie[],
    total: Object.values(total),
  };
}
