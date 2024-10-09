import React, { useEffect, useState } from "react";
import axios from "axios";
import './Course.css';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8; 

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const empId = decodedToken.userId;
  
        try {
          const employeeResponse = await axios.get(`http://localhost:8000/api/employee?empId=${empId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { designation } = employeeResponse.data.user;
  
          const courseResponse = await axios.get(
            `http://localhost:8000/api/courses?designation=${designation}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(courseResponse.data);
  
        } catch (error) {
          console.error(
            "Error fetching employee or course details",
            error.response?.data || error.message
          );
        }
      } else {
        console.error("No token found, user is not authenticated.");
        localStorage.clear();
        navigate('/login');
      }
    };
  
    fetchData();
  }, []);

  const handleStartQuiz = (courseId) => {
    navigate(`/employee/course/${courseId}/quiz`);
  };


  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="container mt-5">
      <div className="row">
        {currentCourses.map((course) => (
          <div className="col-md-3 mb-4" key={course.id}>
            <div className="card d-flex justify-content-center">
              <div className="content">
                <h4>{course.title}</h4>
                <p>Duration: {course.duration} min</p>
                <button className="btnsubmit p-2 px-3" onClick={() => handleStartQuiz(course.id)}>Start</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 ? (
        <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((number) => (
            <li
              key={number + 1}
              className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
            >
              <button onClick={() => paginate(number + 1)} className="page-link" style={{backgroundColor:'#6C63FF', border:'none'}}>
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
        </nav>
      ):(
        <></>
      )}
    </div>
  );
};

export default Courses;
