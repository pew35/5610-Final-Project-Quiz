import React, { useEffect, useState } from "react";
import QuizEditorMultipleChoice from "./QuizEditorType/QuizEditorMutlipleChoice";
import QuizEditorTrueFalse from "./QuizEditorType/QuizEditorTrueFalse";
import QuizEditorFillInTheBlank from "./QuizEditorType/QuizEditorFillInTheBlank";
import { Link, useLocation, useNavigate } from "react-router-dom";

import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

type Question = {
  _id: string;
  courseId: string;
  quizId: string;
  title: string;
  type: string;
  question: string,
  option: string[],
  answer: string[],
  points: number
};


type Quiz = {
    _id?: string;
    title: string;
    description: string;
    instructions: string;
    publish: boolean;
    attempts: number;
    multipleAttempts: boolean;
    availableDate: string;
    availableUntilDate: string;
    dueDate: string;
    points: number;
    numberOfQuestions: number;
    timeLimit: number;
    quizType: string;
    assignmentGroup: string;
    shuffleAnswers: boolean;
    courseId?: string;
};


export default function QuizEditor(
) {
    
    const {pathname} = useLocation();
    const quizId = pathname.split("/")[5]
    const courseId = pathname.split("/")[3]
    const cid = pathname.split("/")[3]
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<any>(null); // Local state to hold quiz data
    
    const fetchQuiz = async () => {
        try {
            const quizData = await quizzesClient.findQuizById(quizId as string);
            if (quizData) {
                const quizData = await quizzesClient.findQuizById(quizId as string);
                console.log('Set quiz in QuizEditor', quizData)
                setQuiz(quizData);
                setQuizDetails({
                    ...quizData,
                    title: quizData.title || "new quiz",
                    description: quizData.description || "new quiz description",
                    instructions: quizData.instructions || "",
                    attempts: quizData.attempts || 1,
                    multipleAttempts: quizData.multipleAttempts || false,
                    availableDate: quizData.availableDate || "",
                    availableUntilDate: quizData.availableUntilDate || "",
                    dueDate: quizData.dueDate || "",
                    points: quizData.points || 0,
                    numberOfQuestions: quizData.numberOfQuestions || 0,
                    timeLimit: quizData.timeLimit || 20,
                    quizType: quizData.quizType || "Graded Quiz",
                    assignmentGroup: quizData.assignmentGroup || "Quizzes",
                    shuffleAnswers: quizData.shuffleAnswers || true,
                });

                // Initialize questions only once when fetching quiz data
                setQuestions(quizData.questions || []);
            }
        } catch (error) {
            console.error("Failed to fetch quiz:", error);
        }
    };
    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const [activeTab, setActiveTab] = useState("details");
    const [instructions, setInstructions] = useState("");


    const [quizDetails, setQuizDetails] = useState<Quiz>({
        _id: quizId,
        title: "new quiz",
        description: "new quiz description",
        instructions: "",
        publish: false,
        attempts: 1,
        multipleAttempts: false,
        availableDate: "",
        availableUntilDate: "",
        dueDate: "",
        points: 100,
        numberOfQuestions: 0,
        timeLimit: 20,
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
    });

      const handleEditorChange = (content: string) => {
        setQuizDetails((prev) => ({ ...prev, instructions: content }));
      };
    
      const handleInputChange = (field: keyof Quiz, value: string | number | boolean) => {
        setQuizDetails((prev) => ({
          ...prev,
          [field]: value,
        }));
      };
    
      // need to modify for the backend
      const handleSaveQuizDetails = async () => {
        try {
            const updatedQuizData = {
                ...quizDetails,
                _id: quizId,
                courseId: cid,
            };
            
            const updatedQuiz = await quizzesClient.updateQuiz(updatedQuizData);
            console.log("Quiz saved successfully:", updatedQuiz);
            
            // Navigate back to quiz details page
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}`);
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    };

    // this is all const related to adding new questions
    const [questions, setQuestions] = useState<Question[]>([]);
    const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    // this is used as id
    const question_length = Date.now()

    // Function to add a new question
    const addQuestion = () => {
        const newQuestion: Question = {
            _id: question_length.toString(),
            quizId: quizId,
            courseId: courseId,
            title: "new question",
            type: "Multiple Choice",
            question: "",
            option: [],
            answer: [],
            points: 0,
        };
        setQuestions([...questions, newQuestion]);
    };

    // Function to handle changes in the question fields
    const handleQuestionChange = (
        _id: string,
        key: keyof Question,
        value: string
    ) => {
        setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
            question._id === _id ? { ...question, [key]: value } : question
        )
        );
    };

    const saveQuestion = async (_id: string, quizId: string) => {
        const questionToSave = questions.find((q) => q._id === _id);
        if (questionToSave) {
            const savedData = await quizzesClient.createQuestionsForQuiz(questionToSave, quizId);
            console.log("successfully save question to db", savedData);
            setSavedQuestions([questionToSave, ...savedQuestions]); // Add saved question to the top
        }
    };

    const cancelQuestion = async (_id: string) => {
        // this is not deleting question, this is cancalling a question so no need to call any api
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== _id)
        );
        window.location.reload();
    };

    const editQuestion = (_id: string) => {
        console.log("Editting question id: ", _id)
        setEditingQuestionId(_id);
        const questionToEdit = savedQuestions.find((q) => q._id === _id);
        if (questionToEdit) {
          setQuestions([...questions, questionToEdit]);
          setSavedQuestions((prevSavedQuestions) =>
            prevSavedQuestions.filter((question) => question._id !== _id)
          );
        }
    };

    const updateQuestion = async (_id: string) => {
        const questionToSave = questions.find((q) => q._id === _id);
        if (questionToSave) {
            const savedData = await quizzesClient.updateQuestionsForQuiz(quizId, _id, questionToSave);
            setSavedQuestions([questionToSave, ...savedQuestions]);
            console.log("successfully save question to db", questionToSave);
        }
    }

    const deleteSavedQuestion = async (questionId: string) => {
        try {
            const response = await quizzesClient.deleteQuestions(quizId, questionId); // Replace with your actual API function
            if (response.success) {
                console.log("Successfully deleted question:", questionId);
                // Update state to reflect deletion
                setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId) );
            } else {
                console.error("Delete operation failed:", response.message);
                alert("Failed to delete the question. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("An error occurred while deleting the question. Please try again.");
        }
    };
    

    // Render fields based on question type
    const renderQuestionTypeFields = (question: Question, updateQuestionField: (_id: string, key: keyof Question, value: any) => void ) => {
        switch (question.type) {
            case "Multiple Choice":
                return (
                    <QuizEditorMultipleChoice
                        question = {question}
                        onChange = { (updatedQuestions, updatedOptions, updatedAnswers) => {
                            updateQuestionField(question._id, "question", updatedQuestions);
                            updateQuestionField(question._id, "option", updatedOptions);
                            updateQuestionField(question._id, "answer", updatedAnswers);
                        } }
                    />
                    );
            case "True/False":
                return ( 
                    <QuizEditorTrueFalse
                    question={question}
                    onChange={(updatedQuestions, updatedOptions, updatedAnswers) => {
                        updateQuestionField(question._id, "question", updatedQuestions);
                        updateQuestionField(question._id, "option", updatedOptions);
                        updateQuestionField(question._id, "answer", updatedAnswers);
                    }}/> 
                );
            case "Fill in the Blank":
                return (
                <QuizEditorFillInTheBlank 
                question={question}
                onChange={(updatedText, updatedAnswers) => {
                    updateQuestionField(question._id, "question", updatedText);
                    updateQuestionField(question._id, "answer", updatedAnswers);
                    }}/>
                );
            default:
                return null;
        }
    };

    const updateQuestionField = (_id: string, key: keyof Question, value: any) => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === _id ? { ...question, [key]: value } : question
          )
        );
    };

    // Add function to fetch questions when quiz loads
    const fetchQuestions = async () => {
        try {
            const questions = await quizzesClient.findQuestionsByQuiz(quizId);
            setSavedQuestions(questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    // Update useEffect to fetch questions along with quiz
    useEffect(() => {
        fetchQuiz();
        fetchQuestions();
    }, [quizId]);

    return (
        <div>
            {quiz ? ( <h1>{quiz.title}</h1> ) : ( <p>Loading...</p> )}


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
                    value={quizDetails.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
            </div>

            {/* Quiz Instructions */}
            <div className="mb-3">
                <label htmlFor="quizInstructions" className="form-label">
                    Quiz Instructions
                </label>
                <Editor
                    id="quizInstructions"
                    apiKey="61tax40fwjpbnnhv9pykff9yqgqxk35s0sgmu8w1sogw4vuq"
                    value={quizDetails.instructions}
                    onEditorChange={handleEditorChange}
                    init={{
                        height: 400,
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
                        value={quizDetails.quizType || "Graded Quiz"} // Bind to state
                        onChange={(e) =>
                        handleInputChange("quizType", e.target.value) // Update quizType in state
                        }
                        style={{ flex: 1 }}
                    >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
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
                        value={quizDetails.assignmentGroup || "Quizzes"} // Bind to state
                        onChange={(e) =>
                        handleInputChange("assignmentGroup", e.target.value) // Update assignmentGroup in state
                        }
                        style={{ flex: 1 }}
                    >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
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
                    checked={quizDetails.shuffleAnswers || false} // Bind to state
                    onChange={(e) =>
                    handleInputChange("shuffleAnswers", e.target.checked) // Update state
                    }
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
                id="timeLimitToggle"
                checked={quizDetails.timeLimit > 0} // Checked if timeLimit is greater than 0
                onChange={(e) => {
                // If unchecked, set timeLimit to 0; otherwise, enable input
                handleInputChange("timeLimit", e.target.checked ? 1 : 0);
                }}
            />
            <label htmlFor="timeLimitToggle" className="form-check-label mb-0 me-2">
                Time Limit
            </label>
            {quizDetails.timeLimit > 0 && ( // Show the input only if the checkbox is checked
                <>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Minutes"
                    value={quizDetails.timeLimit}
                    onChange={(e) =>
                    handleInputChange("timeLimit", parseInt(e.target.value) || 0)
                    }
                    style={{ width: "100px" }}
                />
                <span className="ms-2">Minutes</span>
                </>
            )}
            </div>


            {/* Allow Multiple Attempts */}
            <div className="d-flex flex-column mb-3" style={{ width: "400px", marginLeft: "120px" }}>
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
                    checked={quizDetails.multipleAttempts || false} // Bind to state
                    onChange={(e) =>
                        handleInputChange("multipleAttempts", e.target.checked) // Update state
                    }
                    />
                    <label htmlFor="multipleAttempts" className="form-check-label mb-0">
                    Allow Multiple Attempts
                    </label>
                </div>

                {quizDetails.multipleAttempts && ( // Show input if multiple attempts are allowed
                    <div className="mt-2">
                    <label htmlFor="attempts" className="form-label">
                        Number of Attempts
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="attempts"
                        placeholder="Enter number of attempts"
                        value={quizDetails.attempts || 0} // Bind to state
                        onChange={(e) =>
                        handleInputChange("attempts", parseInt(e.target.value) || 0) // Update state
                        }
                        min={1} // Prevent invalid negative values
                        style={{ width: "100px" }}
                    />
                    </div>
                )}
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

                {/* Due Date */}
                <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    className="form-control"
                    value={quizDetails.dueDate || ""} // Bind to state
                    onChange={(e) =>
                    handleInputChange("dueDate", e.target.value) // Update state
                    }
                />
                </div>

                {/* Available From and Until */}
                <div className="row">
                <div className="col-md-6">
                    <label htmlFor="availableFrom" className="form-label">Available From</label>
                    <input
                    type="date"
                    id="availableFrom"
                    className="form-control"
                    value={quizDetails.availableDate || ""} // Bind to state
                    onChange={(e) =>
                        handleInputChange("availableDate", e.target.value) // Update state
                    }
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="availableUntil" className="form-label">Available Until</label>
                    <input
                    type="date"
                    id="availableUntil"
                    className="form-control"
                    value={quizDetails.availableUntilDate || ""} // Bind to state
                    onChange={(e) =>
                        handleInputChange("availableUntilDate", e.target.value) // Update state
                    }
                    />
                </div>
                </div>

                {/* Add Button */}
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-outline-secondary w-100">+ Add</button>
                </div>
            </div>
                <hr />
            <div className="d-flex justify-content-center mt-4">
                {/* Cancel Button */}
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => {
                    // Navigate to Quiz List screen without saving
                    window.location.href = "/quiz-list"; // Replace with your route for the Quiz List screen
                    }}
                >
                    Cancel
                </button>

                {/* Save Button */}
                <button
                    className="btn btn-danger me-2"
                    onClick={handleSaveQuizDetails}
                >
                    Save
                </button>

                {/* Save and Publish Button */}     
            {/*                     <button
                    className="btn btn-primary"
                    onClick={() => {
                    handleSaveAndPublishQuiz(); // Save and publish the quiz
                    window.location.href = "/quiz-list"; // Replace with your route for the Quiz List screen
                    }}
                >
                    Save and Publish
                </button> */}
            </div>
                                                    

        </div>
    </div>
  )}

    {activeTab === "questions" && (
        <div>
            {savedQuestions.map((question, index) => (
                <div key={question._id} className="mb-3 p-3 border rounded bg-light">
                <h5>Question {question.title}</h5>
                    <p><strong>Type:</strong> {question.type}</p>
                    <p><strong>Question:</strong> {question.question}</p>
                    <button className="btn btn-warning me-2" onClick={() => editQuestion(question._id)}> Edit </button>
                    {/* force reload cause for some reason the questions does not get updated though it is reflected in DB that is it deleted */}
                    <button className="btn btn-danger" onClick={() => { deleteSavedQuestion(question._id); window.location.reload(); }}> Delete </button>
                </div>
            ))}
            
            <div className="container mt-4">
                <div className="d-flex flex-column align-items-center mt-5">
                    <button className="btn btn-secondary mb-4" onClick={addQuestion}> + Add Question </button>
                </div>
                
                {questions.map((question) => (
                    <div key={question.title} className="mb-3 p-3 border rounded">
                        <div className="card-body">
                            <form className="row g-3">
                                <div className="d-flex align-items-center  p-2 my-2">
                                    <div className="col-auto">
                                        <input type="text"
                                            id="questionTitle" 
                                            className="form-control" 
                                            placeholder="Easy Question"
                                            onChange={(e) =>
                                                updateQuestionField(question._id, "title", e.target.value)
                                            }
                                        ></input>
                                    </div>

                                    {/* block for selecting questions type ie multiple choice, true/false, */}
                                    <div className="col-auto wd-css-styling-dropdowns p-2 my-2">
                                        <select
                                            value={question.type}
                                            onChange={(e) =>
                                            handleQuestionChange(question._id, "type", e.target.value)
                                            }
                                            className="form-select">
                                            <option value="Multiple Choice">Multiple Choice</option>
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
                                            onChange={(e) =>
                                                updateQuestionField(question._id, "points", parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    
                    

                    {/* render question based on selected type */}
                    {renderQuestionTypeFields(question, updateQuestionField)}
                    
                        <br/>
                        <hr/>
                        {editingQuestionId === null && (
                            <div id="wd-Assignment-controls" className="text-nowrap ">
                                <button id="wd-add-Assignment-btn" className="btn btn-success me-2" onClick={() => saveQuestion(question._id, quizId)}> Add </button>
                                <button id="wd-add-Assignment-btn" className="btn btn-danger" onClick={() => cancelQuestion(question._id)} > Cancel </button>
                            </div>
                        )}

                        {
                            editingQuestionId && (
                                <div id="wd-Assignment-controls" className="text-nowrap ">
                                    <button id="wd-add-Assignment-btn" className="btn btn-success me-2" onClick={() => {updateQuestion(question._id); window.location.reload()}}> Update </button>
                                    <button id="wd-add-Assignment-btn" className="btn btn-danger" onClick={() => cancelQuestion(question._id)} > Cancel </button>
                                </div>
                            )
                        }
                        
                    </div>
                ))}
                    </div>
                </div>
            )}
        </div>
    );
};
