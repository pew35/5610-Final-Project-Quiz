import { useLocation, Link } from "react-router-dom";
import React, {Suspense, useState} from "react";
import { useNavigate } from "react-router-dom";

import * as db from "../../Database";

import QuizEditorMultipleChoice from "./QuizEditorType/QuizEditorMutlipleChoice";
import QuizEditorTrueFalse from "./QuizEditorType/QuizEditorTrueFalse";
import QuizEditorFillInTheBlank from "./QuizEditorType/QuizEditorFillInTheBlank";

type Question = {
    id: number;
    text: string;
    type: string;
  };
  

export default function QuizEditor() {
    const {pathname} = useLocation();
    const quizzes = db.quizzes;
    const qid = pathname.split("/")[5]
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    console.log('parentPath', parentPath)
    console.log('pathname', parentPath)

    const [activeTab, setActiveTab] = useState("details");
    const [isEditing, setIsEditing] = useState(false);

    // this is for drop down question to pick what kind of quiz. ie multiple choice, true/false ...
    const [questionType, setQuestionType] = useState("Multiple Choice");
    const handleSelectChange = (event: any) => {
        setQuestionType(event.target.value);
    };


    const [questions, setQuestions] = useState<Question[]>([]); // Explicitly define the type

    // Add a new question to the list
    const handleAddQuestion = () => {
        setQuestions((prevQuestions) => [
        ...prevQuestions,
        { id: prevQuestions.length + 1, text: "", type: "Multiple Choice" },
        ]);
    };

    // Update question details
    const handleQuestionChange = (id: number, field: keyof Question, value: string) => {
        setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
            question.id === id ? { ...question, [field]: value } : question
        )
        );
    };

    // const [buttonText, setButtonText] = useState("+ New Question");
    // const navigate = useNavigate();

    
    // type Question = {
    //     id: number;
    //     text: string;
    //     type: string;
    //     options: string[];
    // };
    // const [questions, setQuestions] = useState<Question[]>([]);
    // const addNewQuestion = () => {
    //     const newQuestion = {
    //         id: questions.length + 1,
    //         text: "New Question",
    //         type: "Multiple Choice", // Default type
    //         options: ["Option 1", "Option 2", "Option 3", "Option 4"], // Default options
    //     };
    //     setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    //     setButtonText("Add Question");
    // };

    // const saveQuestions = () => {
    //     console.log("Saving questions:", questions);
    //     navigate(-1);
    // };



    return (
        <div>
            {quizzes.filter((quiz: any) => parseInt(quiz.id) === parseInt(qid)).map((quiz: any) => (
                <div id="wd-assignments-editor">
                    <h4>{quiz.title}</h4>
                    <div>
                        {/* thus us fir Points and Not Published */}
                        <span className="text-end">Points 0</span>
                    </div>
                    <hr/>

                    <div>
                        {/* Navigation Tabs */}
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "details" ? "active" : "text-danger"}`} href="#details" 
                                onClick={(e) => { 
                                    e.preventDefault();
                                    setActiveTab("details"); }} > Details </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === "questions" ? "active" : "text-danger"}`} href="#questions" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab("questions");
                                    }} > Questions </a>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="mt-3">
                        {activeTab === "details" && (
                                <div>
                                    <h4>Details</h4>
                                    <div className="container">
                                        {/* Quiz Name */}
                                        <div className="mb-3">
                                            <label htmlFor="quizName" className="form-label">Quiz Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="quizName"
                                                placeholder="Enter Quiz Name"
                                                defaultValue="Unnamed Quiz"
                                            />
                                        </div>

                                        {/* Quiz Instructions */}
                                        <div className="mb-3">
                                            <label htmlFor="quizInstructions" className="form-label">Quiz Instructions</label>
                                            <textarea
                                                className="form-control"
                                                id="quizInstructions"
                                                rows={5}
                                                placeholder="Write instructions here..."
                                            ></textarea>
                                        </div>

                                        {/* Quiz Type and Assignment Group */}
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="quizType" className="form-label">Quiz Type</label>
                                                <select id="quizType" className="form-select">
                                                    <option value="graded">Graded Quiz</option>
                                                    <option value="practice">Practice Quiz</option>
                                                    <option value="survey">Survey</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="assignmentGroup" className="form-label">Assignment Group</label>
                                                <select id="assignmentGroup" className="form-select">
                                                    <option value="assignments">Assignments</option>
                                                    <option value="exams">Exams</option>
                                                    <option value="projects">Projects</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Options */}
                                        <div className="mb-3">
                                            <label className="form-label">Options</label>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="shuffleAnswers"
                                                />
                                                <label htmlFor="shuffleAnswers" className="form-check-label">
                                                    Shuffle Answers
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="timeLimit"
                                                />
                                                <label htmlFor="timeLimit" className="form-check-label">
                                                    Time Limit
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control mt-2"
                                                    placeholder="Minutes"
                                                    style={{ width: "100px" }}
                                                    disabled
                                                />
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="multipleAttempts"
                                                />
                                                <label htmlFor="multipleAttempts" className="form-check-label">
                                                    Allow Multiple Attempts
                                                </label>
                                            </div>
                                        </div>

                                        {/* Assign Section */}
                                        <div className="mb-3">
                                            <h5>Assign</h5>
                                            <div className="mb-3">
                                                <label htmlFor="assignTo" className="form-label">Assign To</label>
                                                <select id="assignTo" className="form-select">
                                                    <option value="everyone">Everyone</option>
                                                    <option value="group1">Group 1</option>
                                                    <option value="group2">Group 2</option>
                                                </select>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="dueDate" className="form-label">Due</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="dueDate"
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="availableFrom" className="form-label">Available From</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="availableFrom"
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="availableUntil" className="form-label">Until</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="availableUntil"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save and Cancel Buttons */}
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-secondary me-2">Cancel</button>
                                            <button className="btn btn-danger">Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            
                            {activeTab === "questions" && (
                                <div className="container">
                                    {/* button to add new questions */}
                                    <div className="d-flex flex-column align-items-center mt-5">
                                        <button className="btn btn-secondary" onClick={handleAddQuestion}> + New Question </button>
                                    </div>

                                    {/* render questions */}
                                    <div className="mt-4">
                                        {questions.map((question) => (
                                            <div key={question.id} className="card mb-3">
                                                <div className="card-body">
                                                    {/* <div className="mb-3">
                                                    <label htmlFor={`questionText-${question.id}`} className="form-label"> Question Text </label>
                                                    </div> */}
                                                    <form className="row g-3">
                                            <div className="d-flex align-items-center  p-2 my-2">
                                                <div className="col-auto">
                                                    <input 
                                                        className="form-control" 
                                                        placeholder="Easy Question" 
                                                        // value={quizName} onChange={(e) => setQuizName(e.target.value)} 
                                                    />
                                                </div>
                                                <div className="col-auto wd-css-styling-dropdowns p-2 my-2">
                                                    <select className="form-select" onChange={handleSelectChange}>
                                                        <option value="Multiple Choice" selected>Multiple Choice</option>
                                                        <option value="True/False">True/False</option>
                                                        <option value="Fill in the Blank">Fill in the Blank</option>
                                                    </select> 
                                                </div>
                                                <div className="ms-auto text-end ms-2  p-2 my-2">
                                                    <span className="fw-bold">pts: </span>
                                                </div>
                                                <div className="col-auto  p-2 my-2">
                                                    <input 
                                                        className="form-control"
                                                        type="number"
                                                        id="points" 
                                                        placeholder="0" 
                                                        min="0"
                                                        // value={quizName} onChange={(e) => setQuizName(e.target.value)} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Display the selected question type */}
                                            <Suspense fallback={<div>Loading...</div>}>
                                                {questionType === "Multiple Choice" && <QuizEditorMultipleChoice />}
                                                {questionType === "True/False" && <QuizEditorTrueFalse />}
                                                {questionType === "Fill in the Blank" && <QuizEditorFillInTheBlank />}
                                            </Suspense>                                                                     
                                        </form>
                                    </div>
                                </div>                                                  
                            ))}
                        </div>
                    </div>
                            )}
                        </div>
                    </div>
                    <br/>
                    <hr/>

                    <div id="wd-Assignment-controls" className="text-nowrap ">
                        <Link id="wd-add-Assignment-btn" className="btn btn-lg btn-danger me-2 float-end"
                        // onClick={() => {
                        //     if (newAss) {
                        //         dispatch(addAssignment(assignment));
                        //     } else {
                        //         dispatch(updateAssignment(assignment));
                        //     }
                        //     console.log(assignment);
                        to={`${pathname}`} 
                            > Save </Link>

                        <Link id="wd-Group" className="btn btn-lg btn-secondary me-2 float-end" 
                        to={`${pathname}`}
                        >
                            Cancel
                        </Link>
                    </div>
                    
                </div>
                
                )
            )
            }
        </div>
    )
}
