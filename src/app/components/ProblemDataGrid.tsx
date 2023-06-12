import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { IconButton, Chip, Link } from "@mui/material";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { TCard } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { TLeetcode } from "app/api/leetcode";
import { TCardModel, useProblems } from "app/services/problems";
import {
  TCardType,
  getCardType,
  getDueStatus,
  getNextReviewTime,
  getProblemLink,
} from "app/helpers/card";
import { AcRateIndicator } from "./AcRateIndicator";
import { ReviewTrend } from "./ReviewTrend/ReviewTrend";
import { theme } from "app/provider/ThemeProvider";
import { DueStatus } from "./DueStatus";

declare global {
  interface Array<T> {
    toReversed(): Array<T>;
  }
}

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
    renderCell: (params: GridRenderCellParams<TCardModel, string>) => {
      if (!params.value) {
        return null;
      }
      return (
        <Link href={getProblemLink(params.row)}>
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
    renderCell: (params: GridRenderCellParams<any, TCardType>) => {
      if (!params.value) {
        return null;
      }
      return (
        <Chip
          label={params.value}
          style={{
            backgroundColor: theme.anki.cardType[params.value],
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

      return (
        <DueStatus nextReviewTime={nextReviewTime} dueStatus={dueStatus} />
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
      return <ReviewTrend reviews={params.value} />;
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
