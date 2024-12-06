import { FaCheckCircle, FaCircle } from "react-icons/fa";
export default function GreenCheckmark({ publish }: { publish: boolean }) {
  return (
    <span className="me-1 position-relative">
      {publish ? (
        <>
          <FaCheckCircle style={{ top: "2px" }} className="text-success me-1 position-absolute fs-5" />
          <FaCircle className="text-white me-1 fs-6" />
        </>
      ) : (
        <>
          <FaCheckCircle style={{ top: "2px" }} className="text-success text-opacity-25 me-1 position-absolute fs-5" />
          <FaCircle className="text-white me-1 fs-6" />
        </>
      )}

    </span>
  );
}

