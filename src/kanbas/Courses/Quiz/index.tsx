import { GrNotes } from "react-icons/gr";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { FaCircle, FaPlus, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./quizReducer"


export default function Quiz() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { quizzes = [] } = useSelector((state: any) => state.quizReducerCreate || {});
    //console.log("Quizzes in component:", quizzes);
    // set users
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [latestAttempt, setLatestAttempt] = useState<any>({});
    const canEdit = ["FACULTY", "TA"].includes(currentUser?.role);

    const createNewQuiz = async () => {
        const newQuiz = {
            title: "New Quiz",
            description: "New Quiz Description",
            publish: false,
            attempts: 1,
            multipleAttempts: false,
            availableDate: new Date().toISOString().split('T')[0],
            availableUntilDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            points: 100,
            numberOfQuestions: 0,
            timeLimit: 20,
            quizType: "Graded Quiz",
            assignmentGroup: "Quizzes",
            shuffleAnswers: true,
            courseId: cid
        };
    
        try {
            const response = await coursesClient.createQuizForCourse(cid as string, newQuiz);
            dispatch(addQuiz(response));
            return response._id;
        } catch (error) {
            console.error("Error creating quiz:", error);
            return null;
        }
    };

    // this is to fetch all the assignments for a course
    const fetchQuizzes = async () => {
        
        if (currentUser.role === "STUDENT") {
            console.log(currentUser.role);
            const quizzes = await coursesClient.findPublishedQuizzesForCourse(cid as string);
            dispatch(setQuizzes(quizzes));
        }
        else {
            const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
            dispatch(setQuizzes(quizzes));
        }
    };
    const publishQuiz = async (quiz: any) => {
        const savedQuiz = await quizzesClient.updateQuiz({ ...quiz, publish: !quiz.publish });
        dispatch(updateQuiz(savedQuiz));

    };
    const removeQuiz = async (quizId: string) => {
        await quizzesClient.deleteQuiz(quizId);
        dispatch(deleteQuiz(quizId));
    };
    const [quizScores, setQuizScores] = useState<{ [key: string]: number }>({});

  const getlatestAttemptBYUIdandQId = async (qid: string) => {
    const latestAttempt = await quizzesClient.findLatestAttemptsbyUIdandQId(currentUser._id, qid);
    setLatestAttempt(latestAttempt);
    return latestAttempt ? latestAttempt.score : 0;
  };


    useEffect(() => {
        fetchQuizzes();
    }, [quizzes]);
    useEffect(() => {
        const fetchQuizScores = async () => {
          const scores: { [key: string]: number } = {};
          for (const quiz of quizzes) {
            const score = await getlatestAttemptBYUIdandQId(quiz._id);
            scores[quiz._id] = score;
          }
          setQuizScores(scores); // Update the scores state for all quizzes
        };
    
        if (quizzes.length > 0) {
          fetchQuizScores();
        }
      }, [quizzes, currentUser._id]);

    //console.log("Quizzes after set: ", quizzes)
    const tempAssignment = {
        id: new Date().getTime().toString(),
      };

    return (
        <div id="wd-quizzes">
            <div id="wd-quizzes-controls" className="text-nowrap d-flex">
                <input id="wd-search-quizzes" className=" form-control me-2" type="Search for Quiz"
                    placeholder="Search for quizzes" />
                <button 
                    id="wd-add-quizzes-btn" 
                    className="btn btn-lg btn-danger me-2 float-end"
                    onClick={async () => {
                        console.log("Creating new quiz...");
                        const newQuizId = await createNewQuiz();
                        console.log("New quiz ID:", newQuizId);
                        if (newQuizId) {
                            navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuizId}/edit`);
                        }
                    }}
                >
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    Quiz
                </button>
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
                                                to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                                                className=" nav-link d-flex flex-row me-2 text-black bg-white"
                                                style={{ fontSize: "21px" , lineHeight: "1.0"}}
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
                                                {` ${quiz.dueDate}  |  ${quiz.points  || 50 } pts  |   ${quiz.numberOfQuestions} Questions`}
                                            </span>
                                            {latestAttempt && (
                                                 <span style={{ fontSize: "16px", lineHeight: "1.0" }} className="text-muted" >
                                                 | Latest Score: {quizScores[quiz._id] || 0}
                                                </span>
                                            )}
                                           
                                        </div>

                                        {canEdit && (
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
                                                        <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`}
                                                            className="text-decoration-none text-dark dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}>
                                                            Edit
                                                        </Link>

                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => removeQuiz(quiz._id)}
                                                        >
                                                            Delete
                                                        </li>
                                                        <li
                                                            className="dropdown-item"
                                                            style={{ padding: "8px 15px", cursor: "pointer" }}
                                                            onClick={() => publishQuiz(quiz)}
                                                        >
                                                            {quiz.publish ? "Unpublish " : "Publish "}
                                                        </li>

                                                    </ul>
                                                </div>

                                            </div>
                                        )}
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
