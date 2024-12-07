import { GrNotes } from "react-icons/gr";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState , useEffect } from "react";
import { FaCircle, FaPlus, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoEllipsisVertical } from "react-icons/io5";
import JsonStringify from "../../../labs/Lab3/JsonStringify";

import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import {setQuizzes, addQuiz, deleteQuiz, updateQuiz} from "./reducer"


export default function Quiz() {
    const { cid } = useParams();
    const dispatch = useDispatch();

    // const [quizTitle, setQuizTitle] = useState("");
    // const [quizDescription, setQuizDescription] = useState("");
    // const [quizPublish, setQuizPublish] = useState<Boolean | null>(null);
    // const [quizAttempts, setQuizAttempts] = useState<Number | null>(null);
    // const [quizAvailableDate, setQuizAvailableDate] = useState("");
    // const [quizAvailableUntilDate, setQuizAvailableUntilDate] = useState("");
    // const [quizPoints, setQuizPoints] = useState<Number | null>(null);
    // const [quizDueDate, setQuizDueDate] = useState("");
    // const [quizNumberOfQuestions, setQuizNumberOfQuestions] = useState<Number | null>(null);
    // const [quizTimeLimit, setQuizTimeLimit] = useState<Number | null>(null);
    
    const { quizzes = [] } = useSelector((state: any) => state.quizReducer || {});
    console.log("Quizzes in component:", quizzes);
    // set users
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const canEdit = ["FACULTY", "TA"].includes(currentUser?.role);

    // this is to fetch all the assignments for a course
    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
    };
    useEffect(() => {
        fetchQuizzes();
      }, []);
    console.log("Quizzes after set: ", quizzes)

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
                        <BsGripVertical className="me-2 fs-2" />
                        Quizzes
                    </div>
                    
                    {quizzes && (
                        <ul className="list-group rounded-0">
                            {quizzes.map((quiz: any) => (
                                    <li className="wd-quiz list-group-item p-3 ps-1">

                                        <div className="row">
                                            <div className="col-auto "
                                                style={{ margin: "auto" }}
                                            >
                                                <MdOutlineRocketLaunch className=" text-success fs-3 mg-left-3" />
                                            </div>
                                            <div className="col wd-fg-color-gray ps-0 ms-2">
                                                <Link
                                                    to={`/Kanbas/Courses/${cid}/Quizzes/${quizzes?.id}`}
                                                    className=" nav-link d-flex flex-row me-2 text-black bg-white"
                                                    style={{ fontSize: "16px", fontWeight: "bold" }}
                                                >
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

