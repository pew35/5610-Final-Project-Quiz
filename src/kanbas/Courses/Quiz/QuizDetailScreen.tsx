import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {useState} from "react";
import * as db from "../../Database";


export default function QuizDetailScreen() {
    const {pathname} = useLocation();
    const quizzes = db.quizzes;
    const questions = db.questions;
    const answers = db.answers;
    const attempts = db.attempts;
    const qid = pathname.split("/")[5]
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const filteredQuestions = questions.filter((q: any) => q.quizId === qid);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const { quizStatuses } = useSelector((state: any) => state.quizReducer);
    const quizSubmitted = quizStatuses?.[qid]?.submitted;


    console.log('parentPath', parentPath)
    console.log('pathname', parentPath)

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
            

            {quizzes.filter((quiz: any) => parseInt(quiz.id) === parseInt(qid)).map((quiz: any) => (
                <div key={quiz.id} id="wd-assignments-editor">
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
                                        <span className="text-start my-1">30 Minutes</span>
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
                                        <span className="text-end">{quiz.availableDate}</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end">{quiz.availableUntilDate}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <br />

                            {/* {quizSubmitted && (
                                <p>Quiz Submitted</p>
                            )} */}


                        </>
                    ) : (
                        <>
                        {quizzes.filter((quiz: any) => parseInt(quiz.id) === parseInt(qid)).map((quiz: any) => (
                            <div key={quiz.id} id="wd-assignments-editor" className="text-start">
                                <h2>{quiz.title}</h2>
                                <hr />

                                <div className="text-start mb-3">
                                    <p>
                                        <strong>Due</strong>  {quiz.dueDate}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Points</strong>  {quiz.points} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Questions</strong>  {quiz.questionsCount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Available</strong>  {quiz.availableDate} - {quiz.availableUntilDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Time Limit</strong>  {quiz.timeLimit}
                                    </p>
                                </div><hr /><br />


                            </div>
                        ))}

                        <div className="text-center">
                        <Link to={`${pathname}/take`} id="wd-take-quiz" className="btn btn-danger">
                            Take Quiz
                        </Link>
                        </div>

                        </>
                    )}

                    {/* Additional common UI if quiz is submitted */}
                    {quizSubmitted && (

                    <div>
                        <p> This quiz was locked {quiz.availableUntilDate}. </p><hr />

                        <div>

                            <h6>Score for this quiz:</h6>

                        </div>

                        {filteredQuestions.map((question, index) => {
                            const userAnswer = answers.find(answer => answer.questionID === question._id);
                            const isUserAnswerCorrect = userAnswer && userAnswer.isCorrect;
                            const userSelectedAnswer = userAnswer ? userAnswer.answer[0] : null;
                            const pointsAwarded = isUserAnswerCorrect ? question.points : 0;
                            const questionBackgroundColor = isUserAnswerCorrect ? "lightgreen" : "lightcoral";

                            return (
                                <div key={question._id} className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center p-3"
                                        style={{
                                            backgroundColor: questionBackgroundColor,
                                            border: "1px solid gray",
                                            borderBottom: "none",
                                            borderRadius: "1px 1px 0 0",
                                        }}>
                                        <h5><strong>Question {index + 1}</strong></h5>
                                        <h6><strong>{pointsAwarded}/{question.points} pts</strong></h6>
                                    </div>

                                    <div className="p-3" style={{
                                        border: "1px solid gray",
                                        borderRadius: "0 0 1px 1px",
                                    }}>
                                        <p>{question.question}</p>

                                        {question.type === "Multiple Choice" && (
                                            <div>
                                                <hr />
                                                {question.option.map((opt, idx) => {
                                                    const isCorrect = opt.startsWith(question.answer);
                                                    const isSelected = userSelectedAnswer === opt.split(":")[0];

                                                    return (
                                                        <div key={idx}>
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name={`question-${question._id}`}
                                                                    value={opt.split(":")[0]}
                                                                    checked={isSelected}
                                                                    disabled
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt}
                                                                    {isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "green",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {isSelected && !isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx < question.option.length - 1 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "True or False" && (
                                            <div>
                                                <hr />
                                                {question.option.map((opt, idx) => {
                                                    const isCorrect = opt === question.answer;
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
                                                                    {isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "green",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {isSelected && !isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx < question.option.length - 1 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "Fill in the blank" && (
                                            <div>
                                                {/* Input displaying user's answer */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userSelectedAnswer || ""}
                                                    disabled
                                                    style={{ width: 300 }}
                                                />
                                                <br />

                                                {/* Correct answer */}
                                                <div>
                                                    <strong>Answer:</strong> {question.answer}
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

                                                {/* User's answer */}
                                                <div>
                                                    <strong>You Answered:</strong> {userSelectedAnswer || "No Answer"}
                                                    {!isUserAnswerCorrect && (
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
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div> 
                    )}
                </div>
            ))}
        </div>
    );
}
