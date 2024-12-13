import { createSlice } from "@reduxjs/toolkit";

// create reducer's initial state with default modules copied from database
const initialState = {
    quizzes: [],
}

const quizzesSlice = createSlice({
    // name the slice
    name: "quizzes",
    // set initial state
    initialState,
    // declare reducer functions new assignment is in action.payload 
    // update quizzes in state adding new module at beginning of array. Override _id with timestamp
    reducers: {
        setQuizzes: (state, action) => {
            console.log("set quizzes: ", action.payload)
            state.quizzes = action.payload
        },
        addQuiz: (state, { payload: quiz }) => {
            const newQuiz = {
                ...quiz,
                _id: quiz._id || Date.now().toString(),
                title: quiz.title || "New Quiz",
                description: quiz.description || "New Quiz Description",
                publish: quiz.publish || false,
                attempts: quiz.attempts || 1,
                multipleAttempts: quiz.multipleAttempts || false,
                availableDate: quiz.availableDate || new Date().toISOString().split('T')[0],
                availableUntilDate: quiz.availableUntilDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                dueDate: quiz.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                points: quiz.points || 100,
                numberOfQuestions: quiz.numberOfQuestions || 0,
                timeLimit: quiz.timeLimit || 20,
                quizType: quiz.quizType || "Graded Quiz",
                assignmentGroup: quiz.assignmentGroup || "Quizzes",
                shuffleAnswers: quiz.shuffleAnswers || true,
            };
            state.quizzes = [...state.quizzes, newQuiz] as any;
        },

        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (a: any) => a._id !== quizId
            );
        },

        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((a: any) =>
                a._id === quiz._id ? quiz : a
            ) as any;
        }
    }
})

export const { addQuiz, deleteQuiz, updateQuiz, setQuizzes } = quizzesSlice.actions;
export default quizzesSlice.reducer;
