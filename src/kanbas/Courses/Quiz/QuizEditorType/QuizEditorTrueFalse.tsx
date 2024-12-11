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
        setLocalOptions(["True", "False"])
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
                <div className="form-check">
                    <input 
                    className="form-check-input" 
                    type="radio" name="gridRadios" 
                    id="r3" value="True" 
                    checked={localAnswers.includes("True")} 
                    onChange={() => setLocalAnswers(["True"])}
                    />
                    <label className="form-check-label" htmlFor="r3"> True </label>
                </div>
                <div className="form-check">
                    <input 
                    className="form-check-input"
                     type="radio" 
                     name="gridRadios" 
                     id="r4" 
                     value="False" 
                     checked={localAnswers.includes("False")}
                     onChange={() => setLocalAnswers(["False"])}
                     />
                    <label className="form-check-label" htmlFor="r4"> False </label> 
                </div>
            </div>
        </div>
    )
    
}
