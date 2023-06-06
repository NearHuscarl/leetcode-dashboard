import { useDispatch } from "react-redux";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import { TCardReview } from "app/api/stats";
import { TCardTableColumn, globalActions } from "app/store/globalSlice";
import { ReviewTrend } from "../ReviewTrend";
import { TCardModel } from "app/services/problems";
import {
  TCardType,
  getCardType,
  getDueStatus,
  getNextReviewTime,
} from "app/helpers/card";
import { theme } from "app/provider/ThemeProvider";
import { TDifficulty } from "app/api/leetcode";
import { DueStatus } from "../DueStatus";
import { dataStructureSet } from "../Radar/radarData";
import { patternSet } from "../PatternBar/patternBarData";
import { formatDate } from "app/helpers/date";

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
    field: "id",
    headerName: "ID",
  },
  {
    field: "leetcodeId",
    headerName: "Title",
    flex: 1,
    valueGetter(params) {
      return params.row.leetcode?.title ?? params.value;
    },
  },
  {
    field: "reviews",
    headerName: "Reviews",
    width: 100,
    sortComparator: (v1, v2) => v1.length - v2.length,
    renderCell: (params: GridRenderCellParams<any, TCardReview[]>) => {
      return <ReviewTrend reviews={params.value} />;
    },
  },
  {
    field: "type",
    headerName: "Type",
    width: 120,
    sortable: true,
    valueGetter(params: GridValueGetterParams<TCardModel>) {
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
    field: "difficulty",
    headerName: "Difficulty",
    width: 140,
    sortable: true,
    valueGetter(params: GridValueGetterParams<TCardModel>) {
      return params.row.leetcode?.difficulty;
    },
    sortComparator: (v1, v2) => cardTypePriority[v1] - cardTypePriority[v2],
    renderCell: (params: GridRenderCellParams<any, TDifficulty>) => {
      if (!params.value) {
        return null;
      }
      return (
        <span style={{ color: theme.leetcode.difficulty[params.value] }}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "due",
    headerName: "Due",
    width: 140,
    valueGetter: (params: GridValueGetterParams<TCardModel, number>) => {
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
    field: "lastReviewDate",
    headerName: "Last Review Time",
    width: 200,
    valueGetter: (params: GridValueGetterParams<TCardModel, any>) => {
      const lastReview = params.row.reviews.at(-1);

      if (!lastReview) return "None";

      return formatDate(lastReview.id, "yyyy-MM-dd HH:mm:ss a");
    },
  },
  {
    field: "dsa",
    headerName: "Data Structure",
    width: 250,
    renderCell: (params: GridRenderCellParams<TCardModel, string[]>) => {
      if (!params.row.leetcode) {
        return null;
      }
      return (
        <div style={{ display: "flex", gap: 4 }}>
          {params.row.leetcode.topicTags
            .filter((t) => dataStructureSet.has(t.name as any))
            .map(({ name }) => (
              <Chip key={name} label={name} />
            ))}
        </div>
      );
    },
  },
  {
    field: "pattern",
    headerName: "Pattern",
    width: 250,
    renderCell: (params: GridRenderCellParams<TCardModel, string[]>) => {
      if (!params.row.leetcode) {
        return null;
      }
      return (
        <div style={{ display: "flex", gap: 4 }}>
          {params.row.leetcode.topicTags
            .filter((t) => patternSet.has(t.name as any))
            .map(({ name }) => (
              <Chip key={name} label={name} />
            ))}
        </div>
      );
    },
  },
];

export type TRowItem = {
  id: number;
  title: string;
};

type TCardDataGridProps = {
  rows: TCardModel[];
  column: TCardTableColumn;
};

export const CardDataGrid = (props: TCardDataGridProps) => {
  const { rows, column } = props;
  const dispatch = useDispatch();
  const sortModel: GridSortModel = [];

  if (column === "cardType") {
    sortModel.push({ field: "type", sort: "asc" });
  }

  if (column === "lastReviewDate") {
    sortModel.push({ field: "lastReviewDate", sort: "desc" });
  }

  return (
    <DataGrid<TCardModel>
      sx={{
        border: "none",
        "& .MuiDataGrid-cell": {
          border: "none",
          cursor: "pointer",
        },
      }}
      getRowId={(row) => row.cardId}
      columnHeaderHeight={35}
      rowHeight={33}
      columns={columns}
      rows={rows}
      disableVirtualization
      onRowClick={(params) => {
        dispatch(
          globalActions.openProblemDetail((params.row as TCardModel).leetcodeId)
        );
      }}
      //   hideFooter
      rowSelection={false}
      disableColumnMenu
      columnVisibilityModel={{
        id: false,
        reviews: column === "reviews",
        type: column === "cardType",
        difficulty: column === "difficulty",
        due: column === "due",
        dsa: column === "dsa",
        pattern: column === "pattern",
        lastReviewDate: column === "lastReviewDate",
      }}
      initialState={{
        sorting: { sortModel },
      }}
    />
  );
};
