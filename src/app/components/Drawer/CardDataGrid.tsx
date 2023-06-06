import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TCardReview } from "app/api/stats";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "title",
    headerName: "Title",
    width: 330,
  },
];

export type TRowItem = {
  id: number;
  title: string;
};

type TCardDataGridProps = {
  rows: TRowItem[];
  reviews?: TCardReview[];
};

export const CardDataGrid = (props: TCardDataGridProps) => {
  const { rows } = props;

  return (
    <DataGrid
      //   sx={{
      //     border: "none",
      //     "& .MuiDataGrid-cell": {
      //       border: "none",
      //     },
      //   }}
      columnHeaderHeight={35}
      rowHeight={33}
      columns={columns}
      rows={rows}
      //   hideFooter
      rowSelection={false}
      disableColumnMenu
      columnVisibilityModel={{
        id: false,
      }}
    />
  );
};
