import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuizById = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}`) ;
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quiz: any) => {
    const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return data;
};

export const findQuestionsByQuiz = async (quizId: string) => {
    const { data } = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
    return data;
}
export const findAttemptsByQuizID = async (quizId: string) => {
    const { data } = await axios.get(`${QUIZZES_API}/${quizId}/attempts`);
    return data;
}

export const createAttempt = async (attempt: any) => {
    const response = await axios.post(`/api/attempts`, attempt);
    return response.data;
}

export const findAttempts = async (userId: string, quizId: string) => {
    const response = await axios.get(`/api/attempts`);
    return response.data;
};

export const findAttemptsAnswers = async (attemptId: string) => {
    const response = await axios.get(`/api/attempts/${attemptId}/attemptAnswer`);
    return response.data;
};

export const createQuestionForQuiz = async (question: any) => {
    const { data } = await axios.post(
        `${QUIZZES_API}/${question.qid}/questions`, 
        question
    );
    return data;
};

export const deleteQuestionFromQuiz = async (questionId: string) => {
    const { data } = await axios.delete(
        `${QUIZZES_API}/questions/${questionId}`
    );
    return data;
};
