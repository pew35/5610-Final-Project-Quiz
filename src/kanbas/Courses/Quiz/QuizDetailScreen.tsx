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
    
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const qid = pathname.split("/")[5];
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<any>(null);

    const [userAttempts, setAttempts] = useState<any[]>([]); // attempts found by user id and quiz id
    const [latestAttempt, setLatestAttempt] = useState<any>({}); // lstest attempt found by user id and quiz id
    const [latestAnswers, setLatestAnswers] = useState<any[]>([]); // dont know what this is
    
    const [questions, setQuestions] = useState<any[]>([]);// questions found by quiz id no need to filter change name to questions
    //const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
            setQuestions(quizQuestions);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } 
    };

    const fetchlatestAnswers = async () => {
        if (!latestAttempt?._id) {
            setLatestAnswers([]);
            return;
        }
        
        try {
            const answers = await client.findAttemptsAnswers(latestAttempt._id);
            setLatestAnswers(answers || []);
        } catch (error) {
            console.log("Error fetching answers:", error);
            setLatestAnswers([]);
        }
    };



    
    //const answers = db.answers;
    
    const parentPath = pathname.split('/').slice(0, -1).join('/');
    
    //const quiz = quizzes.filter((q: any) => q.id === qid)
    const filteredQuestions = questions.filter((q: any) => q.quizId === qid);
    const { quizStatuses } = useSelector((state: any) => state.quizReducer);
    const quizSubmitted = quizStatuses?.[qid]?.submitted;
    
    //const userAttempts = attempts ?  attempts.filter(attempt => attempt?.userID === currentUser._id) : [];

    //const latestAttempt = userAttempts.sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
    
    //const latestAnswers = answers?  answers.filter(answer => latestAttempt?.answerID.includes(answer._id)) : [];
    
    // const attemptHistory = userAttempts.map(attempt => ({
    //     attemptNumber: attempt.attemptNumber,
    //     score: attempt?.score,
    //     date: attempt.date
    // }));
   

    
    


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const quiz = await client.findQuizById(qid);
                setQuizData(quiz);
                await fetchQuizData();
                await getAttemptsbyUIdandQId();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentUser, qid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!quizData) {
        return <div>Quiz not found</div>;
    }

    return (
        console.log("quiz",quizData),
        <div>
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
                            <h4>{quizData.title}</h4>

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
                                        <span className="text-start my-1">{quizData.points || 50} </span>
                                        <span className="text-start my-1">QUIZZES</span>
                                        <span className="text-start my-1">No</span>
                                        <span className="text-start my-1">{quizData.timeLimit} Minutes</span>
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
                                        <span className="text-start">{quizData.dueDate}</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-start">Everyone</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end">{quizData.availableDate}</span>
                                    </div>
                                    <div className="col d-flex flex-column align-items-start">
                                        <span className="text-end">{quizData.availableUntilDate}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <br />
                        </>
                    ) : (
                        <>
                        
                            <div key={quizData.id} id="wd-assignments-editor" className="text-start">
                                <h2>{quizData.title}</h2>
                                <hr />

                                <div className="text-start mb-3">
                                    <p>
                                        <strong>Due</strong>  {quizData.dueDate}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Points</strong>  {quizData.points} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Attempts</strong>  {quizData.attempts} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Questions</strong>  {quizData.questionsCount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Available</strong>  {quizData.availableDate} - {quizData.availableUntilDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <strong>Time Limit</strong>  {quizData.timeLimit}
                                    </p>
                                </div><hr /><br />
                            </div>
                        

                        {userAttempts.length < quizData.attempts && (
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
                                        
                                        <td>{attempt?.score} out of {quizData.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table><br /><br />

                        <div>
                            <span>Score for this quiz: <b style={{ fontSize: '20px', fontWeight: 'bold' }}>{latestAttempt?.score}</b> out of {quizData.points}</span>
                            <h6>Submitted {latestAttempt?.date}</h6>
                        </div><br />

                        {questions.map((question: Question, index: number) => {
                            const userAnswer = latestAnswers.find(answer => answer.questionID === question._id);
                            const isUserAnswerCorrect = userAnswer && userAnswer.isCorrect;
                            const userSelectedAnswer = userAnswer ? userAnswer.answer[0] : null;
                            const pointsAwarded = isUserAnswerCorrect ? question.points : 0;

                            const isFaculty = currentUser.role === 'FACULTY';
                            const isLastAttempt = userAttempts.length === quizData.attempts;
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
