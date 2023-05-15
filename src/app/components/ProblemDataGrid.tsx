import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { transform } from "framer-motion";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { IconButton, Chip, LinearProgress, Link, alpha } from "@mui/material";
import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import yellow from "@mui/material/colors/yellow";
import lightGreen from "@mui/material/colors/lightGreen";
import green from "@mui/material/colors/green";
import lightBlue from "@mui/material/colors/lightBlue";
import amber from "@mui/material/colors/amber";
import grey from "@mui/material/colors/grey";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import GppBadIcon from "@mui/icons-material/GppBad";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppGoodIcon from "@mui/icons-material/GppGood";
import isNil from "lodash/isNil";
import { TCard, useCards } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { getIntervalTime, getReviewResult } from "app/helpers/stats";
import { TLeetcode, useLeetcodeProblems } from "app/api/leetcode";

declare global {
  interface Array<T> {
    toReversed(): Array<T>;
  }
}
const getAcRateColor = transform(
  [30, 60, 80],
  [red[500], yellow[600], green[500]]
);

const reviewResultColors: Record<"wrong" | "hard" | "ok" | "easy", string> = {
  easy: lightGreen[500],
  ok: yellow[500],
  hard: orange[500],
  wrong: red[500],
};

const cardTypeColors: Record<string, string> = {
  New: lightBlue[500],
  Learning: orange[500],
  Review: lightGreen[500],
  Relearning: red[500],
  Unknown: grey[500],
};
const dateNow = Date.now();

const columns: GridColDef[] = [
  {
    field: "cardId",
    headerName: "ID",
    width: 0,
  },
  {
    field: "leetcodeId",
    headerName: "Leetcode",
    width: 350,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      if (!params.value) {
        return null;
      }
      return (
        <Link
          href={`https://leetcode.com/problems/${params.value}`}
          underline="none"
        >
          {params.row.leetcode?.title ?? params.value}
        </Link>
      );
    },
  },
  {
    field: "type",
    headerName: "Type",
    width: 120,
    sortable: true,
    valueGetter(params) {
      switch (params.value) {
        case 0:
          return "New";
        case 1:
          return "Learning";
        case 2:
          return "Review";
        case 3:
          return "Relearning";
        default:
          return "Unknown";
      }
    },
    renderCell: (params: GridRenderCellParams<any, string>) => {
      if (!params.value) {
        return null;
      }
      return (
        <Chip
          label={params.value}
          style={{
            backgroundColor: cardTypeColors[params.value],
            color: "white",
          }}
        />
      );
    },
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 250,
    renderCell: (params: GridRenderCellParams<any, string[]>) => {
      if (!params.value) {
        return null;
      }
      return (
        <div style={{ display: "flex", gap: 4 }}>
          {params.value.map((tag, i) => (
            <Chip key={i} label={tag.split("::").at(-1)} />
          ))}
        </div>
      );
    },
  },
  {
    field: "due",
    headerName: "Due",
    width: 140,
    valueGetter: (params: GridValueGetterParams<TCard, number>) => {
      // there are 2 interval properties:
      // - card.interval: the next interval, if the card is overdue, then this is 0
      // - card.reviews.at(-1).ivl: the next interval
      const lastReview = params.row.reviews.at(-1);
      if (!lastReview) return null;

      const { id: reviewDate, ivl } = lastReview;
      const interval = getIntervalTime(ivl!);

      return reviewDate + interval;
    },
    valueFormatter(params) {
      if (params.value === null) return "Now";
      return formatDistanceToNowStrict(params.value, { addSuffix: true });
    },
    renderCell: (params) => {
      if (!params.formattedValue) {
        return null;
      }
      const value = params.formattedValue;
      let dueStatus = "bad";
      const isLate = value === "Now" || value.endsWith("ago");
      const distance = params.value - dateNow;

      // within 1 day
      if (Math.abs(distance) < 1000 * 60 * 60 * 24 || value === "Now") {
        dueStatus = "now";
      } else if (distance >= 1000 * 60 * 60 * 24) {
        dueStatus = "good";
      }

      return (
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {dueStatus === "bad" && <GppBadIcon style={{ color: red[300] }} />}
          {dueStatus === "now" && (
            <GppMaybeIcon style={{ color: amber[400] }} />
          )}
          {dueStatus === "good" && (
            <GppGoodIcon style={{ color: lightGreen[300] }} />
          )}
          {value}
        </div>
      );
    },
  },
  {
    field: "leetcode",
    headerName: "AC Rate",
    width: 100,
    valueGetter: (params: GridValueGetterParams<TCard, TLeetcode>) => {
      return params.value?.acRate;
    },
    renderCell: (params) => {
      if (isNil(params.value)) return null;
      return (
        <LinearProgress
          variant="determinate"
          sx={{
            width: "100%",
            height: 10,
            borderRadius: 3,
            backgroundColor: alpha(getAcRateColor(params.value), 0.2),
            "& > span": {
              backgroundColor: getAcRateColor(params.value),
            },
          }}
          value={params.value}
        />
      );
    },
  },
  {
    field: "reviews",
    headerName: "Reviews",
    width: 70,
    renderCell: (params: GridRenderCellParams<any, TCardReview[]>) => {
      if (!params.value) {
        return null;
      }
      const maxReviews = 6;
      const reviews = params.value
        .toReversed()
        .slice(0, maxReviews)
        .map((r) => reviewResultColors[getReviewResult(r)]);

      for (let i = reviews.length; i < maxReviews; i++) {
        reviews.push(grey[300]);
      }

      return (
        <div style={{ display: "flex", gap: 4 }}>
          {reviews.map((color, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      );
    },
  },
  {
    field: "neetcodeLink",
    headerName: "YT",
    disableColumnMenu: true,
    sortable: false,
    width: 40,
    renderCell: (params) => {
      if (!params.value) {
        return null;
      }
      return (
        <IconButton
          aria-label="neetcode video"
          onClick={() => window.open(params.value, "_blank")?.focus()}
        >
          <OndemandVideoIcon />
        </IconButton>
      );
    },
  },
];

export const ProblemDataGrid = () => {
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const { data: cards = [] } = useCards();

  const rows = cards.map((card) => {
    return {
      ...card,
      leetcode: leetcodes[card.leetcodeId],
    };
  });

  return (
    <DataGrid
      rowHeight={40}
      columnHeaderHeight={40}
      loading={rows.length === 0}
      rows={rows}
      disableVirtualization
      getRowId={(row) => row.cardId}
      columns={columns}
      initialState={{
        columns: {
          columnVisibilityModel: {
            cardId: false,
          },
        },
        sorting: {
          sortModel: [
            {
              field: "due",
              sort: "asc",
            },
          ],
        },
        pagination: {
          paginationModel: {
            pageSize: 50,
          },
        },
      }}
    />
  );
};
