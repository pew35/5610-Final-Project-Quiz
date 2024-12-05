import { Link, useLocation, useParams } from "react-router-dom";
import { setAssignments, addAssignment,  updateAssignment } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as assignmentClient from "./client";
import * as coursesClient from "../client";

export default function AssignmentEditor() {
    const dispatch = useDispatch();
    const { cid } = useParams();
    const { pathname } = useLocation();
    const assignments = useSelector(
        (state: any) => state.assignmentsReducer.assignments);

    const find = assignments.find(
        (assignment: any) => assignment._id === pathname.split("/")[5]
    );
    
    let newAss = find?false:true;
    const [assignment, setAssignment] = useState<any>(
        find || {
            title: "New Assignment",
            description: "New Description",
            points: 100,
            course: cid,
            _id: pathname.split("/")[5],
            due: "",
            available: "",
        }
    );
    
    
    const saveAssignment = async (assignment: any) => {
        await assignmentClient.updateAassignment(assignment);
        dispatch(updateAssignment(assignment));
    };

    const createAssignmentForCourse = async () => {
        if (!cid) return;
        const newAssignment = await coursesClient.createAssignmentForCourse(cid, assignment);
        dispatch(addAssignment(newAssignment));
    };
    useEffect(() => {
        if (find) {
            setAssignment(find);
        }
    }, [find, cid, dispatch]);
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name" className="form-label">
                Assignment Name
            </label>
            <input
                id="wd-name"
                className="form-control"
                defaultValue={assignment?.title}
                onChange={(e: { target: { value: any } }) =>
                    setAssignment({ ...assignment, title: e.target.value })
                }
            />
            <br />
            <br />
            <textarea
                className="form-control"
                id="wd-description"
                cols={80}
                rows={10}
                onChange={(e: { target: { value: any; }; }) => setAssignment({...assignment, description : e.target.value})} 
            >
                {assignment?.description}
            </textarea>
            <br />
            <br />
            <div>
                <form>
                    <div className="row mb-3">
                        <label
                            htmlFor="wd-points"
                            className="col-sm-2 col-form-label"
                        >
                            Points
                        </label>
                        <div className="col-sm-10">
                            <input
                                className="form-control"
                                id="wd-points"
                                value={assignment?.points}
                                onChange={(e: { target: { value: any; }; }) => setAssignment({...assignment, points : e.target.value})} 
                            />
                        </div>{" "}
                    </div>

                    <div className="row mb-3">
                        <label
                            htmlFor="wd-group"
                            className="col-sm-2 col-form-label"
                        >
                            Assignment Group
                        </label>
                        <div className="col-sm-10">
                            <select className="form-select" id="wd-Assignments">
                                <option value="wd-Assignments">
                                    Assignments
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label
                            htmlFor="wd-display-grade-as"
                            className="col-sm-2 col-form-label"
                        >
                            Display Grade as
                        </label>
                        <div className="col-sm-10">
                            <select className="form-select" id="wd-Assignments">
                                <option value="wd-Assignments">
                                    percentage
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label
                            htmlFor="wd-submission-type"
                            className="col-sm-2 col-form-label"
                        >
                            Submission Type
                        </label>

                        <div className="col-sm-10">
                            <div className="border p-3 rounded-3 ">
                                <select
                                    className="form-select"
                                    id="wd-percentage"
                                >
                                    <option value="wd-percentage">
                                        online
                                    </option>
                                </select>
                                <br />
                                <label
                                    htmlFor="wd-online entry Options"
                                    className="col-form-label"
                                >
                                    online entry Options
                                </label>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="check-genre"
                                        id="wd-text-entry"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="wd-text-entry"
                                    >
                                        Text Entry
                                    </label>
                                    <br />

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="check-genre"
                                        id="wd-website-url"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="wd-website-url"
                                    >
                                        Website URL
                                    </label>
                                    <br />

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="check-genre"
                                        id="wd-media-recordings"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="wd-media-recordings"
                                    >
                                        Media Recordings
                                    </label>
                                    <br />

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="check-genre"
                                        id="wd-student-annotation"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="wd-student-annotation"
                                    >
                                        Student Annotation
                                    </label>
                                    <br />

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="check-genre"
                                        id="wd-file-upload"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="wd-file-upload"
                                    >
                                        File Uploads
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label
                            htmlFor="wd-display-grade-as"
                            className="col-sm-2 col-form-label"
                        >
                            Assign
                        </label>

                        <div className="col-sm-10">
                            <div className="border p-3 rounded-3 ">
                                <label
                                    htmlFor="wd-Assign-to"
                                    className="col-form-label"
                                >
                                    Assign to
                                </label>
                                <input
                                    className="form-control"
                                    id="wd-Assign-to"
                                    value="Everyone"
                                />
                                <label
                                    htmlFor="wd-Assign-to"
                                    className="col-form-label"
                                >
                                    Due
                                </label>
                                <input
                                    className="form-control"
                                    id="wd-due-date"
                                    type="date"
                                    value={assignment?.due}
                                    onChange={(e: { target: { value: any; }; }) => setAssignment({...assignment, due : e.target.value})} 
                                />
                                <form>
                                    <div className="row">
                                        <div className="col">
                                            <label
                                                htmlFor="wd-due-date-1"
                                                className="col-form-label"
                                            >
                                                Available from:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="wd-due-date-1"
                                                type="date"
                                                value={assignment?.available}
                                                onChange={(e: { target: { value: any; }; }) => setAssignment({...assignment, available : e.target.value})} 
                                            />
                                        </div>

                                        <div className="col">
                                            <label
                                                htmlFor="wd-due-date-2"
                                                className="col-form-label"
                                            >
                                                Until:
                                            </label>
                                            <input
                                                className="form-control"
                                                id="wd-due-date-2"
                                                type="date" 
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <hr />
            <div id="wd-Assignment-controls" className="text-nowrap ">
                <Link
                    id="wd-add-Assignment-btn"
                    className="btn btn-lg btn-danger me-2 float-end"
                    onClick={() => {
                        if (newAss) {
                            createAssignmentForCourse();
                            
                        } else {
                            console.log(assignment);
                            saveAssignment(assignment);
                            
                            
                        }
                        console.log(assignment);
                        
                    }}
                    to={`/Kanbas/Courses/${cid}/Assignments`}
                >
                    Save
                </Link>

                <Link
                    id="wd-Group"
                    className="btn btn-lg btn-secondary me-2 float-end"
                    to={`/Kanbas/Courses/${cid}/Assignments`}
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
