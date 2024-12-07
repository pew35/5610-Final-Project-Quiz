import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import coursesReducer from "./Dashboard/coursesReducer";
import enrollmentsReducer from "./Dashboard/enrollmentsReducer";
import quizReducer from "./Courses/Quiz/reducer"

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    coursesReducer,
    enrollmentsReducer,
    quizReducer,
  },
});
export default store;

