import { configureStore } from '@reduxjs/toolkit';
import { slippageReducer } from './reducers/reducer';

const store = configureStore({
  reducer: {
    slippageReducer: slippageReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;