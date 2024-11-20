
  
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { IoMdHome } from "react-icons/io";
import { IoIosStats } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { CiBullhorn } from "react-icons/ci";
export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "320px",  paddingLeft:"20px"}}>
      <h2>Course Status</h2>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <button className="btn btn-lg btn-secondary w-100 text-nowrap ">
            <MdDoNotDisturbAlt className=" fs-5" /> Unpublish </button>
        </div>
        <div className="w-50">
          <button className="btn btn-lg btn-success w-100">
            <FaCheckCircle className=" fs-5" /> Publish </button>
        </div>
      </div><br />
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" /> Import Existing Content </button>
      <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons </button>
        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <IoMdHome className="me-2 fs-5" />
          Choose Home Page</button>
        <br />
        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
          <IoIosStats className="me-2 fs-5" />
          View Course Stream</button>
        <br />
        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
          <CiBullhorn className="me-2 fs-5"/>
          New Announcement</button>
        <br />
        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
        <IoIosStats className="me-2 fs-5" />
          New Analytics</button>
        <br />
        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start">
          <FaRegBell className="me-2 fs-5"/>
          View Course Notifications</button>
    </div>
);}
