import { useState } from "react"

export default function QuizEditorMultipleChoice() {
    const [array, setArray] = useState<any>([])
    // value from users' input
    const [inputValue, setInputValue] = useState("");

    const addElement = () => {
        if (inputValue.trim() !== "") {
          setArray([...array, inputValue]); // Add input value to the array
          setInputValue(""); // Clear input field after adding
        }
    };

    
    return (
        <div>
            <hr/>
            <span>Enter your question and multiple answers, then select the one correct answer.</span><br/><br/>
            <h5 className="fw-bold">Question:</h5><br/>
            
            <input type="text"
                id="question_input" 
                className="form-control" 
                placeholder="Type your question here"
                // onChange={(e) => setInputValue(e.target.value)}
            ></input><br/>
            
            <h5 className="fw-bold">Answers:</h5>
            <span>Check the box if the answer is the correct answer</span><br/><br/>
            <div className="list-group-item d-flex justify-content-between">
                <input type="text" id="question_input" className="form-control me-2" 
                placeholder="Type your answers here" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}/>
                
                <button onClick={addElement} className="btn btn-success"> Add Answer </button>
            </div>
            <br/>
            <br/>
            
            <ul className="list-group">
                {array.map((item: any, index: any) => (
                <li key={index}
                    // showing all the answers
                    className="list-group-item d-flex justify-content-between align-items-center" >
                        <input
                        type="checkbox"
                        className="form-check-input me-3"
                        id={`checkbox-${index}`} />
                        
                        <label htmlFor={`checkbox-${index}`} className="flex-grow-1"> {item} </label>
                        
                        <button className="btn btn-danger btn-sm" 
                        onClick={() => setArray(array.filter((_: any, i:any) => i !== index)) } > 
                        Delete
                        </button>

                </li>
                ))}
            </ul>
        </div>
    )
    
}
