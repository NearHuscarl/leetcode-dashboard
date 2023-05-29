import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { IconButton, Chip, Link } from "@mui/material";
import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import lightGreen from "@mui/material/colors/lightGreen";
import green from "@mui/material/colors/green";
import lightBlue from "@mui/material/colors/lightBlue";
import amber from "@mui/material/colors/amber";
import grey from "@mui/material/colors/grey";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import GppBadIcon from "@mui/icons-material/GppBad";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { TCard } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { TLeetcode } from "app/api/leetcode";
import { useProblems } from "app/services/problems";
import { getCardType, getDueStatus, getNextReviewTime } from "app/helpers/card";
import { LEETCODE_BASE_URL } from "app/settings";
import { AcRateIndicator } from "./AcRateIndicator";
import { ReviewStatus } from "./ReviewStatus";

declare global {
  interface Array<T> {
    toReversed(): Array<T>;
  }
}

const cardTypeColors: Record<string, string> = {
  New: lightBlue[500],
  Learning: orange[500],
  Young: lightGreen[500],
  Mature: green[500],
  Relearning: red[500],
  Unknown: grey[500],
};
// use in sorting
const cardTypePriority: Record<string, number> = {
  New: 0,
  Learning: 1,
  Relearning: 2,
  Young: 3,
  Mature: 4,
  Unknown: 5,
};

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
          href={`${LEETCODE_BASE_URL}/${params.value}`}
          color="Highlight"
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
    valueGetter(params: GridValueGetterParams<TCard>) {
      return getCardType(params.row);
    },
    sortComparator: (v1, v2) => cardTypePriority[v1] - cardTypePriority[v2],
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
      return getNextReviewTime(params.row); // return this instead of due status to make sorting predictable
    },
    renderCell: (params) => {
      const dueStatus = getDueStatus(params.row);
      const nextReviewTime = params.value;
      const displayedDate = formatDistanceToNowStrict(nextReviewTime, {
        addSuffix: true,
      });

      if (!displayedDate) {
        return null;
      }

      return (
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {(dueStatus === "bad" || dueStatus === "stale") && (
            <GppBadIcon style={{ color: red[300] }} />
          )}
          {dueStatus === "now" && (
            <GppMaybeIcon style={{ color: amber[400] }} />
          )}
          {dueStatus === "good" && (
            <GppGoodIcon style={{ color: lightGreen[300] }} />
          )}
          {displayedDate}
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
      return <AcRateIndicator value={params.value} />;
    },
  },
  {
    field: "reviews",
    headerName: "Reviews",
    width: 70,
    sortComparator: (v1, v2) => v1.length - v2.length,
    renderCell: (params: GridRenderCellParams<any, TCardReview[]>) => {
      return <ReviewStatus reviews={params.value} />;
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
  const rows = useProblems();

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
