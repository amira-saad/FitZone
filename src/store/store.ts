import { configureStore } from '@reduxjs/toolkit'
import progressReducer from './Slices/progressSlice'

export const store = configureStore({
  reducer: {
    progress: progressReducer,
  },
})

// These types are needed for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch