import React, { useEffect, useState } from "react";
import QuizEditorMultipleChoice from "./QuizEditorType/QuizEditorMutlipleChoice";
import QuizEditorTrueFalse from "./QuizEditorType/QuizEditorTrueFalse";
import QuizEditorFillInTheBlank from "./QuizEditorType/QuizEditorFillInTheBlank";
import { Link, useLocation } from "react-router-dom";

import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";

type Question = {
  _id: string;
  courseId: string;
  quizId: string;
  title: string;
  type: string;
  question: string,
  Option: string[],
  answer: string[],
  points: number
};

export default function QuizEditor(
) {
    
    const {pathname} = useLocation();
    const quizId = pathname.split("/")[5]
    const courseId = pathname.split("/")[3]

    const [quiz, setQuiz] = useState<any>(null); // Local state to hold quiz data
    
    const fetchQuiz = async () => {
        try {
          const quizData = await quizzesClient.findQuizById(quizId as string);
          console.log('Set quiz in QuizEditor', quizData)
          setQuiz(quizData);
        } catch (error) {
          console.error("Failed to fetch quiz:", error);
        }
    };
    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    // this is all const related to adding new questions
    const [questions, setQuestions] = useState<Question[]>([]);
    const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);

    // this is used as id
    const question_length = Date.now()

    // Function to add a new question
    const addQuestion = () => {
        const newQuestion: Question = {
            _id: question_length.toString(),
            quizId: quizId,
            courseId: courseId,
            title: "",
            type: "Multiple Choice",
            question: "",
            Option: [],
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

    const saveQuestion = async (_id: string) => {
        const questionToSave = questions.find((q) => q._id === _id);
        if (questionToSave) {
            const savedData = await quizzesClient.createQuestionsForQuiz(questionToSave);
            console.log("successfully save question to db", savedData);
            setSavedQuestions([questionToSave, ...savedQuestions]); // Add saved question to the top
            // deleteQuestion(_id); // Remove from editable questions
        }
    };

    const cancelQuestion = async (_id: string) => {
        // call API to delete question
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== _id)
        );
    };

    const editQuestion = (_id: string) => {
        const questionToEdit = savedQuestions.find((q) => q._id === _id);
        if (questionToEdit) {
          setQuestions([...questions, questionToEdit]);
          setSavedQuestions((prevSavedQuestions) =>
            prevSavedQuestions.filter((question) => question._id !== _id)
          );
        }
    };

    const deleteSavedQuestion = async (_id: string) => {
        await quizzesClient.deleteQuestions(quizId, _id)
        setSavedQuestions((prevSavedQuestions) =>
          prevSavedQuestions.filter((question) => question._id !== _id)
        );
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
                            updateQuestionField(question._id, "Option", updatedOptions);
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
                        updateQuestionField(question._id, "Option", updatedOptions);
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

    return (
        <div>
            {quiz ? ( <h1>{quiz.title}</h1> ) : ( <p>Loading...</p> )}

            {savedQuestions.map((question, index) => (
                <div key={question._id} className="mb-3 p-3 border rounded bg-light">
                <h5>Question {question._id}</h5>
                    <p><strong>Type:</strong> {question.type}</p>
                    <p><strong>Question:</strong> {question.question}</p>
                    <button className="btn btn-warning me-2" onClick={() => editQuestion(question._id)}> Edit </button>
                    <button className="btn btn-danger" onClick={() => deleteSavedQuestion(question._id)}> Delete </button>
                </div>
            ))}
            
            <div className="container mt-4">
                <div className="d-flex flex-column align-items-center mt-5">
                    <button className="btn btn-secondary mb-4" onClick={addQuestion}> + Add Question </button>
                </div>
                
                {questions.map((question) => (
                    <div key={question._id} className="mb-3 p-3 border rounded">
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

                        <div id="wd-Assignment-controls" className="text-nowrap ">
                            <button id="wd-add-Assignment-btn" className="btn btn-success me-2" onClick={() => saveQuestion(question._id)}> Add </button>
                            <button id="wd-add-Assignment-btn" className="btn btn-danger" onClick={() => cancelQuestion(question._id)} > Cancel </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
