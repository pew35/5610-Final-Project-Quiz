import React, { useState } from "react";
import QuizEditorMultipleChoice from "./QuizEditorType/QuizEditorMutlipleChoice";
import QuizEditorTrueFalse from "./QuizEditorType/QuizEditorTrueFalse";
import QuizEditorFillInTheBlank from "./QuizEditorType/QuizEditorFillInTheBlank";
import { Link, useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import * as db from "../../Database";

type Question = {
  id: number;
  text: string;
  type: string;
};

export default function QuizEditor() {
  const { pathname } = useLocation();
  const quizzes = db.quizzes;
  const qid = pathname.split("/")[5];
  const parentPath = pathname.split("/").slice(0, -1).join("/");
  console.log("parentPath", parentPath);
  console.log("pathname", parentPath);

  const [activeTab, setActiveTab] = useState("details");
  const [instructions, setInstructions] = useState("");
  const handleEditorChange = (content: string) => {
    setInstructions(content);
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);

  const question_length = Date.now();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: question_length,
      text: "",
      type: "Multiple Choice",
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (id: number, key: keyof Question, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, [key]: value } : question
      )
    );
  };

  const saveQuestion = (id: number) => {
    const questionToSave = questions.find((q) => q.id === id);
    if (questionToSave) {
      setSavedQuestions([questionToSave, ...savedQuestions]);
      deleteQuestion(id);
    }
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };

  const editQuestion = (id: number) => {
    const questionToEdit = savedQuestions.find((q) => q.id === id);
    if (questionToEdit) {
      setQuestions([...questions, questionToEdit]);
      setSavedQuestions((prevSavedQuestions) =>
        prevSavedQuestions.filter((question) => question.id !== id)
      );
    }
  };

  const deleteSavedQuestion = (id: number) => {
    setSavedQuestions((prevSavedQuestions) =>
      prevSavedQuestions.filter((question) => question.id !== id)
    );
  };

  const renderQuestionTypeFields = (question: Question) => {
    switch (question.type) {
      case "Multiple Choice":
        return <QuizEditorMultipleChoice />;
      case "True/False":
        return <QuizEditorTrueFalse />;
      case "Fill in the Blank":
        return <QuizEditorFillInTheBlank />;
      default:
        return null;
    }
  };

  return (
    <div>
      {quizzes
        .filter((quiz: any) => parseInt(quiz.id) === parseInt(qid))
        .map((quiz: any) => (
          <div id="wd-assignments-editor" key={quiz.id}>
            <h2>{quiz.title}</h2>
            <hr />
          </div>
        ))}

      <div>
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "details" ? "active" : ""}`}
              href="#details"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("details");
              }}
            >
              Details
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
              href="#questions"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("questions");
              }}
            >
              Questions
            </a>
          </li>
        </ul>
      </div>

      <br />

      {activeTab === "details" && (
        <div>
            <div className="container">
                {/* Quiz Name */}
                <div className="mb-3">
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
                    <label htmlFor="quizInstructions" className="form-label">
                        Quiz Instructions
                    </label>
                    <Editor
                        id="quizInstructions"
                        apiKey="YOUR_TINY_MCE_API_KEY"
                        value={instructions} 
                        onEditorChange={handleEditorChange} 
                        init={{
                            height: 300,
                            menubar: true,
                            plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                                "undo redo | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help",
                        }}
                    />
                </div>

                {/* Quiz Type and Assignment Group */}
                <div className="mb-3">
                    {/* Quiz Type */}
                    <div className="d-flex align-items-center mb-3" style={{ width: "400px" }}>
                        <label
                            htmlFor="quizType"
                            className="form-label me-3"
                            style={{ width: "120px", textAlign: "right" }} 
                        >
                            Quiz Type
                        </label>
                        <select
                            id="quizType"
                            className="form-select"
                            defaultValue="graded"
                            style={{ flex: 1 }} 
                        >
                            <option value="graded">Graded Quiz</option>
                            <option value="practice">Practice Quiz</option>
                            <option value="gradedSurvey">Graded Survey</option>
                            <option value="ungradedSurvey">Ungraded Survey</option>
                        </select>
                    </div>

                    {/* Assignment Group */}
                    <div className="d-flex align-items-center" style={{ width: "400px" }}>
                        <label
                            htmlFor="assignmentGroup"
                            className="form-label me-3"
                            style={{ width: "120px", textAlign: "right" }} 
                        >
                            Assignment Group
                        </label>
                        <select
                            id="assignmentGroup"
                            className="form-select"
                            defaultValue="Assignments"
                            style={{ flex: 1 }} 
                        >
                            <option value="quizzes">Quizzes</option>
                            <option value="exams">Exams</option>
                            <option value="assignments">Assignments</option>
                            <option value="projects">Project</option>
                        </select>
                    </div>
                </div>

                                                    {/* Options Section */}
                                                    <div className="mb-3">
                <label className="form-label fw-bold" style={{ marginLeft: "120px" }}>
                    Options
                </label>

                {/* Shuffle Answers */}
                <div className="d-flex align-items-center mb-3" style={{ width: "400px", marginLeft: "120px" }}>
                    <input
                        type="checkbox"
                        className="form-check-input me-3"
                        id="shuffleAnswers"
                    />
                    <label htmlFor="shuffleAnswers" className="form-check-label mb-0">
                        Shuffle Answers
                    </label>
                </div>

                {/* Time Limit */}
                <div className="d-flex align-items-center mb-3" style={{ width: "400px", marginLeft: "120px" }}>
                    <input
                        type="checkbox"
                        className="form-check-input me-3"
                        id="timeLimit"
                    />
                    <label htmlFor="timeLimit" className="form-check-label mb-0 me-2">
                        Time Limit
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Minutes"
                        style={{ width: "100px" }}
                    />
                    <span className="ms-2">Minutes</span>
                </div>

                {/* Allow Multiple Attempts */}
                <div className="d-flex align-items-center" style={{ width: "400px", marginLeft: "120px" }}>
                    <div
                        className="border p-2"
                        style={{
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            id="multipleAttempts"
                        />
                        <label htmlFor="multipleAttempts" className="form-check-label mb-0">
                            Allow Multiple Attempts
                        </label>
                    </div>
                </div>
            </div>



                {/* Assign Section */}
                <div
                    className="border p-4 mt-4"
                    style={{
                        borderRadius: "8px",
                        width: "400px",
                        marginLeft: "120px", 
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
                    }}
                >
                    <label className="form-label fw-bold mb-3">Assign</label>

                    {/* Assign To */}
                    <div className="mb-3">
                        <label htmlFor="assignTo" className="form-label">Assign to</label>
                        <select
                            id="assignTo"
                            className="form-select"
                            defaultValue="everyone"
                        >
                            <option value="everyone">Everyone</option>
                            <option value="group1">Group 1</option>
                            <option value="group2">Group 2</option>
                        </select>
                    </div>

                    {/* Due */}
                    <div className="mb-3">
                        <label htmlFor="dueDate" className="form-label">Due</label>
                        <input
                            type="date"
                            id="dueDate"
                            className="form-control"
                        />
                    </div>

                    {/* Available From and Until */}
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="availableFrom" className="form-label">Available from</label>
                            <input
                                type="date"
                                id="availableFrom"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="availableUntil" className="form-label">Until</label>
                            <input
                                type="date"
                                id="availableUntil"
                                className="form-control"
                            />
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="d-flex justify-content-center mt-3">
                        <button className="btn btn-outline-secondary w-100">+ Add</button>
                    </div>
                </div>
                                                        

            </div>
        </div>
      )}




      {activeTab === "questions" && (
        <div>
          {/* Saved Questions */}
          <h4>Saved Questions</h4>
          {savedQuestions.map((question, index) => (
            <div key={question.id} className="mb-3 p-3 border rounded bg-light">
              <h5>Question {index + 1}</h5>
              <p>
                <strong>Type:</strong> {question.type}
              </p>
              <p>
                <strong>Text:</strong> {question.text}
              </p>
              <button
                className="btn btn-warning me-2"
                onClick={() => editQuestion(question.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteSavedQuestion(question.id)}
              >
                Delete
              </button>
            </div>
          ))}

          {/* Editable Questions */}
          <div className="container mt-4">
            <div className="d-flex flex-column align-items-center mt-5">
              <button className="btn btn-secondary mb-4" onClick={addQuestion}>
                + Add Question
              </button>
            </div>
            {questions.map((question) => (
              <div key={question.id} className="mb-3 p-3 border rounded">
                <div className="card-body">
                  <form className="row g-3">
                    <div className="d-flex align-items-center p-2 my-2">
                      <div className="col-auto">
                        <input
                          type="text"
                          id="questionTitle"
                          className="form-control"
                          placeholder="Enter Question Text"
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(question.id, "text", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-auto wd-css-styling-dropdowns p-2 my-2">
                        <select
                          value={question.type}
                          onChange={(e) =>
                            handleQuestionChange(question.id, "type", e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="Multiple Choice">Multiple Choice</option>
                          <option value="True/False">True/False</option>
                          <option value="Fill in the Blank">Fill in the Blank</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                {renderQuestionTypeFields(question)}
                <hr />
                <div id="wd-Assignment-controls" className="text-nowrap">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => saveQuestion(question.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
