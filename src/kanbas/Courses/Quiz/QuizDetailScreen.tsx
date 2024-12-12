import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as quizzesClient from "./client";

export default function QuizDetailScreen() {
    const { pathname } = useLocation();
    const qid = pathname.split("/")[5];
    const cid = pathname.split("/")[3];
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    // State for data from backend
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [userAttempts, setUserAttempts] = useState<any[]>([]);
    const [latestAttempt, setLatestAttempt] = useState<any>(null);
    const [latestAnswers, setLatestAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch quiz details
                const quizData = await quizzesClient.findQuizById(qid);
                setQuiz(quizData);

                // Fetch questions
                const questionsData = await quizzesClient.findQuestionsByQuiz(qid);
                setQuestions(questionsData);

                // Fetch attempts
                const attemptsData = await quizzesClient.findAttemptsByQuizID(qid);
                const userAttemptsData = attemptsData.filter(
                    (attempt: any) => attempt.userID === currentUser._id
                );
                setUserAttempts(userAttemptsData);

                // Set latest attempt and fetch its answers
                if (userAttemptsData.length > 0) {
                    const latest = userAttemptsData.sort(
                        (a: any, b: any) => b.attemptNumber - a.attemptNumber
                    )[0];
                    setLatestAttempt(latest);

                    // Fetch answers for latest attempt
                    const answersData = await quizzesClient.findAttemptsAnswers(latest._id);
                    setLatestAnswers(answersData);
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [qid, currentUser._id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        {currentUser.role === "FACULTY" && (
                            <>
                                <Link to={`${pathname}/preview`} id="wd-preview" className="btn btn-secondary mx-2">
                                    Preview
                                </Link>
                                <Link to={`${pathname}/edit`} id="wd-edit" className="btn btn-secondary mx-2">
                                    <i className="bi bi-pencil"></i> Edit
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div key={quiz._id} id="wd-assignments-editor">
                {currentUser.role === "FACULTY" ? (
                    <>
                        <hr />
                        <h4>{quiz.title}</h4>
                        <div className="container">
                            <div className="row">
                                <div className="col d-flex flex-column align-items-end p-2 my-2">
                                    <span className="text-end fw-bold my-1">Quiz Type</span>
                                    <span className="text-end fw-bold my-1">Points</span>
                                    <span className="text-end fw-bold my-1">Assignment Group</span>
                                    <span className="text-end fw-bold my-1">Shuffle Answers</span>
                                    <span className="text-end fw-bold my-1">Time Limit</span>
                                    <span className="text-end fw-bold my-1">Multiple Attempts</span>
                                </div>

                                <div className="col d-flex flex-column align-items-start p-2 my-2">
                                    <span className="text-start my-1">{quiz.quizType}</span>
                                    <span className="text-start my-1">{quiz.points}</span>
                                    <span className="text-start my-1">{quiz.assignmentGroup}</span>
                                    <span className="text-start my-1">{quiz.shuffleAnswers ? "Yes" : "No"}</span>
                                    <span className="text-start my-1">{quiz.timeLimit} Minutes</span>
                                    <span className="text-start my-1">{quiz.attempts > 1 ? "Yes" : "No"}</span>
                                </div>
                            </div>
                        </div>
                        <br />

                        <div className="container">
                            <div className="row">
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-start fw-bold">Due</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-start fw-bold">For</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-end fw-bold">Available From</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-end fw-bold">Until</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="container">
                            <div className="row">
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-start">{quiz.dueDate}</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-start">Everyone</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-end">{quiz.availableDate}</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-end">{quiz.availableUntilDate}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div id="wd-assignments-editor" className="text-start">
                            <h2>{quiz.title}</h2>
                            <hr />
                            <div className="text-start mb-3">
                                <p>
                                    <strong>Due</strong> {quiz.dueDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <strong>Points</strong> {quiz.points} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <strong>Questions</strong> {questions.length} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <strong>Available</strong> {quiz.availableDate} - {quiz.availableUntilDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <strong>Time Limit</strong> {quiz.timeLimit}
                                </p>
                            </div>
                            <hr /><br />
                        </div>

                        {(!userAttempts.length || userAttempts.length < quiz.attempts) && (
                            <div className="text-center">
                                <Link to={`${pathname}/take`} id="wd-take-quiz" className="btn btn-danger">
                                    Take Quiz
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {userAttempts.length > 0 && (
                    <div>
                        <h3>Attempt History</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Attempt</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAttempts.map((attempt, index) => (
                                    <tr key={index}>
                                        <td>
                                            {attempt._id === latestAttempt._id ? 'LATEST' : ''}
                                        </td>
                                        <td style={{ color: "red" }}>Attempt {attempt.attemptNumber}</td>
                                        <td>{attempt.score} out of {quiz.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {latestAttempt && (
                            <>
                                <div>
                                    <span>Score for this quiz: <b style={{ fontSize: '20px', fontWeight: 'bold' }}>{latestAttempt.score}</b> out of {quiz.points}</span>
                                    <h6>Submitted {latestAttempt.date}</h6>
                                </div>
                                <br />

                                {questions.map((question, index) => {
                                    const userAnswer = latestAnswers.find(
                                        answer => answer.questionId === question._id
                                    );
                                    const isUserAnswerCorrect = userAnswer?.isCorrect;
                                    const userSelectedAnswer = userAnswer?.answer[0];
                                    const pointsAwarded = isUserAnswerCorrect ? question.points : 0;

                                    // Rest of your existing question rendering logic...
                                    // You might need to adjust this part based on your actual data structure
                                })}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
