import React, { useEffect, useState } from "react";
import QuizEditorMultipleChoice from "./QuizEditorType/QuizEditorMutlipleChoice";
import QuizEditorTrueFalse from "./QuizEditorType/QuizEditorTrueFalse";
import QuizEditorFillInTheBlank from "./QuizEditorType/QuizEditorFillInTheBlank";
import { Link, useLocation } from "react-router-dom";

import * as quizzesClient from "./client";
import {setQuizzes} from "./quizReducer"
import { useDispatch, useSelector } from "react-redux";

type Question = {
  id: number;
  text: string;
  type: string;
};

export default function QuizEditor() {
    
    const {pathname} = useLocation();
    // const quizzes = db.quizzes;
    const qid = pathname.split("/")[5]
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    const dispatch = useDispatch();

    const [quiz, setQuiz] = useState<any>(null); // Local state to hold quiz data
    const fetchQuiz = async () => {
        try {
          const quizData = await quizzesClient.findQuizById(qid as string);
          console.log('Set quiz in QuizEditor', quizData)
          setQuiz(quizData);
        } catch (error) {
          console.error("Failed to fetch quiz:", error);
        }
    };
    useEffect(() => {
        fetchQuiz();
    }, [qid]);

    // this is all const related to adding new questions
    const [questions, setQuestions] = useState<Question[]>([]);
    const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);

    // this is used as id
    const question_length = Date.now()

    // Function to add a new question
    const addQuestion = () => {
        const newQuestion: Question = {
        id: question_length,
        text: "",
        type: "Multiple Choice", // Default question type
        };
        setQuestions([...questions, newQuestion]);
    };

    // Function to handle changes in the question fields
    const handleQuestionChange = (
        id: number,
        key: keyof Question,
        value: string
    ) => {
        setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
            question.id === id ? { ...question, [key]: value } : question
        )
        );
    };

    const saveQuestion = (id: number) => {
        const questionToSave = questions.find((q) => q.id === id);
        if (questionToSave) {
          setSavedQuestions([questionToSave, ...savedQuestions]); // Add saved question to the top
          deleteQuestion(id); // Remove from editable questions
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

    // Render fields based on question type
    const renderQuestionTypeFields = (question: Question) => {
        switch (question.type) {
            case "Multiple Choice":
                return (
                    <QuizEditorMultipleChoice/>
                    );
            case "True/False":
                return ( 
                    <QuizEditorTrueFalse/> 
                );
            case "Fill in the Blank":
                return (
                <QuizEditorFillInTheBlank />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {quiz ? ( <h1>{quiz.title}</h1> ) : ( <p>Loading...</p> )}

            {savedQuestions.map((question, index) => (
                <div key={question.id} className="mb-3 p-3 border rounded bg-light">
                <h5>Question {question.id}</h5>
                    <p><strong>Type:</strong> {question.type}</p>
                    <p><strong>Text:</strong> {question.text}</p>
                    <button className="btn btn-warning me-2" onClick={() => editQuestion(question.id)}> Edit </button>
                    <button className="btn btn-danger" onClick={() => deleteSavedQuestion(question.id)}> Delete </button>
                </div>
            ))}
            
            <div className="container mt-4">
                <div className="d-flex flex-column align-items-center mt-5">
                    <button className="btn btn-secondary mb-4" onClick={addQuestion}> + Add Question </button>
                </div>
                
                {questions.map((question) => (
                    <div key={question.id} className="mb-3 p-3 border rounded">
                        <div className="card-body">
                            <form className="row g-3">
                                <div className="d-flex align-items-center  p-2 my-2">
                                    <div className="col-auto">
                                        <input type="text"
                                            id="questionTitle" 
                                            className="form-control" 
                                            placeholder="Easy Question"
                                            // onChange={(e) => setInputValue(e.target.value)}
                                        ></input>
                                    </div>

                                    {/* block for selecting questions type ie multiple choice, true/false, */}
                                    <div className="col-auto wd-css-styling-dropdowns p-2 my-2">
                                        <select
                                            value={question.type}
                                            onChange={(e) =>
                                            handleQuestionChange(question.id, "type", e.target.value)
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
                                            // value={quizName} onChange={(e) => setQuizName(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    
                    

                    {/* render question based on selected type */}
                    {renderQuestionTypeFields(question)}
                    
                        <br/>
                        <hr/>

                        <div id="wd-Assignment-controls" className="text-nowrap ">
                            <button id="wd-add-Assignment-btn" className="btn btn-success me-2" onClick={() => saveQuestion(question.id)}> Add </button>
                            <button id="wd-add-Assignment-btn" className="btn btn-danger" onClick={() => deleteQuestion(question.id)} > Cancel </button>
                        </div>


                    </div>


                ))}
            </div>
        </div>
        
    );
    };
function dispatch(arg0: { payload: any; type: "quizzes/setQuizzes"; }) {
    throw new Error("Function not implemented.");
}

