import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export type TChartType = "scatterPlot" | "swarmPlot";

export interface TGlobalState {
  view: "table" | "chart";
  selectedProblem: string;
  selectedChart: TChartType | "";
}

const initialState: TGlobalState = {
  view: "chart",
  selectedProblem: "",
  selectedChart: "",
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
    setSelectedProblem: (
      state,
      action: PayloadAction<[string, TChartType] | undefined>
    ) => {
      state.selectedProblem = action.payload?.[0] ?? "";
      state.selectedChart = action.payload?.[1] ?? "";
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
