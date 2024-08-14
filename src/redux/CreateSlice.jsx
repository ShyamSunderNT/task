import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {
    setCategories: (state, action) => {
      return action.payload;
    },
    addCategory: (state, action) => {
      state.push(action.payload);
    },
    updateCategory: (state, action) => {
        const { id, newCatName } = action.payload;
        return state.map(cat =>
          cat.main_cat_id === id
            ? { ...cat, cat_name: newCatName }
            : cat
        );
    },
  },
});

export const { setCategories, addCategory, updateCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;