import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as quizClient from "./client";

export default function QuizDetailScreen() {
    const { pathname } = useLocation();
    const qid = pathname.split("/")[5];
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { quizStatuses } = useSelector((state: any) => state.quizReducer);
    const quizSubmitted = quizStatuses?.[qid]?.submitted;

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [attempts, setAttempts] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const [fetchedQuiz, fetchedQuestions] = await Promise.all([
                quizClient.findQuizById(qid),
                quizClient.findQuestionsByQuiz(qid)
            ]);

            if (currentUser._id) {
                const fetchedAttempts = await quizClient.findAttempts(currentUser._id, qid);
                setAttempts(fetchedAttempts);

                if (fetchedAttempts.length > 0) {
                    const latestAttempt = fetchedAttempts.sort((a: any, b: any) => 
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    )[0];
                    const fetchedAnswers = await quizClient.findAttemptsAnswers(latestAttempt._id);
                    setAnswers(fetchedAnswers);
                }
            }

            setQuiz(fetchedQuiz);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
    }, [qid, currentUser._id]);

    if (loading) {
        console.log("Loading...");
    }

    if (!quiz) {
        console.log("Quiz not found");
    }

    const userAttempts = attempts.filter(attempt => attempt.userId === currentUser._id);
    const latestAttempt = userAttempts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const attemptHistory = userAttempts.map(attempt => ({
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        date: new Date(attempt.timestamp).toLocaleDateString()
    }));

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

            <div id="wd-assignments-editor">
                {currentUser.role === "FACULTY" ? (
                    <>
                        <hr />
                        <h4>{quiz.title}</h4>

                        {/* Quiz details for faculty */}
                        <div className="container">
                            <div className="row">
                                <div className="col d-flex flex-column align-items-end p-2 my-2">
                                    <span className="text-end fw-bold my-1">Quiz Type</span>
                                    <span className="text-end fw-bold my-1">Points</span>
                                    <span className="text-end fw-bold my-1">Assignment Group</span>
                                    <span className="text-end fw-bold my-1">Shuffle Answers</span>
                                    <span className="text-end fw-bold my-1">Time Limit</span>
                                    <span className="text-end fw-bold my-1">Multiple Attempts</span>
                                    <span className="text-end fw-bold my-1">View Responses</span>
                                    <span className="text-end fw-bold my-1">Show Correct Answers</span>
                                    <span className="text-end fw-bold my-1">One Question at a Time</span>
                                    <span className="text-end fw-bold my-1">Require Respondus Lock Down</span>
                                    <span className="text-end fw-bold my-1">Browser</span>
                                    <span className="text-end fw-bold my-1">Required to View Quiz Result</span>
                                    <span className="text-end fw-bold my-1">Webcam Required</span>
                                    <span className="text-end fw-bold my-1">Lock Questions After Answering</span>
                                </div>

                                <div className="col d-flex flex-column align-items-start p-2 my-2">
                                    <span className="text-start my-1">Graded Quiz</span>
                                    <span className="text-start my-1">{quiz.points}</span>
                                    <span className="text-start my-1">QUIZZES</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">{quiz.timeLimit} Minutes</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">Always</span>
                                    <span className="text-start my-1">Immediately</span>
                                    <span className="text-start my-1">Yes</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">No</span>
                                    <span className="text-start my-1">No</span>
                                </div>
                            </div>
                        </div>
                        <br />

                        {/* Due date and availability */}
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
                                    <span className="text-end">{quiz.availableFrom}</span>
                                </div>
                                <div className="col d-flex flex-column align-items-start">
                                    <span className="text-end">{quiz.availableUntil}</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <br />
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
                                    <strong>Time Limit</strong> {quiz.timeLimit} Minutes
                                </p>
                            </div>
                            <hr />
                            <br />
                        </div>

                        {(!userAttempts.length || userAttempts.length < quiz.maxAttempts) && (
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
                                {attemptHistory.map((attempt, index) => (
                                    <tr key={index}>
                                        <td>
                                            {attempt.attemptNumber === latestAttempt.attemptNumber ? 'LATEST' : ''}
                                        </td>
                                        <td style={{ color: "red" }}>Attempt {attempt.attemptNumber}</td>
                                        <td>{attempt?.score} out of {quiz.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <br />

                        <div>
                            <span>
                                Score for this quiz: <b style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    {latestAttempt?.score}
                                </b> out of {quiz.points}
                            </span>
                            <h6>Submitted {new Date(latestAttempt?.timestamp).toLocaleString()}</h6>
                        </div>
                        <br />

                        {questions.map((question, index) => {
                            const userAnswer = answers.find(answer => answer.questionId === question._id);
                            const isUserAnswerCorrect = userAnswer?.isCorrect;
                            const userSelectedAnswer = userAnswer?.answer;
                            const pointsAwarded = isUserAnswerCorrect ? question.points : 0;

                            const isFaculty = currentUser.role === 'FACULTY';
                            const isLastAttempt = userAttempts.length === quiz.maxAttempts;
                            const showAnswer = isFaculty || isLastAttempt;

                            const questionBackgroundColor = showAnswer
                                ? (isUserAnswerCorrect ? "lightgreen" : "lightcoral")
                                : "gray";

                            return (
                                <div key={question._id} className="mb-4">
                                    <div
                                        className="d-flex justify-content-between align-items-center p-3"
                                        style={{
                                            backgroundColor: questionBackgroundColor,
                                            border: "1px solid gray",
                                            borderBottom: "none",
                                            borderRadius: "1px 1px 0 0",
                                        }}
                                    >
                                        <h5><strong>Question {index + 1}</strong></h5>
                                        {showAnswer && (
                                            <h6><strong>{pointsAwarded}/{question.points} pts</strong></h6>
                                        )}
                                    </div>

                                    <div
                                        className="p-3"
                                        style={{
                                            border: "1px solid gray",
                                            borderRadius: "0 0 1px 1px",
                                        }}
                                    >
                                        <p>{question.text}</p>

                                        {question.type === "Multiple Choice" && (
                                            <div>
                                                <hr />
                                                {question.options.map((opt: any, idx: number) => {
                                                    const isCorrect = opt.value === question.correctAnswer;
                                                    const isSelected = userSelectedAnswer === opt.value;

                                                    return (
                                                        <div key={idx}>
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name={`question-${question._id}`}
                                                                    value={opt.value}
                                                                    checked={isSelected}
                                                                    disabled
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt.text}
                                                                    {showAnswer && isCorrect && (
                                                                        <span
                                                                            style={{
                                                                                backgroundColor: "green",
                                                                                color: "white",
                                                                                borderRadius: "3px",
                                                                                padding: "0 5px",
                                                                                marginLeft: "10px",
                                                                            }}
                                                                        >
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {showAnswer && isSelected && !isCorrect && (
                                                                        <span
                                                                            style={{
                                                                                backgroundColor: "red",
                                                                                color: "white",
                                                                                borderRadius: "3px",
                                                                                padding: "0 5px",
                                                                                marginLeft: "10px",
                                                                            }}
                                                                        >
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx < question.options.length - 1 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "True/False" && (
                                            <div>
                                                <hr />
                                                {["True", "False"].map((opt, idx) => {
                                                    const isCorrect = opt === question.correctAnswer;
                                                    const isSelected = userSelectedAnswer === opt;

                                                    return (
                                                        <div key={idx}>
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name={`question-${question._id}`}
                                                                    value={opt}
                                                                    checked={isSelected}
                                                                    disabled
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt}
                                                                    {showAnswer && isCorrect && (
                                                                        <span
                                                                            style={{
                                                                                backgroundColor: "green",
                                                                                color: "white",
                                                                                borderRadius: "3px",
                                                                                padding: "0 5px",
                                                                                marginLeft: "10px",
                                                                            }}
                                                                        >
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {showAnswer && isSelected && !isCorrect && (
                                                                        <span
                                                                            style={{
                                                                                backgroundColor: "red",
                                                                                color: "white",
                                                                                borderRadius: "3px",
                                                                                padding: "0 5px",
                                                                                marginLeft: "10px",
                                                                            }}
                                                                        >
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx === 0 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "Fill in the blank" && (
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userSelectedAnswer || ""}
                                                    disabled
                                                    style={{ width: 300 }}
                                                />
                                                <br />

                                                {showAnswer && (
                                                    <div>
                                                        <strong>Correct Answer:</strong> {question.correctAnswer}
                                                        <span
                                                            style={{
                                                                backgroundColor: "#81c784",
                                                                color: "white",
                                                                borderRadius: "3px",
                                                                padding: "0 5px",
                                                                marginLeft: "10px",
                                                            }}
                                                        >
                                                            Correct
                                                        </span>
                                                    </div>
                                                )}

                                                {showAnswer && !isUserAnswerCorrect && (
                                                    <div>
                                                        <strong>You Answered:</strong> {userSelectedAnswer || "No Answer"}
                                                        <span
                                                            style={{
                                                                backgroundColor: "lightcoral",
                                                                color: "white",
                                                                borderRadius: "3px",
                                                                padding: "0 5px",
                                                                marginLeft: "10px",
                                                            }}
                                                        >
                                                            Incorrect
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}