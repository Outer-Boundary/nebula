import { combineReducers } from "@reduxjs/toolkit";
import { currentProductSlice } from "./slices/currentProductSlice";

const reducers = combineReducers({
  currentProduct: currentProductSlice.reducer,
});

export default reducers;
export type StateType = ReturnType<typeof reducers>;
