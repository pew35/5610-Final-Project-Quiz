import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const fetchAllCourses = async () => {
    const { data } = await axios.get(COURSES_API);
    return data;
};

export const deleteCourse = async (id: string) => {
    const { data } = await axios.delete(`${COURSES_API}/${id}`);
    return data;
};

export const updateCourse = async (course: any) => {
    const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
    return data;
};

export const findModulesForCourse = async (courseId: string) => {
    const response = await axios
        .get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/modules`,
        module
    );
    return response.data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
    const response = await axios
        .get(`${COURSES_API}/${courseId}/assignments`);
    return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/assignments`,
        assignment
    );
    return response.data;
};

export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios
    // /api/courses/:courseId/quizzes
        .get(`${COURSES_API}/${courseId}/quizzes`);
    console.log("Data found for findQUizzesforcourse: ", response.data)
    return response.data;
};

export const findQuestionsForQuiz = async (quizId: string) => {
    const response = await axios
        .get(`${QUIZZES_API}/${quizId}/questions`);
    console.log("Data found for findQuestionsForQuiz: ", response.data)
    return response.data;
}
export const findPublishedQuizzesForCourse = async (courseId: string) => {
    const response = await axios
    // /api/courses/:courseId/quizzes
        .get(`${COURSES_API}/${courseId}/quizzes?published=true`);
    console.log("Data found for findPublishedQUizzesforcourse: ", response.data)
    return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/quizzes`,
        quiz
    );
    return response.data;
};
