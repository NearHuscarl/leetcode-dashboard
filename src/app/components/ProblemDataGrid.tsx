import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Chip } from "@mui/material";
import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import yellow from "@mui/material/colors/yellow";
import lightGreen from "@mui/material/colors/lightGreen";
import lightBlue from "@mui/material/colors/lightBlue";
import grey from "@mui/material/colors/grey";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { getCards } from "app/api/deck";
import { TCardReview } from "app/api/stats";
import { getReviewResult } from "app/helpers/stats";
import { useEffect, useState } from "react";

declare global {
  interface Array<T> {
    toReversed(): Array<T>;
  }
}

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

const columns: GridColDef[] = [
  { field: "cardId", headerName: "ID", width: 0 },
  { field: "leetcodeId", headerName: "Leetcode", width: 350 },
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
      return params.value.map((tag, i) => (
        <Chip key={i} label={tag.split("::").at(-1)} />
      ));
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
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    getCards("Leetcode").then((cards) => setRows(cards));
  }, []);

  return (
    <DataGrid
      rowHeight={40}
      columnHeaderHeight={40}
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
        pagination: {
          paginationModel: {
            pageSize: 50,
          },
        },
      }}
    />
  );
};
