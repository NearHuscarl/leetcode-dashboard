import { globalReducer } from "../globalSlice";
import { filterReducer } from "../filterSlice";

export const rootReducer = {
  global: globalReducer,
  filter: filterReducer,
};
