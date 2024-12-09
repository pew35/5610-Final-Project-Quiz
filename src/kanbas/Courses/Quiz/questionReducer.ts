import { createSlice } from "@reduxjs/toolkit";

// create reducer's initial state with default modules copied from database
const initialState = {
    questions: [],
}

const questionsSlice = createSlice({
    // name the slice
    name: "questions",
    // set initial state
    initialState,
    // declare reducer functions new assignment is in action.payload 
    // update quizzes in state adding new module at beginning of array. Override _id with timestamp
    reducers: {
        setQuestions: (state, action) => {
            console.log("set questions: ", action.payload)
            state.questions = action.payload
        },
        addQuestion: (state, {payload: question}) => {
            const newQuestion: any = {
                _id: Date.now().toString,
                quizId: question.quizId,
                answer: question.answer,
                option: question.option,
                question: question.question,
                type: question.type,
                points: question.points
                }
            state.questions = [...state.questions, newQuestion] as any;
            },

        deleteQuestion: (state, {payload: questionId}) => {
            state.questions = state.questions.filter(
                (a: any) => a._id !== questionId
            )
        },

        updateQuestion: (state, {payload: question}) => {
            state.questions = state.questions.map((a: any) => a._id === question._id ? question : a) as any;
        }
    }
})

export const {addQuestion, deleteQuestion, updateQuestion, setQuestions} = questionsSlice.actions;
export default questionsSlice.reducer;
