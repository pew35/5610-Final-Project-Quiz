import { GrNotes } from "react-icons/gr";
import { Link, useLocation, useParams } from "react-router-dom";
import * as db from "../../Database";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { FaCircle, FaPlus, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";

export default function Quiz() {
    const Quiz = [{
        id: 1,
        title: "Q1",
        course: "RS101",
        detail: "",
        publish: true,
        attempts: 4,
        availableDate: "2024-10-01",
        availableUntilDate: "2024-12-05",
        dueDate: "2024-12-01",
        points: 50,
    },
    {
        id: 2,
        title: "Q2",
        detail: "",
        course: "RS101",
        publish: true,
        attempts: 4,
        availableDate: "2024-11-30",
        availableUntilDate: "2024-12-05",
        dueDate: "2024-12-01",
        points: 40,
    }]
    const [quizzes, setQuizzes] = useState<any[]>(Quiz);
    const { cid } = useParams();
    


    return (
        <div id="wd-quizzes">
            <div id="wd-quizzes-controls" className="text-nowrap d-flex">
                <input id="wd-search-quizzes" className=" form-control me-2" type="Search for Quiz"
                    placeholder="Search for quizzes" />
                <Link id="wd-add-quizzes-btn" className="btn btn-lg btn-danger me-2 float-end"
                    to={`/Kanbas/Courses/`}
                >
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    quizzes</Link>


                <button id="wd-Group" className="btn btn-lg btn me-2 float-end">
                    <FaCircle className="text-white me-1 fs-6" />
                </button>
            </div>
            <hr />
            <br />
            <br />
            <br />
            <br />
            
            <ul id="wd-quizzes" className="list-group rounded-0">
                <li className="wd-quizzes list-group-item p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" />
                        Assignment Quizzes
                    </div>

                    {quizzes && (
                        <ul className="list-group rounded-0">
                            {quizzes
                                .filter(
                                    (quizzes: any) =>
                                        quizzes.course === cid
                                )
                                .map((quizzes: any) => (

                                    <li className=" list-group-item p-3 ps-1">
                                        <div className="row">
                                            <div className="col-auto"
                                                style={{ margin: "auto" }}
                                            >
                                                
                                                <GrNotes className=" text-success fs-3 mg-left-3" />
                                            </div>
                                            <div className="col wd-fg-color-gray ps-0 ms-2">
                                                <Link
                                                    to={`/Kanbas/Courses/${cid}/Quizzes/${quizzes?.id}`}
                                                    className=" nav-link d-flex flex-row me-2 text-black bg-white"
                                                    style={{ fontSize: "16px", fontWeight: "bold" }}
                                                >
                                                    {quizzes.title}
                                                </Link>
                                                {`Not available until ${quizzes.availableDate} | Due ${quizzes.dueDate}| ${quizzes.points} pts`}
                                            </div>
                                            <div
                                                className="col-auto"
                                                style={{ margin: "auto" }}
                                            >
                                                <div className="float-end">
                                                    <GreenCheckmark />
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </li>
                                    
                                ))}
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
}

