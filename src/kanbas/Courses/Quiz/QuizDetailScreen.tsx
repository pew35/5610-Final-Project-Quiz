import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as quizzesClient from "./client";


interface QuizDetails {
    quizType: string;
    points: number;
    assignmentGroup: string;
    shuffleAnswers: string;
    timeLimit: string;
    multipleAttempts: string;
    viewResponses: string;
    showCorrectAnswers: string;
    oneQuestionAtATime: string;
    requireRespondusLockDown: string;
    requiredToViewResults: string;
    webcamRequired: string;
    lockQuestionsAfterAnswering: string;
    dueDate: string;
    availableFrom: string;
    availableUntil: string;
    forWho: string;
    title: string;
}

export default function QuizDetailScreen() {
    const { pathname } = useLocation();
    const qid = pathname.split("/")[5];
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    const [loading, setLoading] = useState(true);
    const [quizDetails, setQuizDetails] = useState<QuizDetails>({
        quizType: "Graded Quiz",
        points: 29,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: "No",
        timeLimit: "30 Minutes",
        multipleAttempts: "No",
        viewResponses: "Always",
        showCorrectAnswers: "Immediately",
        oneQuestionAtATime: "Yes",
        requireRespondusLockDown: "No",
        requiredToViewResults: "No",
        webcamRequired: "No",
        lockQuestionsAfterAnswering: "No",
        dueDate: "Sep 21 at 1pm",
        availableFrom: "Sep 21 at 11:40am",
        availableUntil: "Sep 21 at 1pm",
        forWho: "Everyone",
        title: "Q1 - HTML"
    });

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                setLoading(true);
                const quiz = await quizzesClient.findQuizById(qid);
                setQuizDetails({
                    ...quizDetails,
                    quizType: quiz.quizType,
                    points: quiz.points,
                    assignmentGroup: quiz.assignmentGroup,
                    shuffleAnswers: quiz.shuffleAnswers ? "Yes" : "No",
                    timeLimit: `${quiz.timeLimit} Minutes`,
                    title: quiz.title,
                    dueDate: quiz.dueDate,
                    availableFrom: quiz.availableDate,
                    availableUntil: quiz.availableUntilDate
                });
            } catch (error) {
                console.error("Error fetching quiz details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizDetails();
    }, [qid]);

    if (loading) {
        return <div>Loading...</div>;
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

            <div id="wd-quiz-details" className="mt-4">
                <h2>{quizDetails.title}</h2>
                
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 d-flex flex-column align-items-end p-2">
                            <span className="text-end fw-bold my-1">Quiz Type</span>
                            <span className="text-end fw-bold my-1">Points</span>
                            <span className="text-end fw-bold my-1">Assignment Group</span>
                            <span className="text-end fw-bold my-1">Shuffle Answers</span>
                            <span className="text-end fw-bold my-1">Time Limit</span>
                            <span className="text-end fw-bold my-1">Multiple Attempts</span>
                            <span className="text-end fw-bold my-1">View Responses</span>
                            <span className="text-end fw-bold my-1">Show Correct Answers</span>
                            <span className="text-end fw-bold my-1">One Question at a Time</span>
                            <span className="text-end fw-bold my-1">Require Respondus LockDown Browser</span>
                            <span className="text-end fw-bold my-1">Required to View Quiz Results</span>
                            <span className="text-end fw-bold my-1">Webcam Required</span>
                            <span className="text-end fw-bold my-1">Lock Questions After Answering</span>
                        </div>

                        <div className="col-md-8 d-flex flex-column align-items-start p-2">
                            <span className="text-start my-1">{quizDetails.quizType}</span>
                            <span className="text-start my-1">{quizDetails.points}</span>
                            <span className="text-start my-1">{quizDetails.assignmentGroup}</span>
                            <span className="text-start my-1">{quizDetails.shuffleAnswers}</span>
                            <span className="text-start my-1">{quizDetails.timeLimit}</span>
                            <span className="text-start my-1">{quizDetails.multipleAttempts}</span>
                            <span className="text-start my-1">{quizDetails.viewResponses}</span>
                            <span className="text-start my-1">{quizDetails.showCorrectAnswers}</span>
                            <span className="text-start my-1">{quizDetails.oneQuestionAtATime}</span>
                            <span className="text-start my-1">{quizDetails.requireRespondusLockDown}</span>
                            <span className="text-start my-1">{quizDetails.requiredToViewResults}</span>
                            <span className="text-start my-1">{quizDetails.webcamRequired}</span>
                            <span className="text-start my-1">{quizDetails.lockQuestionsAfterAnswering}</span>
                        </div>
                    </div>
                </div>

                <div className="container mt-4">
                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="fw-bold">Due</th>
                                        <th className="fw-bold">For</th>
                                        <th className="fw-bold">Available from</th>
                                        <th className="fw-bold">Until</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{quizDetails.dueDate}</td>
                                        <td>{quizDetails.forWho}</td>
                                        <td>{quizDetails.availableFrom}</td>
                                        <td>{quizDetails.availableUntil}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}