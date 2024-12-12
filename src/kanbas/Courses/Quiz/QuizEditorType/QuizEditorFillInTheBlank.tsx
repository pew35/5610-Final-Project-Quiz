import { useEffect, useState } from "react"

export default function QuizEditorFillInTheBlank({
    question,
    onChange
}: 
{
    question: { _id: string; question: string; answer: string[] };
    onChange: (questions: string, answer: string[]) => void;
}
) {

    const [localQuestion, setLocalQuestion] = useState(question.question || "");
    const [localAnswers, setLocalAnswers] = useState<string[]>(question.answer || []);
    const [inputValue, setInputValue] = useState("");

    // Send updates to the parent whenever localQuestion, localOptions, or answers change
    useEffect(() => {
        onChange(localQuestion, localAnswers);
    }, 
    [localQuestion, localAnswers]);
    
    const addAnswers = () => {
        if (inputValue.trim()) {
            setLocalAnswers([...localAnswers, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeAnswer = (index: number) => {
        const updatedOptions = localAnswers.filter((_, i) => i !== index);
        setLocalAnswers(updatedOptions);
        
        // Remove any selected answers tied to this option
        const updatedAnswers = localAnswers.filter((answer) => answer !== localAnswers[index]);
        setLocalAnswers(updatedAnswers);
    };


    return (
        <div>
            <hr/>
            <span>Enter your question text, then define all possible correct answers for the black.</span><br/>
            <span>Students will see the question followed by a small text box to type their answer.</span><br/><br/>
            <h5 className="fw-bold">Question:</h5><br/>
            
            <input type="text"
                id="question_input" 
                className="form-control" 
                placeholder="Type your question here"
                value={localQuestion}
                onChange={(e) => setLocalQuestion(e.target.value)}
            ></input><br/>
            
            <h5 className="fw-bold">Answers:</h5>
            <div className="list-group-item d-flex justify-content-between">
                <input type="text"
                id="question_input"
                className="form-control me-2" 
                placeholder="Type your answers here" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}/>
                
                <button onClick={addAnswers} className="btn btn-success"> Add Answer </button>
            </div>
            <br/>
            <br/>

            <ul className="list-group">
                {localAnswers.map((item: any, index: any) => (
                <li key={index}
                    // showing all the answers
                    className="list-group-item d-flex justify-content-between align-items-center" >
                        {item} 
                        <button className="btn btn-danger btn-sm" 
                        onClick={() => removeAnswer } > 
                        Delete
                        </button>
                </li>
                ))}
            </ul>
        </div>
    )
    
}
