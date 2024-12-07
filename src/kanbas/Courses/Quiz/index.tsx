import { GrNotes } from "react-icons/gr";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { FaCircle, FaPlus, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoEllipsisVertical } from "react-icons/io5";

export default function Quiz() {
    const Quiz = [{
        id: 1,
        title: "Q1",
        course: "RS101",
        detail: "",
        publish: true,
        attempts: 4,
        availableDate: "2024-10-01",
        availableUntilDate: "2024-12-30",
        dueDate: "2024-12-30",
        availableUntilDate: "2024-12-30",
        dueDate: "2024-12-30",
        points: 50,
        numberOfQuestion: 5
        numberOfQuestion: 5
    },
    {
        id: 2,
        title: "Q2",
        detail: "",
        course: "RS101",
        publish: false,
        publish: false,
        attempts: 4,
        availableDate: "2024-11-30",
        availableUntilDate: "2024-12-05",
        dueDate: "2024-12-01",
        points: 40,
        numberOfQuestion: 5
        numberOfQuestion: 5
    }]
    const [quizzes, setQuizzes] = useState<any[]>(Quiz);
    const { cid } = useParams();






    return (
        <div id="wd-quizzes">
            <div id="wd-quizzes-controls" className="text-nowrap d-flex">
                <input id="wd-search-quizzes" className=" form-control me-2" type="Search for Quiz"
                    placeholder="Search for quizzes" />
                <Link id="wd-add-quizzes-btn" className="btn btn-lg btn-danger me-2 float-end"
                    to={`/Kanbas/Courses`}
                >
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    quiz</Link>


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
                        <BsGripVertical className="me-2 fs-2" />
                        Quizzes
                        <BsGripVertical className="me-2 fs-2" />
                        Quizzes
                    </div>
                    {quizzes && (
                        <ul className="list-group rounded-0">
                            {quizzes
                                .filter(
                                    (quiz: any) =>
                                        quiz.course === cid
                                    (quiz: any) =>
                                        quiz.course === cid
                                )
                                .map((quiz: any) => (
                                    <li className="wd-quiz list-group-item p-3 ps-1">

                                .map((quiz: any) => (
                                    <li className="wd-quiz list-group-item p-3 ps-1">

                                        <div className="row">
                                            <div className="col-auto "
                                            <div className="col-auto "
                                                style={{ margin: "auto" }}
                                            >
                                                <MdOutlineRocketLaunch className=" text-success fs-3 mg-left-3" />
                                                <MdOutlineRocketLaunch className=" text-success fs-3 mg-left-3" />
                                            </div>
                                            <div className="col wd-fg-color-gray ps-0 ms-2">
                                                <Link
                                                    to={`/Kanbas/Courses/${cid}/Quizzes/${quiz?.id}`}
                                                    className=" nav-link d-flex flex-row me-2 text-black bg-white"
                                                    style={{ fontSize: "16px", fontWeight: "bold" }}
                                                >
                                                    {quiz.title}
                                                    {quiz.title}
                                                </Link>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }}>
                                                    {new Date() < new Date(quiz.availableDate)
                                                        ? "Not available until "
                                                        : new Date() >= new Date(quiz.availableDate) &&
                                                            new Date() <= new Date(quiz.availableUntilDate)
                                                            ? "Available"
                                                            : "Closed"}
                                                </span>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }} className="text-muted">
                                                    {new Date() < new Date(quiz.availableDate) ? quiz.availableDate : null}
                                                </span>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }}>
                                                    {` | Due`}
                                                </span>
                                                <span style={{ fontSize: "16px", lineHeight: "1.0" }} className="text-muted">
                                                    {` ${quiz.dueDate}  |  ${quiz.points} pts  |   ${quiz.numberOfQuestion} Questions`}
                                                </span>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }}>
                                                    {new Date() < new Date(quiz.availableDate)
                                                        ? "Not available until "
                                                        : new Date() >= new Date(quiz.availableDate) &&
                                                            new Date() <= new Date(quiz.availableUntilDate)
                                                            ? "Available"
                                                            : "Closed"}
                                                </span>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }} className="text-muted">
                                                    {new Date() < new Date(quiz.availableDate) ? quiz.availableDate : null}
                                                </span>
                                                <span style={{ fontSize: "17px", lineHeight: "1.0" }}>
                                                    {` | Due`}
                                                </span>
                                                <span style={{ fontSize: "16px", lineHeight: "1.0" }} className="text-muted">
                                                    {` ${quiz.dueDate}  |  ${quiz.points} pts  |   ${quiz.numberOfQuestion} Questions`}
                                                </span>
                                            </div>
                                            <div
                                                className="col-auto"
                                                style={{ margin: "auto" }}
                                            >
                                                <div className="float-end ">
                                                    <GreenCheckmark publish={!!quiz.publish} />
                                                    <button
                                                        className="btn  p-0 border-0"
                                                        data-bs-toggle="dropdown"

                                                    ><IoEllipsisVertical className=" fs-3 mg-left-3 " /></button>


                                                    <ul className="dropdown-menu">
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Edit")}
                                                        >
                                                            Edit
                                                        </li>
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Delete")}
                                                        >
                                                            Delete
                                                        </li>
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Publish/Unpublish")}
                                                        >
                                                            {quiz.publish ? "Unpublish " : "Publish "}
                                                        </li>

                                                    </ul>
                                                <div className="float-end ">
                                                    <GreenCheckmark publish={!!quiz.publish} />
                                                    <button
                                                        className="btn  p-0 border-0"
                                                        data-bs-toggle="dropdown"

                                                    ><IoEllipsisVertical className=" fs-3 mg-left-3 " /></button>


                                                    <ul className="dropdown-menu">
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Edit")}
                                                        >
                                                            Edit
                                                        </li>
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Delete")}
                                                        >
                                                            Delete
                                                        </li>
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => alert("Publish/Unpublish")}
                                                        >
                                                            {quiz.publish ? "Unpublish " : "Publish "}
                                                        </li>

                                                    </ul>
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
