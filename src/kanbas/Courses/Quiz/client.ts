import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuizById = async (qid: string) => {
    const response = await axios.get(`${QUIZZES_API}/${qid}`);
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quiz: any) => {
    const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.data;
};

export const findQuestionsByQuiz = async (qid: string) => {
    const response = await axios.get(`${QUIZZES_API}/${qid}/questions`);
    return response.data;
};

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
    const response = await axios.post(`${QUIZZES_API}/questions`, question);
    return response.data;
};

export const deleteQuestionFromQuiz = async (questionId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/questions/${questionId}`);
    return response.data;
};