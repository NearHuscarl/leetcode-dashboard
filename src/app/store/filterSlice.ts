import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface TFilterState {
  filter: {
    date: "week" | "month" | "quarter" | "year" | "all";
  };
}

const initialState: TFilterState = {
  filter: {
    date: "quarter",
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<TFilterState["filter"]["date"]>) => {
      state.filter.date = action.payload;
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
