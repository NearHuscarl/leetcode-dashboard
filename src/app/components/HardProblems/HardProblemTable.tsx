import { useDispatch } from "react-redux";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { TCardReview } from "app/api/stats";
import { getRetentionRate } from "app/helpers/card";
import { useProblems } from "app/services/problems";
import { ReviewTrend } from "../ReviewTrend/ReviewTrend";
import { globalActions } from "app/store/globalSlice";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Problem",
    flex: 1,
    minWidth: 100,
    sortable: false,
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

export const HardProblemTable = () => {
  const cards = useProblems();
  const dispatch = useDispatch();
  const cardsWithRetentionRate = cards.map((card) => ({
    card,
    retentionRate: getRetentionRate(card),
  }));
  const rows = cardsWithRetentionRate
    .sort((a, b) => a.retentionRate - b.retentionRate)
    .slice(0, 5)
    .map(({ card, retentionRate }) => ({
      id: card.leetcodeId,
      retentionRate: retentionRate,
      reviews: card.reviews,
      name: card.leetcode?.title ?? card.leetcodeId,
    }));

  return (
    <DataGrid
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
