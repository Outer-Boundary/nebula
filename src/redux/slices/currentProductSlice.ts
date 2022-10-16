import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IProduct from "../../components/types/IProduct";

export const currentProductSlice = createSlice({
  name: "currentProductSlice",
  initialState: null as IProduct | null,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<IProduct | null>) => {
      return action.payload;
    },
  },
});

export const { setCurrentProduct } = currentProductSlice.actions;
