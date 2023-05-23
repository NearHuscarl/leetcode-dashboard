import { TCardModel } from "app/services/problems";
import { TDueStatus, getDueStatus } from "app/helpers/card";
import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import { MayHaveLabel } from "@nivo/pie";
import { TSwarmPlotDateFilter } from "app/store/filterSlice";
import { getDateAgo } from "app/helpers/date";

function createMap(cards: TCardModel[], dateAgo: TSwarmPlotDateFilter) {
  const map: Record<TDueStatus, number> = {
    stale: 0,
    bad: 0,
    good: 0,
    now: 0,
    none: 0,
  };
  const dateEnd = getDateAgo(dateAgo);

  for (const card of cards) {
    const dueStatus = getDueStatus(card, dateEnd);
    map[dueStatus] = (map[dueStatus] ?? 0) + 1;
  }

  return map;
}

export interface TPieDatum extends MayHaveLabel {
  id: string;
  value: number;
  color: string;
}

const colorLookup: Record<TDueStatus, string> = {
  stale: red[500],
  bad: orange[500],
  now: amber[500],
  good: lightGreen[500],
  none: "",
};

export function prepareChartData(
  cards: TCardModel[],
  dateAgo: TSwarmPlotDateFilter
) {
  const data: TPieDatum[] = [];
  const map = createMap(cards, dateAgo);
  const dueStatuses: TDueStatus[] = ["good", "now", "bad", "stale"];

  for (const dueStatus of dueStatuses) {
    data.push({
      id: dueStatus,
      value: map[dueStatus as TDueStatus],
      color: colorLookup[dueStatus as TDueStatus],
    });
  }

  return { data };
}
