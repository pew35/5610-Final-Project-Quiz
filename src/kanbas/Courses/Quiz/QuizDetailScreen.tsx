import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as db from "../../Database";


export default function QuizDetailScreen() {
    const {pathname} = useLocation();
    const quizzes = db.quizzes;
    const qid = pathname.split("/")[5]
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    const { currentUser } = useSelector((state: any) => state.accountReducer);
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
                        </>
                    ) : (
                        <>
                        {quizzes.filter((quiz: any) => parseInt(quiz.id) === parseInt(qid)).map((quiz: any) => (
                            <div key={quiz.id} id="wd-assignments-editor" className="text-start">
                                <h2>{quiz.title}</h2>
                                <hr />

                                <div className="text-start mb-3">
                                    <p>
                                        <strong>Due:</strong> {quiz.dueDate}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Points:</strong> {quiz.points} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Questions:</strong> 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Available:</strong> {quiz.availableDate} - {quiz.availableUntilDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Time Limit:</strong> 20 Minutes
                                    </p>
                                </div><hr /><br />

                                <div className="text-center">
                                <Link to={`${pathname}/take`} id="wd-take-quiz" className="btn btn-danger">
                                    Take Quiz
                                </Link>
                                </div>

                            </div>
                        ))}

                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
