import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface TGlobalState {
  view: "table" | "chart";
}

const initialState: TGlobalState = {
  view: "chart",
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
