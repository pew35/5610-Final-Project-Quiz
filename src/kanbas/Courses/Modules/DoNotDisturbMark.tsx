import { MdDoNotDisturbAlt } from "react-icons/md";
export default function DoNotDisturbMark() {
  return (
    <span className="me-1 position-relative">
      <MdDoNotDisturbAlt style={{ top: "2px" }}
        className="text-black me-1 position-absolute fs-5" />
      <MdDoNotDisturbAlt className="text-white me-1 fs-6" />
    </span>
);}