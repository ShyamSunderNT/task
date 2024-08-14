import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './CreateSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
});

export default store;