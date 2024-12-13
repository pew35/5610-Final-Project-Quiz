import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {useEffect, useState} from "react";

import * as client from "./client";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./quizReducer"

export default function QuizDetailScreen() {
    interface Question {
        _id: string;
        quizId: string;
        question: string;
        type: string;
        points: number;
        answer: string;
        option: string[];  // Array of options
    }

    interface QuizDetails {
        quizType: string;
        points: number;
        assignmentGroup: string;
        shuffleAnswers: string;
        timeLimit: string;
        multipleAttempts: string;
        viewResponses: string;
        showCorrectAnswers: string;
        oneQuestionAtATime: string;
        requireRespondusLockDown: string;
        requiredToViewResults: string;
        webcamRequired: string;
        lockQuestionsAfterAnswering: string;
        dueDate: string;
        availableFrom: string;
        availableUntil: string;
        forWho: string;
        title: string;
        attempts: number;
        questionsCount: number;
        availableDate: string;
        availableUntilDate: string;
    }
    
    
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const qid = pathname.split("/")[5];
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { quizzes = [] } = useSelector((state: any) => state.quizReducerCreate || {});
    const { questions = [] } = useSelector((state: any) => state.questions || { questions: [] });
    const { quizStatuses = {} } = useSelector((state: any) => state.quizReducer || {});

    const [userAttempts, setAttempts] = useState<any[]>([]); // attempts found by user id and quiz id
    const [latestAttempt, setLatestAttempt] = useState<any>({}); // lstest attempt found by user id and quiz id
    const [latestAnswers, setLatestAnswers] = useState<any[]>([]); // dont know what this is
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const quiz = quizzes.find((q: any) => q._id === qid);
    const [localQuestions, setLocalQuestions] = useState<any[]>([]);
    //const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [quizDetails, setQuizDetails] = useState<QuizDetails>({
        quizType: "Graded Quiz",
        points: 29,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: "No",
        timeLimit: "30 Minutes",
        multipleAttempts: "No",
        viewResponses: "Always",
        showCorrectAnswers: "Immediately",
        oneQuestionAtATime: "Yes",
        requireRespondusLockDown: "No",
        requiredToViewResults: "No",
        webcamRequired: "No",
        lockQuestionsAfterAnswering: "No",
        dueDate: "Sep 21 at 1pm",
        availableFrom: "Sep 21 at 11:40am",
        availableUntil: "Sep 21 at 1pm",
        forWho: "Everyone",
        title: "Q1 - HTML",
        attempts: 0,
        questionsCount: 0,
        availableDate: "",
        availableUntilDate: ""
    });

    
    const getAttemptsbyUIdandQId = async () => {
        console.log("Attempt found: ", currentUser._id, qid)
        const userattempts = await client.findAttemptsbyUIdandQId(currentUser._id, qid);
        if (userattempts.length > 0) {
            getlatestAttemptBYUIdandQId();
            fetchlatestAnswers();
            
        }
        setAttempts(userattempts);
    }
    const getlatestAttemptBYUIdandQId = async () => {
        const latestAttempt = await client.findLatestAttemptsbyUIdandQId(currentUser._id, qid);
        setLatestAttempt(latestAttempt);
    }

    const fetchQuizData = async () => {
        try {
            const quizQuestions = await client.findQuestionsByQuiz(qid);   
            setLocalQuestions(quizQuestions);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } 
    };

    const fetchlatestAnswers = async () => {
        const answers = await client.findAttemptsAnswers(latestAttempt._id);
        setLatestAnswers(answers);
    }

    const fetchAllQuizData = async () => {
        try {
            setLoading(true);
            
            // 获取测验数据
            const quiz = await client.findQuizById(qid);
            if (quiz) {
                setQuizDetails({
                    ...quizDetails,
                    quizType: quiz.quizType || "Graded Quiz",
                    points: quiz.points || 50,
                    assignmentGroup: quiz.assignmentGroup || "QUIZZES",
                    shuffleAnswers: quiz.shuffleAnswers ? "Yes" : "No",
                    timeLimit: `${quiz.timeLimit || 20} Minutes`,
                    title: quiz.title || "Quiz",
                    dueDate: quiz.dueDate || "",
                    availableFrom: quiz.availableDate || "",
                    availableUntil: quiz.availableUntilDate || "",
                    attempts: quiz.attempts || 0,
                    questionsCount: quiz.questionsCount || 0,
                    availableDate: quiz.availableDate || "",
                    availableUntilDate: quiz.availableUntilDate || ""
                });
            }

            // 获取问题数据
            const quizQuestions = await client.findQuestionsByQuiz(qid);
            setLocalQuestions(quizQuestions || []);

            // 获取尝试记录
            if (currentUser?._id) {
                const attempts = await client.findAttemptsbyUIdandQId(currentUser._id, qid);
                setAttempts(attempts || []);

                if (attempts?.length > 0) {
                    const latest = await client.findLatestAttemptsbyUIdandQId(currentUser._id, qid);
                    setLatestAttempt(latest || {});

                    if (latest?._id) {
                        const answers = await client.findAttemptsAnswers(latest._id);
                        setLatestAnswers(answers || []);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setError("Failed to load quiz data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllQuizData();
        
        // 可选：添加自动刷新
        const intervalId = setInterval(fetchAllQuizData, 30000);
        return () => clearInterval(intervalId);
    }, [currentUser?._id, qid]);

    if (loading && !quizDetails.title) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
                <button 
                    className="btn btn-link"
                    onClick={() => {
                        setError(null);
                        fetchAllQuizData();
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    const parentPath = pathname.split('/').slice(0, -1).join('/');
    
    //const quiz = quizzes.filter((q: any) => q.id === qid)
    const filteredQuestions = localQuestions.filter((q: any) => q.quizId === qid);

    const quizSubmitted = quizStatuses?.[qid]?.submitted;
    
    //const userAttempts = attempts ?  attempts.filter(attempt => attempt?.userID === currentUser._id) : [];

    //const latestAttempt = userAttempts.sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
    
    //const latestAnswers = answers?  answers.filter(answer => latestAttempt?.answerID.includes(answer._id)) : [];
    
    // const attemptHistory = userAttempts.map(attempt => ({
    //     attemptNumber: attempt.attemptNumber,
    //     score: attempt?.score,
    //     date: attempt.date
    // }));
   

    
    


    return (
        <div>
            {loading && (
                <div className="position-fixed top-0 end-0 p-3">
                    <div className="spinner-border text-primary spinner-border-sm" role="status">
                        <span className="visually-hidden">Refreshing...</span>
                    </div>
                </div>
            )}
            
            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        {currentUser.role === "FACULTY" && (
                            <>
                                <Link to={`${pathname}/preview`} id="wd-preview" className="btn btn-secondary mx-2">
                                    Preview
                                </Link>
                                <Link to={`${pathname}/edit`} id="wd-edit" className="btn btn-secondary mx-2">
                                    <i className="bi bi-pencil"></i> Edit
                                </Link>
                            </>
                        )}
                        
                    </div>
                </div>
            </div>
            

            
                <div id="wd-assignments-editor">
                    {currentUser.role === "FACULTY" ? (
                        <>
                            <hr />
                            <h4>{quizDetails.title}</h4>

                            {/* Quiz details for faculty */}
                            <div className="container">
                                <div className="row">
                                    <div className="col d-flex flex-column align-items-end p-2 my-2">
                                        <span className="text-end fw-bold my-1">Quiz Type</span>
                                        <span className="text-end fw-bold my-1">Points</span>
                                        <span className="text-end fw-bold my-1">Assignment Group</span>
                                        <span className="text-end fw-bold my-1">Shuffle Answers</span>
                                        <span className="text-end fw-bold my-1">Time Limit</span>
                                        <span className="text-end fw-bold my-1">Multiple Attempts</span>
                                        <span className="text-end fw-bold my-1">View Responses</span>
                                        <span className="text-end fw-bold my-1">Show Correct Answers</span>
                                        <span className="text-end fw-bold my-1">One Question at a Time</span>
                                        <span className="text-end fw-bold my-1">Require Respondus Lock Down</span>
                                        <span className="text-end fw-bold my-1">Browser</span>
                                        <span className="text-end fw-bold my-1">Required to View Quiz Result</span>
                                        <span className="text-end fw-bold my-1">Webcam Required</span>
                                        <span className="text-end fw-bold my-1">Lock Questions After Answering</span>
                                    </div>

                                    <div className="col d-flex flex-column align-items-start p-2 my-2">
                                        <span className="text-start my-1">Graded Quiz</span>
                                        <span className="text-start my-1">{quizDetails.points || 50} </span>
                                        <span className="text-start my-1">QUIZZES</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">{quizDetails.timeLimit} Minutes</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">Always</span>
                                        <span className="text-start my-1">Immediately</span>
                                        <span className="text-start my-1">Yes</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">No</span>
                                    </div>
                                </div>
                            </div>
                            <br />

                            {/* Due date and availability */}
                            <div className="container">
                                <div className="row">
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-start fw-bold">Due</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-start fw-bold">For</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end fw-bold">Available From</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end fw-bold">Until</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="container">
                                <div className="row">
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-start">{quizDetails.dueDate}</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-start">Everyone</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end">{quizDetails.availableDate}</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end">{quizDetails.availableUntilDate}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <br />
                        </>
                    ) : (
                        <>
                        
                            <div key={quiz.id} id="wd-assignments-editor" className="text-start">
                                <h2>{quiz.title}</h2>
                                <hr />

                                <div className="text-start mb-3">
                                    <p>
                                        <strong>Due</strong>  {quizDetails.dueDate}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Points</strong>  {quizDetails.points} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Attempts</strong>  {quizDetails.attempts} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Questions</strong>  {quizDetails.questionsCount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Available</strong>  {quizDetails.availableDate} - {quiz.availableUntilDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Time Limit</strong>  {quizDetails.timeLimit}
                                    </p>
                                </div><hr /><br />
                            </div>
                        

                        {userAttempts.length < quiz.attempts && (
                        <div className="text-center">
                        <Link to={`${pathname}/take`} id="wd-take-quiz" className="btn btn-danger">
                            Take Quiz
                        </Link>
                        </div>)}

                        </>
                    )}

                    {userAttempts.length>0 && (
                    <div>
                        <h3>Attempt History</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Attempt</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAttempts.map((attempt, index) => (
                                    <tr key={index}>
                                        <td>
                                            {/* {attempt.date === latestAttempt.date ? 'LATEST' : ''} */}
                                        </td>
                                        <td style = {{color: "red"}}>Attempt {index+1}</td>
                                        
                                        <td>{attempt?.score} out of {quizDetails.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table><br /><br />

                        <div>
                            <span>Score for this quiz: <b style={{ fontSize: '20px', fontWeight: 'bold' }}>{latestAttempt?.score}</b> out of {quiz.points}</span>
                            <h6>Submitted {latestAttempt?.date}</h6>
                        </div><br />

                        {localQuestions.map((question: Question, index: number) => {
                            const userAnswer = latestAnswers.find(answer => answer.questionID === question._id);
                            const isUserAnswerCorrect = userAnswer && userAnswer.isCorrect;
                            const userSelectedAnswer = userAnswer ? userAnswer.answer[0] : null;
                            const pointsAwarded = isUserAnswerCorrect ? question.points : 0;

                            const isFaculty = currentUser.role === 'FACULTY';
                            const isLastAttempt = userAttempts.length === quiz.attempts;
                            const showAnswer = isFaculty || isLastAttempt;

                            const questionBackgroundColor = showAnswer ? (isUserAnswerCorrect ? "lightgreen" : "lightcoral") : "gray";

                            return (
                                <div key={question._id} className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center p-3"
                                        style={{
                                            backgroundColor: questionBackgroundColor,
                                            border: "1px solid gray",
                                            borderBottom: "none",
                                            borderRadius: "1px 1px 0 0",
                                        }}>
                                        <h5><strong>Question {index + 1}</strong></h5>

                                        {showAnswer && (
                                        <h6><strong>{pointsAwarded}/{question.points} pts</strong></h6>)}
                                    </div>

                                    <div className="p-3" style={{
                                        border: "1px solid gray",
                                        borderRadius: "0 0 1px 1px",
                                    }}>
                                        <p>{question.question}</p>

                                        {question.type === "Multiple Choice" && (
                                            <div>
                                                <hr />
                                                {question.option.map((opt, idx) => {
                                                    const isCorrect = opt.startsWith(question.answer);
                                                    const isSelected = userSelectedAnswer === opt.split(":")[0];

                                                    return (
                                                        <div key={idx}>
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name={`question-${question._id}`}
                                                                    value={opt.split(":")[0]}
                                                                    checked={isSelected}
                                                                    disabled
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt}
                                                                    {showAnswer && isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "green",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {showAnswer && isSelected && !isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx < question.option.length - 1 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "True/False" && (
                                            <div>
                                                <hr />
                                                {question.option.map((opt, idx) => {
                                                    const isCorrect = opt === question.answer;
                                                    const isSelected = userSelectedAnswer === opt;

                                                    return (
                                                        <div key={idx}>
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name={`question-${question._id}`}
                                                                    value={opt}
                                                                    checked={isSelected}
                                                                    disabled
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt}
                                                                    {showAnswer && isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "green",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {showAnswer && isSelected && !isCorrect && (
                                                                        <span style={{
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            borderRadius: "3px",
                                                                            padding: "0 5px",
                                                                            marginLeft: "10px",
                                                                        }}>
                                                                            Incorrect
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                            {idx < question.option.length - 1 && <hr />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {question.type === "Fill in the Blank" && (
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userSelectedAnswer || ""}
                                                    disabled
                                                    style={{ width: 300 }}
                                                />
                                                <br />

                                                {showAnswer &&  (
                                                <div>
                                                    <strong>Answer:</strong> {question.answer}
                                                    <span
                                                        style={{
                                                            backgroundColor: "#81c784",
                                                            color: "white",
                                                            borderRadius: "3px",
                                                            padding: "0 5px",
                                                            marginLeft: "10px",
                                                        }}
                                                    >
                                                        Correct
                                                    </span>
                                                </div>
                                                )}

                                                {showAnswer && !isUserAnswerCorrect && (
                                                <div>
                                                    <strong>You Answered:</strong> {userSelectedAnswer || "No Answer"}
                                                        <span
                                                            style={{
                                                                backgroundColor: "lightcoral",
                                                                color: "white",
                                                                borderRadius: "3px",
                                                                padding: "0 5px",
                                                                marginLeft: "10px",
                                                            }}
                                                        >
                                                            Incorrect
                                                        </span>
                                                </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div> 
                    )}
                </div>
            
        </div>
    );
}