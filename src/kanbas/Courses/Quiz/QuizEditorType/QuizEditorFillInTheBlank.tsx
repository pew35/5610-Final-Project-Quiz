import { useState } from "react"

export default function QuizEditorFillInTheBlank() {
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
            <span>Enter your question text, then define all possible correct answers for the black.</span><br/>
            <span>Students will see the question followed by a small text box to type their answer.</span><br/><br/>
            <h5 className="fw-bold">Question:</h5><br/>
            
            <input type="text"
                id="question_input" 
                className="form-control" 
                placeholder="Type your question here"
                // onChange={(e) => setInputValue(e.target.value)}
            ></input><br/>
            
            <h5 className="fw-bold">Answers:</h5>
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
                        {item} 
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
