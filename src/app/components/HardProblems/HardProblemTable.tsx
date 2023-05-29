import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { TCardReview } from "app/api/stats";
import { getRetentionRate } from "app/helpers/card";
import { useProblems } from "app/services/problems";
import { ReviewStatus } from "../ReviewStatus";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Problem",
    flex: 1,
    minWidth: 100,
    sortable: false,
  },
  // {
  //   field: "retentionRate",
  //   headerName: "Retention",
  //   type: "number",
  // disableColumnMenu: true,
  //   width: 70,
  //   sortable: false,
  // },
  {
    field: "reviews",
    headerName: "Reviews",
    width: 90,
    sortable: false,
    sortComparator: (v1, v2) => v1.length - v2.length,
    renderCell: (params: GridRenderCellParams<any, TCardReview[]>) => {
      return <ReviewStatus reviews={params.value} />;
    },
  },
];

export const HardProblemTable = () => {
  const cards = useProblems();
  const cardsWithRetentionRate = cards.map((card) => ({
    card,
    retentionRate: getRetentionRate(card),
  }));
  const rows = cardsWithRetentionRate
    .sort((a, b) => a.retentionRate - b.retentionRate)
    .slice(0, 5)
    .map(({ card, retentionRate }) => ({
      id: card.cardId,
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
      rowSelection={false}
      disableColumnMenu
      sx={{
        border: "none",
        "& .MuiDataGrid-cell": {
          border: "none",
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
