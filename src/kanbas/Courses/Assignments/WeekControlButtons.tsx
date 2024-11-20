import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { BsPlusLg } from "react-icons/bs";
export default function WeekControlButtons() {
    return (
        <div className="float-end">
            <div className="flex-container">
                <label
                    className="form-label pe-2 ps-2 me-3"
                    style={{
                        borderRadius: "50px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                    }}
                >
                    40% of Total
                </label>
                <BsPlusLg className=" me-2 fs-4" />
                <IoEllipsisVertical className=" me-2 fs-4" />
            </div>
        </div>
    );
}
