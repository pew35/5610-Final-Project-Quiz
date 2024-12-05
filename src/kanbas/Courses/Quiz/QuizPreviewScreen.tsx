import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { PiTagSimpleThin } from "react-icons/pi";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { GoQuestion } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { setQuizSubmitted } from "./reducer";
import * as db from "../../Database/";

export default function QuizPreviewScreen() {
    const { pathname } = useLocation();
    const qid = pathname.split("/")[5]
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const quizzes = db.quizzes;
    const questions = db.questions;
    const quiz = quizzes.find((q: any) => q.id === parseInt(qid, 10));
    const filteredQuestions = questions.filter((q: any) => q.quizId === qid);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [quizStarted, setQuizStarted] = useState(false);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const navigate = useNavigate();
    const dispatch = useDispatch();
   

    const handleStartQuiz = () => {
        if (!quizStarted) {
            setQuizStarted(true); 
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleAnswerChange = (value: string) => {
        handleStartQuiz();
        setAnswers({
            ...answers,
            [currentQuestion._id]: value,
        });
    };

    const handleSubmit = () => {
        dispatch(setQuizSubmitted({ quizId: qid }));
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`)
        alert("Quiz submitted!");
    };

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

                                        {currentQuestion?.type === "True or False" && (
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

                                        {currentQuestion?.type === "Fill in the blank" && (
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
