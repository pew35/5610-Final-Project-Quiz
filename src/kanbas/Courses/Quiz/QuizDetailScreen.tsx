import { useLocation, Link } from "react-router-dom";
import * as db from "../../Database";


export default function QuizEditor() {
    const {pathname} = useLocation();
    const quizzes = db.quizzes;
    const qid = pathname.split("/")[5]
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    console.log('parentPath', parentPath)
    console.log('pathname', parentPath)
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        <Link to={`${pathname}/preview`} id="wd-preview" className="btn btn-secondary mx-2">Preview</Link>
                        <Link to={`${pathname}/edit`} id="wd-Edit" className="btn btn-secondary mx-2"><i className="bi bi-pencil"></i>Edit</Link>
                    </div>
                </div>
            </div>
            <hr/>

            {quizzes.filter((quiz: any) => parseInt(quiz.id) === parseInt(qid)).map((quiz: any) => (
                <div id="wd-assignments-editor">
                    <h4>{quiz.title}</h4>

                    {/* this is the quize type and what no */}
                    <div className="container">
                        <div className="row">
                            <div className="col d-flex flex-column align-items-end p-2 my-2">
                                <span className="text-end fw-bold my-1"> Quiz Type </span>
                                <span className="text-end fw-bold my-1"> Points </span>
                                <span className="text-end fw-bold my-1"> Assignment Group </span>
                                <span className="text-end fw-bold my-1"> Shuffle Answers </span>
                                <span className="text-end fw-bold my-1"> Time Limit </span>
                                <span className="text-end fw-bold my-1"> Multiple Attempts </span>
                                <span className="text-end fw-bold my-1"> View Responses </span>
                                <span className="text-end fw-bold my-1"> Show Correct Answers </span>
                                <span className="text-end fw-bold my-1"> One Question at a Time </span>
                                <span className="text-end fw-bold my-1"> Require Respondus Lock Down </span>
                                <span className="text-end fw-bold my-1"> Browser </span>
                                <span className="text-end fw-bold my-1"> Required to View Quiz Result </span>
                                <span className="text-end fw-bold my-1"> Webcam Required </span>
                                <span className="text-end fw-bold my-1"> Lock Questions After Answering </span>
                            </div>

                            <div className="col d-flex flex-column align-items-start p-2 my-2">
                                <span className="text-start my-1"> Graded Quiz </span>
                                <span className="text-start my-1"> {quiz.points} </span>
                                <span className="text-start my-1"> QUIZZES </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> 30 Minutes </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> Always </span>
                                <span className="text-start my-1"> Immediately </span>
                                <span className="text-start my-1"> Yes </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> No </span>
                                <span className="text-start my-1"> No </span>
                            </div>
                        </div>
                    </div>

                    {/* this show due date for available from and until */}
                    
                <br />
            </div>
            ))}
        </div>
    )
}
