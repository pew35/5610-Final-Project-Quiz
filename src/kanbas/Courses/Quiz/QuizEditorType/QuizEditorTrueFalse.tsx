import { useState } from "react"

export default function QuizEditorTrueFalse() {
    return (
        <div>
            <hr/>
            <span>Enter your question text, then select if True or False is the correct answer.</span><br/><br/>
            <h5 className="fw-bold">Question:</h5><br/>
            
            <input type="text"
                id="question_input" 
                className="form-control" 
                placeholder="Type your question here"
                // onChange={(e) => setInputValue(e.target.value)}
            ></input><br/>
            
            <h5 className="fw-bold">Answers:</h5>
            <div className="col-sm-10">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="gridRadios" id="r3" value="True" checked />
                    <label className="form-check-label" htmlFor="r3"> True </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="gridRadios" id="r4" value="False" />
                    <label className="form-check-label" htmlFor="r4"> False </label> 
                </div>
            </div>
        </div>
    )
    
}
