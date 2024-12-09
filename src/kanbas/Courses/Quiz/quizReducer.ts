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
            const newQuiz: any = {
                _id: Date.now().toString,
                title: quiz.title,
                description: quiz.description,
                publish: quiz.publish,
                attempts: quiz.attempts,
                availableDate: quiz.availableDate,
                availableUntilDate: quiz.availableUntilDate,
                points: quiz.point,
                dueDate: quiz.dueDate,
                numberOfQuestions: quiz.numberOfQuestions,
                timeLimit: quiz.timeLimit,
                courseId: quiz.courseId,
            }
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
