import startCase from "lodash/startCase";
import Stack from "@mui/material/Stack";
import grey from "@mui/material/colors/grey";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { TCardType, TEaseLabel } from "app/helpers/card";
import { theme } from "app/provider/ThemeProvider";
import { ReviewDot } from "../ReviewTrend/ReviewDot";
import formatDistance from "date-fns/formatDistance";
import { formatDate } from "app/helpers/date";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "cardType",
    headerName: "Card Type",
    width: 90,
    renderCell: (params: GridRenderCellParams<any, TCardType>) => {
      if (!params.value) {
        return null;
      }
      return (
        <div
          style={{
            color: theme.anki.cardType[params.value],
          }}
        >
          {params.value}
        </div>
      );
    },
  },
  {
    field: "ease",
    headerName: "Review Result",
    width: 110,
    renderCell: (params: GridRenderCellParams<any, TEaseLabel>) => {
      if (!params.value || params.value === "unknown") {
        return null;
      }
      return (
        <Stack direction="row" gap={0.75} alignItems="center">
          <ReviewDot result={params.value} />
          <div style={{ color: grey[600] }}>{startCase(params.value)}</div>
        </Stack>
      );
    },
  },
  {
    field: "interval",
    headerName: "Interval",
    width: 100,
    valueFormatter(params) {
      if (!params.value) {
        return "Now";
      }
      return formatDistance(0, params.value);
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params: GridRenderCellParams<TRowItem>) => {
      return <>{formatDate(params.row.id)}</>;
    },
  },
];

export type TRowItem = {
  id: number;
  cardType: TCardType;
  ease: TEaseLabel;
  interval: number;
};

type TCardEventDataGridProps = {
  rows: TRowItem[];
};

export const CardEventDataGrid = (props: TCardEventDataGridProps) => {
  const { rows } = props;

  return (
    <DataGrid
      sx={{
        border: "none",
        "& .MuiDataGrid-cell": {
          border: "none",
        },
      }}
      columnHeaderHeight={35}
      rowHeight={33}
      columns={columns}
      rows={rows}
      hideFooter
      rowSelection={false}
      disableColumnMenu
      columnVisibilityModel={{
        id: false,
      }}
    />
  );
};
