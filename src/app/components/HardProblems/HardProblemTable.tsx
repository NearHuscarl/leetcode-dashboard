import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { TCardReview } from "app/api/stats";
import { getRetentionRate } from "app/helpers/card";
import { useProblems } from "app/services/problems";
import { ReviewTrend } from "../ReviewTrend/ReviewTrend";
import { globalActions } from "app/store/globalSlice";
import { useSelector } from "app/store/setup";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Problem",
    flex: 1,
    minWidth: 100,
    sortable: false,
    renderCell: (params: GridRenderCellParams<TRowItem, string>) => {
      return <span data-rowId={params.row.id}>{params.value}</span>;
    },
  },
  {
    field: "reviews",
    headerName: "Reviews",
    width: 90,
    sortable: false,
    sortComparator: (v1, v2) => v1.length - v2.length,
    renderCell: (params: GridRenderCellParams<any, TCardReview[]>) => {
      return <ReviewTrend reviews={params.value} />;
    },
  },
];

type TRowItem = {
  id: string;
  name: string;
  retentionRate: number;
  reviews: TCardReview[];
};

export const HardProblemTable = () => {
  const cards = useProblems();
  const dispatch = useDispatch();
  const cardsWithRetentionRate = cards.map((card) => ({
    card,
    retentionRate: getRetentionRate(card),
  }));
  const apiRef = useGridApiRef();
  const selectedProblem = useSelector((state) => state.global.hover.problem);
  const selectedChart = useSelector((state) => state.global.hover.chart);
  const rows: TRowItem[] = cardsWithRetentionRate
    .sort((a, b) => a.retentionRate - b.retentionRate)
    .slice(0, 5)
    .map(({ card, retentionRate }) => ({
      id: card.leetcodeId,
      name: card.leetcode?.title ?? card.leetcodeId,
      retentionRate: retentionRate,
      reviews: card.reviews,
    }));

  useEffect(() => {
    if (selectedChart === "table") {
      return;
    }

    // reset row selection
    if (rows.length > 0) {
      apiRef.current?.selectRow(rows[0].id, false, true);
    }

    for (const row of rows) {
      if (row.id === selectedProblem) {
        apiRef.current?.selectRow(row.id, true, true);
        return;
      }
    }
  }, [selectedChart, selectedProblem]);

  return (
    <DataGrid
      apiRef={apiRef}
      slotProps={{
        row: {
          onMouseEnter: (e) => {
            const rowEl = e.target as HTMLDivElement;
            const cellEl = rowEl.querySelector(`[data-rowid]`);
            const leetcodeId = cellEl?.getAttribute("data-rowid");

            if (!leetcodeId) {
              return;
            }
            dispatch(globalActions.hoverProblem([leetcodeId, "table"]));
          },
          onMouseLeave: (e) => {
            const rowEl = e.target as HTMLDivElement;
            const cellEl = rowEl.querySelector(`[data-rowid]`);
            const leetcodeId = cellEl?.getAttribute("data-rowid");

            if (!leetcodeId) {
              return;
            }
            dispatch(globalActions.hoverProblem());
          },
        },
      }}
      rows={rows}
      columns={columns}
      columnHeaderHeight={35}
      rowHeight={33}
      hideFooter
      autoHeight
      rowSelection
      onRowClick={(params) => {
        dispatch(globalActions.openProblemDetail(params.row.id));
      }}
      disableColumnMenu
      sx={{
        border: "none",
        "& .MuiDataGrid-cell": {
          border: "none",
          cursor: "pointer",
        },
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
        sorting: {
          sortModel: [
            {
              field: "retentionRate",
              sort: "asc",
            },
          ],
        },
      }}
    />
  );
};
