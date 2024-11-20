import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { assignments } from "../../Database";
import DeleteDialog from "./DeleteDialog";
import { useDispatch } from "react-redux";
export default function AssignmentControlButtons(){
    return (
        <div className="float-end">     
            <GreenCheckmark />
        </div>
    );
}
