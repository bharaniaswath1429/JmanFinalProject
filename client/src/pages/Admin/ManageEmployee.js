import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, Table } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const empId = decodedToken.userId;

          const employeeResponse = await axios.get(`http://localhost:8000/api/admin/users/employee?empId=${empId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEmployees(employeeResponse.data.employees);

          // Fetch courses details
          const coursesResponse = await axios.get('http://localhost:8000/api/allcourses', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCourses(coursesResponse.data);

          // Fetch training performance details
          const performanceResponse = await axios.get('http://localhost:8000/api/performance', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPerformanceData(performanceResponse.data);

          // Fetch feedback details
          const feedbackResponse = await axios.get('http://localhost:8000/api/feedback/feedback', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFeedbackData(feedbackResponse.data.feedbacks);

        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
    };

    fetchData();
  }, [token]);

  const filterPerformanceData = () => {
    return performanceData.filter((item) => {
      const matchesCourse = selectedCourse ? item.course === selectedCourse : true;
      const matchesDesignation = selectedDesignation ? item.designation === selectedDesignation : true;
      return matchesCourse && matchesDesignation;
    });
  };

  // Filter feedback data based on designation
  const filterFeedbackData = () => {
    return feedbackData.filter((item) => {
      return selectedDesignation ? item.designation === selectedDesignation : true;
    });
  };

  return (
    <div className="mt-4">
      <h2>Manage Employee Performance</h2>
      <div className="mb-3">
        <label htmlFor="courseSelect" className="form-label">Select Course:</label>
        <select
          id="courseSelect"
          className="form-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.title}>{course.title}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="designationSelect" className="form-label">Select Designation:</label>
        <select
          id="designationSelect"
          className="form-select"
          value={selectedDesignation}
          onChange={(e) => setSelectedDesignation(e.target.value)}
        >
          <option value="">All Designations</option>
          {Array.from(new Set(employees.map(emp => emp.designation))).map(designation => (
            <option key={designation} value={designation}>{designation}</option>
          ))}
        </select>
      </div>

      <Tabs defaultActiveKey="training" id="performance-tabs" className="mb-3">
        <Tab eventKey="training" title="Training Performance">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Score</th>
                <th>Time</th>
                <th>Attempt</th>
              </tr>
            </thead>
            <tbody>
              {filterPerformanceData().map(performance => (
                <tr key={performance.employeeID}>
                  <td>{performance.name}</td>
                  <td>{performance.course}</td>
                  <td>{performance.score}</td>
                  <td>{performance.time}</td>
                  <td>{performance.attempt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="feedback" title="Feedback Performance">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Feedback Score</th>
              </tr>
            </thead>
            <tbody>
              {filterFeedbackData().map(feedback => (
                <tr key={feedback.employeeID}>
                  <td>{feedback.name}</td>
                  <td>{feedback.designation}</td>
                  <td>{feedback.aggregatedScore}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="total" title="Total Performance">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => {
                const totalScore = performanceData
                  .filter(p => p.employeeID === employee.employeeID)
                  .reduce((sum, item) => sum + item.score, 0);
                return (
                  <tr key={employee.employeeID}>
                    <td>{employee.name}</td>
                    <td>{employee.designation}</td>
                    <td>{totalScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ManageEmployee;
