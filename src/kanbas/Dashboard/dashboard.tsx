import { Link } from "react-router-dom";
import * as db from "../Database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "./coursesReducer";
import { enrollCourse, unenrollCourse } from "./enrollmentsReducer";

export default function Dashboard() {
    const courses = useSelector((state: any) => state.coursesReducer.courses);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const FACULTY = currentUser.role === "FACULTY";
    const { enrollments } = useSelector(
        (state: any) => state.enrollmentsReducer
    );
    const dispatch = useDispatch();
    const [courseNumber, setCourseNumber] = useState(0);
    const [enrollmentMode, setEnrollmentMode] = useState(false);
    const [course, setCourse] = useState({
        _id: "1234",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        description: "New Description",
    });
    useEffect(() => {
        // Calculate the number of courses based on the user's role
        const count = FACULTY
            ? courses.length
            : courses.filter((course: any) =>
                  enrollments.some(
                      (enrollment: any) =>
                          enrollment.user === currentUser._id &&
                          enrollment.course === course._id
                  )
              ).length;
        setCourseNumber(count);
    }, [courses, FACULTY, enrollments, currentUser._id]);

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            {FACULTY && (
                <div>
                    <h5>
                        New Course
                        <button
                            className="btn btn-primary float-end "
                            id="wd-add-new-course-click"
                            onClick={() => dispatch(addNewCourse(course))}
                        >
                            Add
                        </button>
                        <button
                            className="btn btn-warning float-end me-2"
                            onClick={() => dispatch(updateCourse(course))}
                            id="wd-update-course-click"
                        >
                            Update
                        </button>
                    </h5>
                    <br />
                    <input
                        value={course.name}
                        className="form-control mb-2"
                        onChange={(e) =>
                            setCourse({ ...course, name: e.target.value })
                        }
                    />
                    <textarea
                        value={course.description}
                        className="form-control"
                        onChange={(e) =>
                            setCourse({
                                ...course,
                                description: e.target.value,
                            })
                        }
                    />
                    <hr />
                </div>
            )}
            {!FACULTY && (
                <div>
                    <button
                        className="btn btn-primary float-end"
                        onClick={() => setEnrollmentMode(!enrollmentMode)}
                    >
                        Enrollment
                    </button>
                </div>
            )}
            <h2 id="wd-dashboard-published">
                Published Courses ({courseNumber})
            </h2>
            <hr />
            <div id="wd-dashboard-courses" className="row">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {courses
                        .filter((course: any) => {
                            if (!FACULTY && !enrollmentMode) {
                                return enrollments.some(
                                    (enrollment: any) =>
                                        enrollment.user === currentUser._id &&
                                        enrollment.course === course._id
                                );
                            } else {
                                return true;
                            }
                        })
                        .map((course: any) => (
                            <div
                                className="wd-dashboard-course col"
                                style={{ width: "300px" }}
                            >
                                <div className="card rounded-3 overflow-hidden">
                                    <Link
                                        to={`/Kanbas/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark"
                                    >
                                        <img
                                            src="/images/reactjs.jpg"
                                            width="100%"
                                            height={160}
                                        />
                                        <div className="card-body">
                                            <h5 className="wd-dashboard-course-title card-title">
                                                {course.name}
                                            </h5>
                                            <p
                                                className="wd-dashboard-course-title card-text overflow-y-hidden"
                                                style={{ maxHeight: 100 }}
                                            >
                                                {course.description}
                                            </p>
                                            <button className="btn btn-primary">
                                                Go
                                            </button>
                                            {FACULTY && (
                                                <div>
                                                    <button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            dispatch(
                                                                deleteCourse(
                                                                    course._id
                                                                )
                                                            );
                                                        }}
                                                        className="btn btn-danger float-end"
                                                        id="wd-delete-course-click"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        id="wd-edit-course-click"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setCourse(course);
                                                        }}
                                                        className="btn btn-warning me-2 float-end"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                            {!FACULTY && (
                                                <>
                                                    {enrollments.some(
                                                        (enrollment: any) =>
                                                            enrollment.course ===
                                                                course._id &&
                                                            enrollment.user ===
                                                                currentUser._id
                                                    ) ? (
                                                        <button
                                                            className="btn btn-danger float-end"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                dispatch(
                                                                    unenrollCourse(
                                                                        { courseId:course._id, userId:currentUser._id}
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            Unenroll
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-success float-end"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                dispatch(
                                                                    enrollCourse(
                                                                       { courseId:course._id, userId:currentUser._id}
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            Enroll
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
