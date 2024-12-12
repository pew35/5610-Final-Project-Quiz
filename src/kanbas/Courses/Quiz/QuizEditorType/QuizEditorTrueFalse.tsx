import { useEffect, useState } from "react"

export default function QuizEditorTrueFalse({
    question,
    onChange
}: 
{
    question: { id: number; questions: string; options: string[]; answers: string[] };
    onChange: (questions: string, options: string[], answers: string[]) => void;
})
{
    const fixedOptions = ["True", "False"];
    const [localQuestion, setLocalQuestion] = useState(question.questions || "");
    const [localOptions, setLocalOptions] = useState<string[]>(question.options || []);
    const [localAnswers, setLocalAnswers] = useState<string[]>(question.answers || []);
    const [inputValue, setInputValue] = useState("");

    // Send updates to the parent whenever localQuestion, localOptions, or answers change
    useEffect(() => {
        onChange(localQuestion, localOptions, localAnswers);
    }, 
    [localQuestion, localOptions, localAnswers]);

    const handleAnswerSelection = (selectedAnswer: string) => {
        setLocalAnswers([selectedAnswer]);  // Allow only one answer selection
        onChange(question.questions, fixedOptions, [selectedAnswer]);
        setLocalOptions(fixedOptions);
    };

    return (
        <div>
            <hr/>
            <span>Enter your question text, then select if True or False is the correct answer.</span><br/><br/>
            <h5 className="fw-bold">Question:</h5><br/>
            
            <input type="text"
                id="question_input" 
                className="form-control" 
                placeholder="Type your question here"
                value={localQuestion}
                onChange={(e) => setLocalQuestion(e.target.value)}
            ></input><br/>
            
            <h5 className="fw-bold">Answers:</h5>
            <div className="col-sm-10">
            {fixedOptions.map((option) => (
                <div key={option} className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name={`grid-${question.id}`}
                        id={`r-${option}`}
                        value={option}
                        checked={localAnswers.includes(option)}
                        onChange={() => handleAnswerSelection(option)}
                    />
                    <label className="form-check-label" htmlFor={`r-${option}`}>
                        {option}
                    </label>
                </div>
            ))}
            </div>
        </div>
    )
    
}
