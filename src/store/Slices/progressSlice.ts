import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { emptyUserProgress, type UserProgress } from "../../utils/userStorage";

type ProgressState = {
  currentUserId: string | null;
  byUser: Record<string, UserProgress>;
};

type CompleteWorkoutPayload = {
  id: string;
  calories: number;
  userId?: string;
};
type RemoveWorkoutPayload = {
  index: number;
  userId?: string;
};

const initialState: ProgressState = {
  currentUserId: null,
  byUser: {},
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload;
    },
    hydrateUserProgress: (
      state,
      action: PayloadAction<{ userId: string; progress: UserProgress }>
    ) => {
      state.byUser[action.payload.userId] = action.payload.progress;
    },
    completeWorkout: (state, action: PayloadAction<CompleteWorkoutPayload>) => {
      const userId = action.payload.userId || state.currentUserId;
      if (!userId) return;

      const userProgress = state.byUser[userId] || emptyUserProgress();
      userProgress.workoutsCompleted += 1;
      userProgress.caloriesBurned += action.payload.calories;
      userProgress.history.push({
        workoutId: action.payload.id,
        calories: action.payload.calories,
        userId,
        date: new Date().toISOString(),
      });
      state.byUser[userId] = userProgress;
    },
    resetProgress: (state, action: PayloadAction<{ userId?: string } | undefined>) => {
      const userId = action.payload?.userId || state.currentUserId;
      if (!userId) return;
      state.byUser[userId] = emptyUserProgress();
    },
    removeWorkoutFromHistory: (state, action: PayloadAction<RemoveWorkoutPayload>) => {
      const userId = action.payload.userId || state.currentUserId;
      if (!userId) return;

      const userProgress = state.byUser[userId];
      if (!userProgress) return;

      const removed = userProgress.history[action.payload.index];
      if (!removed) return;

      userProgress.history.splice(action.payload.index, 1);
      userProgress.workoutsCompleted = userProgress.history.length;
      userProgress.caloriesBurned = Math.max(0, userProgress.caloriesBurned - removed.calories);
    },
  },
});

export const {
  setCurrentUser,
  hydrateUserProgress,
  completeWorkout,
  resetProgress,
  removeWorkoutFromHistory,
} = progressSlice.actions;
export default progressSlice.reducer;