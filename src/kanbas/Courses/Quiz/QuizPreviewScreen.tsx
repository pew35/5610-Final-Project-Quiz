import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { PiTagSimpleThin } from "react-icons/pi";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { GoQuestion } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { setQuizSubmitted } from "./reducer";
import * as quizClient from "./client"

export default function QuizPreviewScreen() {
    const { pathname } = useLocation();
    const qid = pathname.split("/")[5]
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const filteredQuestions = questions.filter((q: any) => q.quizId === qid);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [quizStarted, setQuizStarted] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = currentUser._id;

    const handleStartQuiz = () => {
        if (!quizStarted) {
            setQuizStarted(true);
        }
    };

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const quiz = await quizClient.findQuizById(qid);
            const quizQuestions = await quizClient.findQuestionsByQuiz(qid);
            setQuizzes([quiz]);
            setQuestions(quizQuestions);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchQuizData();
        console.log("User Answers Before Submitting:", answers);
        console.log("Current Question Index Changed:", currentQuestionIndex);
    }, [currentQuestionIndex]);
    
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleAnswerChange = (value: string) => {
        handleStartQuiz();
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questions[currentQuestionIndex]._id]: value,
        }));
    };

    const calculateScore = (answers: Record<string, string>) => {
        let score = 0;
        console.log("User Answers:", answers);
    
        questions.forEach((question) => {
            const correctAnswer = question.answer ? question.answer[0] : ''; 
            console.log(`Question ID: ${question._id}, Correct Answer: ${correctAnswer}`);
    
            if (question.type === "Multiple Choice" || question.type === "True/False") {
                const userAnswer = answers[question._id];
                console.log(`User Answer: ${userAnswer}`);
    
                if (userAnswer === correctAnswer) {
                    score += question.points;
                }
            } else if (question.type === "Fill in the Blank") {
                const userAnswer = answers[question._id];
                console.log(`User Answer (Fill in the Blank): ${userAnswer}`);
    
                if (userAnswer === correctAnswer) {
                    score += question.points; 
                }
            }
        });
    
        console.log("Total Score:", score);
        return score; 
    };

    const checkAnswer = (questionId: string, userAnswer: string): boolean => {
        const question = questions.find(q => q._id === questionId);
    
        if (!question) {
            console.error("Question not found:", questionId);
            return false;
        }
    
        const correctAnswer = question.answer ? question.answer[0] : ''; 
    
        if (question.type === "Multiple Choice" || question.type === "True or False") {
            return userAnswer === correctAnswer;
        } else if (question.type === "Fill in the blank") {
            return userAnswer === correctAnswer;
        }
    
        return false;
    };

    const getAttemptNumber = async (userId: string, quizId: string) => {
        try {
            const previousAttempts = await quizClient.findLatestAttemptsbyUIdandQId(userId, quizId);
    
            if (!Array.isArray(previousAttempts)) {
                console.warn("Previous attempts is not an array, returning 1 for attempt number.");
                return 1;
            }
    
            if (previousAttempts.length > 0) {
                return previousAttempts.length + 1;
            }
    
            return 1;
        } catch (error) {
            console.error("Error fetching previous attempts:", error);
            return 1;
        }
    };

    const handleSubmit = async () => {
        try {
            const attemptId = Date.now().toString();
            const date = new Date().toISOString();
            const userId = currentUser._id;
            const score = calculateScore(answers);
            const attemptNumber = await getAttemptNumber(userId, qid);
            console.log("current Attempt Number is: " + attemptNumber)
    
            const attemptData = {
                _id: attemptId,
                date,
                score,
                answerId: [],
                quizId: qid,
                userId,
                attemptNumber
            };
    
            const savedAttempt = await quizClient.createAttempt(attemptData);
    
            for (const [questionId, answer] of Object.entries(answers)) {
                const answerId = Date.now().toString();
                if (answer === undefined) {
                    console.warn(`Answer for questionId ${questionId} is undefined.`);
                    continue; 
                }
                const isCorrect = checkAnswer(questionId, answer);
    
                const answerData = {
                    _id: answerId,
                    attemptId: savedAttempt._id,
                    questionId,
                    answer: [answer], 
                    isCorrect
                };
    
                await quizClient.saveAnswer(answerData);
                savedAttempt.answerId.push(answerId);
            }
    
            dispatch(setQuizSubmitted({ quizId: qid }));
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
            alert("Quiz submitted!");
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const quiz = quizzes[0];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col ">
                    <h2 className="text-start">{quiz?.title}</h2>

                    {currentUser.role === 'FACULTY' && (
                    <div
                        className="text-muted p-2 text-start"
                        style={{
                        backgroundColor: "#FFE4E1",
                        color: "red",
                        borderRadius: "5px",
                        }}
                    >
                        
                    <IoIosInformationCircleOutline style={{ color: "red", marginRight: "5px" }} />
                    <span style={{ color: "red" }}>This is a preview of the published version of the quiz.</span> 
                    </div>)}
                  
                    <p className="text-start mt-2">
                        <strong>Started:</strong>{" "}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })
                                    .format(new Date())
                                    .replace(",", " at")
                                    .replace(/AM|PM/, (match) => `<span class="small-caps">${match.toLowerCase()}</span>`),
                            }}
                        />
                    </p>
                    <h3 className="text-start">Quiz Instructions</h3><hr />

                    <div className="container mb-4">
                        <div className="d-flex align-items-start">
                            <PiTagSimpleThin size="2em" style={{ marginTop: '5px', marginRight: '15px' }} />
                            <div className="ml-3 flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center p-3"
                                    style={{
                                        backgroundColor: "lightgray", // Light blue #f0f8ff
                                        border: "1px solid gray",
                                        borderBottom: "none",
                                        borderRadius: "1px 1px 0 0",
                                    }}>
                                    <h5><strong>Question {currentQuestionIndex + 1}</strong></h5>
                                    <h6><strong>{currentQuestion?.points} pts</strong></h6>
                                </div>

                                <div className="p-3" style={{
                                    border: "1px solid gray",
                                    borderRadius: "0 0 1px 1px",
                                }}>
                                    <p>{currentQuestion?.question}</p>
                                    <div>
                                    {currentQuestion?.type === "Multiple Choice" && (
                                            <div>
                                                <hr />{currentQuestion.option.map((opt: string, idx: number) => (
                                                    <div key={idx}>
                                                        <div className="form-check">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input"
                                                                name={`question-${currentQuestion._id}`}
                                                                value={opt.split(":")[0]}
                                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                                checked={answers[currentQuestion._id] === opt.split(":")[0]}
                                                            />
                                                            <label className="form-check-label">{opt}</label>
                                                        </div>
                                                        {idx < currentQuestion.option.length - 1 && <hr />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentQuestion?.type === "True/False" && (
                                            <div>
                                                <hr />{currentQuestion.option.map((opt: string, idx: number) => (
                                                    <div key={idx}>
                                                        <div className="form-check">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input"
                                                                name={`question-${currentQuestion._id}`}
                                                                value={opt}
                                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                                checked={answers[currentQuestion._id] === opt}
                                                            />
                                                            <label className="form-check-label">{opt}</label>
                                                        </div>
                                                        {idx < currentQuestion.option.length - 1 && <hr />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentQuestion?.type === "Fill in the Blank" && (
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={answers[currentQuestion._id] || ""}
                                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                                    style={{ width: "300px" }} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div><br />

                                <div className="d-flex justify-content-between mt-3">
                                    {currentQuestionIndex > 0 && (
                                        <button
                                            className="btn"
                                            style={{
                                                backgroundColor: "lightgray", 
                                                color: "black",
                                                width: "120px", 
                                            }}
                                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                                            <IoMdArrowDropleft /> Previous
                                        </button>
                                    )}
                                    
                                    {currentQuestionIndex < filteredQuestions.length - 1 && (
                                        <button
                                            className="btn ms-auto"
                                            style={{
                                                backgroundColor: "lightgray", 
                                                color: "black",
                                                width: "120px",  
                                            }}
                                            onClick={handleNext}>
                                            Next <IoMdArrowDropright />
                                        </button>
                                    )}
                                </div>
                            </div>    
                        </div>

                        <div
                            className="d-flex justify-content-end align-items-center p-2 mt-4"
                            style={{
                                border: "1px solid gray",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <p className="mb-0 me-3">
                                Quiz saved at{" "}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: new Intl.DateTimeFormat("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })
                                            .format(new Date())
                                            .replace(",", " at")
                                            .replace(/AM|PM/, (match) => `<span class="small-caps">${match.toLowerCase()}</span>`),
                                    }}
                                />
                            </p>

                            <button 
                                className="btn"
                                style={{
                                    backgroundColor: currentQuestionIndex === filteredQuestions.length - 1 ? "red" : "lightgray",
                                    color: currentQuestionIndex === filteredQuestions.length - 1 ? "white" : "black",
                                }}
                                onClick={handleSubmit}
                            >
                                Submit Quiz
                            </button>
                        </div><br /><br />

                        {currentUser.role === "FACULTY" && (
                            <Link
                            to={quizStarted ? "#" : `/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`}
                            id="wd-edit-quiz"
                            className="btn btn-secondary w-100 text-start"
                            style={{
                                pointerEvents: quizStarted ? "none" : "auto",
                                cursor: quizStarted ? "not-allowed" : "pointer",
                                color: quizStarted ? "grey" : "inherit",
                            }}
                        >
                            <MdModeEdit /> Keep Editing This Quiz
                        </Link>
                        )}
                       
                    </div>
                </div>

                <div className="col-2 m-5">
                    <h4 className="me-1">Questions</h4>
                    <ul className="me-1" style={{ listStyleType: "none", padding: 10 }}>
                        {filteredQuestions.map((q, index) => (
                            <li
                                key={q._id}
                                className={`d-flex align-items-center ${
                                    currentQuestionIndex === index ? "text-primary" : "text-danger"
                                }`}
                                style={{ cursor: "pointer", marginBottom: "3px" }}
                                onClick={() => setCurrentQuestionIndex(index)}>
                                {answers[q._id] ? (
                                    <FaCheck className="me-2" />
                                ) : (
                                    <GoQuestion className="me-2" />
                                )}
                                Question {index + 1}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

        </div>
    );
}
