import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import CoursesNavigation from "./navigation";
import Module from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import Quiz from "./Quiz";
import QuizDetailScreen from "./Quiz/QuizDetailScreen";
import QuizEditor from "./Quiz/QuizEditor";
import QuizPreviewScreen from "./Quiz/QuizPreviewScreen";


export default function Courses({ courses }: { courses: any[]; }) {
    const { cid } = useParams();
    const course =  courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    return (
      <div id="wd-courses">
         <h2 className="text-danger">
            <FaAlignJustify className="me-4 fs-4 mb-1" /> 
            {course && course.name} &gt; {pathname.split("/")[4]}
        </h2>
        <hr />
        <div className="d-flex">
            <div className="d-none d-md-block">
                <CoursesNavigation />
            </div>
            <div className="flex-fill">
                <Routes>
                <Route path="/" element={<Navigate to="Home" />} />
                <Route path="Home" element={<Home />} />
                <Route path="Modules" element={<Module />} />
                <Route path="Assignments" element={<Assignments/>} />
                <Route path="Assignments/:aid" element={<AssignmentEditor />} />
                <Route path="People" element={<PeopleTable />} />
                <Route path="Quizzes" element={<Quiz />} />
                <Route path="Quizzes/:aid" element={<QuizDetailScreen />} />
                <Route path="Quizzes/:aid/edit" element={<QuizEditor />} />
                <Route path="Quizzes/:aid/edit/questions" element={<QuizEditor />} />
                <Route path="Quizzes/:qid/preview" element={<QuizPreviewScreen />} />
                <Route path="Quizzes/:qid/take" element={<QuizPreviewScreen />} />
                </Routes>
            </div>
        </div>
      </div>
  );}
