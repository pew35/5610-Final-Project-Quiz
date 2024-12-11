import { useState, useEffect } from "react";


export default function QuizEditorMultipleChoice({
    question,
    onChange
}: 
{
    question: { id: number; questions: string; options: string[]; answers: string[] };
    onChange: (questions: string, options: string[], answers: string[]) => void;
}) 
{
    const [localQuestion, setLocalQuestion] = useState(question.questions || "");
    const [localOptions, setLocalOptions] = useState<string[]>(question.options || []);
    const [localAnswers, setLocalAnswers] = useState<string[]>(question.answers || []);
    const [inputValue, setInputValue] = useState("");
    
    // Send updates to the parent whenever localQuestion, localOptions, or answers change
    useEffect(() => {
        onChange(localQuestion, localOptions, localAnswers);
    }, 
    [localQuestion, localOptions, localAnswers]);
    
    const addOption = () => {
        if (inputValue.trim()) {
            setLocalOptions([...localOptions, inputValue.trim()]);
            setInputValue("");
        }
    };
    
    const removeOption = (index: number) => {
        const updatedOptions = localOptions.filter((_, i) => i !== index);
        setLocalOptions(updatedOptions);
        
        // Remove any selected answers tied to this option
        const updatedAnswers = localAnswers.filter((answer) => answer !== localOptions[index]);
        setLocalAnswers(updatedAnswers);
    };
    
    const toggleAnswerSelection = (answer: string) => {
        if (localAnswers.includes(answer)) {
            setLocalAnswers(localAnswers.filter((ans) => ans !== answer));
        } else 
        {
            setLocalAnswers([...localAnswers, answer]);
        }
    };
    
    return (
    <div>
        <input
        id="question_input" 
        type="text"
        placeholder="Type your question here"
        className="form-control"
        value={localQuestion}
        onChange={(e) => setLocalQuestion(e.target.value)}
        />
        <br/>
        
        <h5 className="fw-bold">Answers:</h5>
        <span>Check the box if the answer is the correct answer</span><br/><br/>
        <div className="list-group-item d-flex justify-content-between">
            <input
            type="text"
            id="question_input"
            className="form-control me-2" 
            placeholder="Type your answers here" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="btn btn-success" onClick={addOption}> Add Answer </button>
        </div>
        <br/>
        <div>
            {localOptions.map((option, index) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-center" >
                    <label>
                        <input 
                        className="form-check-input me-3"
                        type="checkbox"
                        checked={localAnswers.includes(option)}
                        onChange={() => toggleAnswerSelection(option)}
                        />
                        {option}
                    
                    </label>
                    
                    <button className="btn btn-danger btn-sm" onClick={() => removeOption(index)}> Delete </button>
                
                </div>
            )
        )
        }
        </div>
    </div>
    );
}
