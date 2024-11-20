import { FaPlus } from "react-icons/fa6";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AssignmentControls({ cid }: { cid: any }) {
    const tempAssignment = {
        id: new Date().getTime().toString(),
      };
  return (
    <div id="wd-Assignment-controls" className="text-nowrap d-flex">
        <input id="wd-search-assignment" className=" form-control me-2" type="search"
                placeholder="Search for Assignments" />
        <Link id="wd-add-Assignment-btn" className="btn btn-lg btn-danger me-2 float-end"        
        to={`/Kanbas/Courses/${cid}/Assignments/${tempAssignment.id}`}
        >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment</Link>
        
        
        <button id="wd-Group" className="btn btn-lg btn-secondary me-2 float-end">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Group</button> 
        
    
    </div>
);}
