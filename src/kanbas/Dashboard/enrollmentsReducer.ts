import { createSlice } from "@reduxjs/toolkit";
import {enrollments} from "../Database"; // Assuming you have the database with enrollments

const initialState = {
    enrollments: enrollments, // Use the provided enrollment data
};

const enrollmentSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollCourse: (state, { payload: { courseId, userId } }) => {
            console.log("Enrolling course", courseId, userId);
            if (!state.enrollments.some((enrollment) => enrollment.course === courseId && enrollment.user === userId)) {
                state.enrollments.push({ _id: `${state.enrollments.length + 1}`, user: userId, course: courseId });
            }
            console.log("Enrollments", state.enrollments);
        },
        unenrollCourse: (state, { payload: { courseId, userId } }) => {
            state.enrollments = state.enrollments.filter(
                (enrollment) => !(enrollment.course === courseId && enrollment.user === userId)
            );
        },
    },
});

export const { enrollCourse, unenrollCourse } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;