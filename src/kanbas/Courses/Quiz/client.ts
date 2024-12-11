import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API =  `${REMOTE_SERVER}/api/questions`

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

export const createQuestionsForQuiz = async ( question: any) => {
    const response = await axiosWithCredentials.post(
        `${QUESTIONS_API}`, question
    )
    console.log("Server side createQuestionsForQuiz: ", question)
    return response.data;
}

export const deleteQuestions = async (quizId: string, questionsId: string) => {
    console.log("Delete question id: ", questionsId)
    const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/questions/${questionsId}`);
    return response.data;
};
