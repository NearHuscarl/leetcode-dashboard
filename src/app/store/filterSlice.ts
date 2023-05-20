import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export type TDateFilter = "week" | "month" | "quarter" | "year" | "all";
export type TSwarmPlotDateFilter =
  | "now"
  | "week"
  | "2week"
  | "month"
  | "3month";

export interface TFilterState {
  lineChart: {
    date: TDateFilter;
  };
  calendar: {
    year: number;
  };
  swarmPlot: {
    dateAgo: TSwarmPlotDateFilter;
  };
}

const initialState: TFilterState = {
  lineChart: {
    date: "quarter",
  },
  calendar: {
    year: new Date().getFullYear(),
  },
  swarmPlot: {
    dateAgo: "now",
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setLineChartDate: (state, action: PayloadAction<TDateFilter>) => {
      state.lineChart.date = action.payload;
    },
    setCalendarYear: (state, action: PayloadAction<number>) => {
      state.calendar.year = action.payload;
    },
    setSwarmPlotDate: (state, action: PayloadAction<TSwarmPlotDateFilter>) => {
      state.swarmPlot.dateAgo = action.payload;
    },
  },
});

export const filterActions = filterSlice.actions;
export const filterReducer = persistReducer(
  {
    key: "filter",
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
  filterSlice.reducer
);
