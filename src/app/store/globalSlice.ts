import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export type TChartType = "scatterPlot" | "swarmPlot" | "table";

export type TCardTableColumn =
  | "reviews"
  | "dsa"
  | "pattern"
  | "lastReviewDate"
  | "cardType"
  | "due"
  | "difficulty";

export interface TGlobalState {
  view: "table" | "chart";
  hover: {
    problem: string;
    chart: TChartType | "";
  };
  drawer: {
    open: boolean;
    problemIds: string[];
    problemDetailId: string;
    column: TCardTableColumn;
  };
}

const initialState: TGlobalState = {
  view: "chart",
  hover: {
    problem: "",
    chart: "",
  },
  drawer: {
    open: false,
    problemIds: [],
    problemDetailId: "",
    column: "difficulty",
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setChartView: (state) => {
      state.view = "chart";
    },
    setTableView: (state) => {
      state.view = "table";
    },
    hoverProblem: (
      state,
      action: PayloadAction<[string, TChartType] | undefined>
    ) => {
      state.hover.problem = action.payload?.[0] ?? "";
      state.hover.chart = action.payload?.[1] ?? "";
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawer.open = action.payload;
    },
    setProblems: (state, action: PayloadAction<string[]>) => {
      state.drawer.problemIds = action.payload;
      state.drawer.problemDetailId = "";
    },
    closeDetail: (state) => {
      state.drawer.problemDetailId = "";
    },
    openProblems: (
      state,
      action: PayloadAction<{ ids: string[]; column: TCardTableColumn }>
    ) => {
      const { ids, column } = action.payload;
      state.drawer.open = true;
      state.drawer.problemIds = ids;
      state.drawer.column = column;
      state.drawer.problemDetailId = "";
    },
    openProblemDetail: (state, action: PayloadAction<string>) => {
      state.drawer.open = true;
      state.drawer.problemDetailId = action.payload;
    },
  },
});

export const globalActions = globalSlice.actions;
export const globalReducer = persistReducer(
  {
    key: "global",
    storage,
    version: 2,
    migrate(state, currentVersion) {
      const lastVersion = state?._persist.version ?? 0;
      if (lastVersion < currentVersion) {
        return Promise.resolve(initialState as any);
      }
      return Promise.resolve(state);
    },
  },
  globalSlice.reducer
);
