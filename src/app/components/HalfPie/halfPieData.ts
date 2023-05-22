import { TCardModel } from "app/services/problems";
import { TDueStatus, getDueStatus } from "app/helpers/card";
import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import { MayHaveLabel } from "@nivo/pie";

function createMap(cards: TCardModel[]) {
  const map: Record<TDueStatus, number> = { stale: 0, bad: 0, good: 0, now: 0 };

  for (const card of cards) {
    const dueStatus = getDueStatus(card);
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
};

export function prepareChartData(cards: TCardModel[]) {
  const data: TPieDatum[] = [];
  const map = createMap(cards);
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
