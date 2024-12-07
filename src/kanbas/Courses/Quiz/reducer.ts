import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the quiz status
interface QuizStatus {
  submitted: boolean;
}

// Define the state type
interface QuizState {
  quizStatuses: Record<string, QuizStatus>;
}

const initialState: QuizState = {
  quizStatuses: {},
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    // Action to set a quiz as submitted
    setQuizSubmitted: (state, action: PayloadAction<{ quizId: string }>) => {
      const { quizId } = action.payload;
      state.quizStatuses[quizId] = { submitted: true };
    },

    // Action to reset a quiz submission status
    resetQuizStatus: (state, action: PayloadAction<{ quizId: string }>) => {
      const { quizId } = action.payload;
      if (state.quizStatuses[quizId]) {
        state.quizStatuses[quizId] = { submitted: false };
      }
    },
  },
});

export const { setQuizSubmitted, resetQuizStatus } = quizSlice.actions;
export default quizSlice.reducer;
