import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Dropdown, Table, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EmployeePerformance = () => {
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [performanceData, setPerformanceData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [uniqueCoursesAttended, setUniqueCoursesAttended] = useState(0);
  const [totalCoursesInDesignation, setTotalCoursesInDesignation] = useState(0);
  const [topCourse, setTopCourse] = useState({ course: "", score: 0 });
  const [worstCourse, setWorstCourse] = useState({ course: "", score: 0 });
  const [totalPerformanceScore, setTotalPerformanceScore] = useState(0);
  const [feedbackScore, setFeedbackScore] = useState(0);
  const [filterOption, setFilterOption] = useState("All");
  const [filteredData, setFilteredData] = useState([]);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const employeeResponse = await axios.get(
            `http://localhost:8000/api/admin/users/employee`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setEmployees(employeeResponse.data.employees);
          setDesignations(
            Array.from(
              new Set(
                employeeResponse.data.employees.map((emp) => emp.designation)
              )
            )
          );

          const coursesResponse = await axios.get(
            `http://localhost:8000/api/allcourses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCourses(coursesResponse.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
    };

    fetchData();
  }, [token]);

  const handleDesignationChange = (designation) => {
    setSelectedDesignation(designation);
    setSelectedEmployee("");
    setSelectedEmployeeId("");
  };

  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee.name);
    setSelectedEmployeeId(employee.employeeID);
    setSelectedId(employee.id);

    setTopCourse({ course: "", score: 0 });
    setWorstCourse({ course: "", score: 0 });
    setTotalPerformanceScore(0);
    setFeedbackScore(0);
    setPerformanceData([]);
  };

  const fetchPerformanceData = async () => {
    if (selectedEmployeeId) {
      try {
        const performanceResponse = await axios.get(
          `http://localhost:8000/api/performance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const employeePerformance = performanceResponse.data.filter(
          (performance) => performance.employeeID === selectedId
        );
        setPerformanceData(employeePerformance);

        const feedbackResponse = await axios.get(
          `http://localhost:8000/api/feedback/feedback`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const employeeFeedback = feedbackResponse.data.feedbacks.filter(
          (feedback) => feedback.name === selectedEmployee
        );
        setFeedbackData(employeeFeedback);

        const uniqueCourses = new Set(
          employeePerformance.map((performance) => performance.courseID)
        ).size;
        setUniqueCoursesAttended(uniqueCourses);

        const totalCourses = courses.filter(
          (course) => course.designation === selectedDesignation
        ).length;
        setTotalCoursesInDesignation(totalCourses);

        if (employeePerformance.length > 0) {
          const topPerformance = employeePerformance.reduce((top, current) =>
            current.score > top.score ? current : top
          );

          const worstPerformance = employeePerformance.reduce(
            (worst, current) => (current.score < worst.score ? current : worst)
          );

          const topCourseTitle =
            courses.find((course) => course.id === topPerformance.courseID)
              ?.title || "";
          const worstCourseTitle =
            courses.find((course) => course.id === worstPerformance.courseID)
              ?.title || "";

          setTopCourse({ course: topCourseTitle, score: topPerformance.score });
          setWorstCourse({
            course: worstCourseTitle,
            score: worstPerformance.score,
          });
        }

        const courseMap = new Map();
        employeePerformance.forEach((performance) => {
          const existing = courseMap.get(performance.courseID);
          if (!existing || performance.score > existing.score) {
            courseMap.set(performance.courseID, {
              score: performance.score,
              attempt: Math.max(existing?.attempt || 0, performance.attempt),
            });
          }
        });

        const totalScore = Array.from(courseMap.values()).reduce(
          (total, { score }) => total + score,
          0
        );
        const avgScore = totalScore / courseMap.size;
        setTotalPerformanceScore(avgScore);

        const totalFeedback = employeeFeedback.reduce(
          (sum, feedback) => sum + feedback.aggregatedScore,
          0
        );
        setFeedbackScore(
          employeeFeedback.length > 0
            ? totalFeedback / employeeFeedback.length
            : 0
        );
      } catch (error) {
        console.error("Error fetching performance or feedback data", error);
      }
    }
  };

  useEffect(() => {
    if (filterOption === "All") {
      // For "All", simply set the performanceData without adding extra rows
      setFilteredData(performanceData);
    } else if (filterOption === "Final") {
      // For "Final", find the unique courses with the highest attempt
      const finalData = performanceData.reduce((uniqueCourses, current) => {
        const existing = uniqueCourses.find(
          (item) => item.courseID === current.courseID
        );
  
        // Check if this is a higher attempt, or if the course hasn't been added yet
        if (!existing || current.attempt > existing.attempt) {
          // Replace any existing entry with the new highest attempt
          return [
            ...uniqueCourses.filter((item) => item.courseID !== current.courseID),
            current,
          ];
        }
        return uniqueCourses;
      }, []);
      setFilteredData(finalData);
    }
  }, [filterOption, performanceData]);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedEmployeeId]);

  const barChartData = courses
    .filter((course) => course.designation === selectedDesignation)
    .map((course) => {
      const performance = performanceData.find(
        (perf) => perf.courseID === course.id
      );
      return {
        course: course.title,
        score: performance ? performance.score : 0,
      };
    });

  console.log(filteredData);

  return (
    <div className="mt-4">
      <h2 className="mb-4" style={{ color: "#6C63FF", fontWeight: "600" }}>
        Employee Performance:
      </h2>
      <div className="d-flex mb-5">
        <Dropdown className="mx-2">
          <Dropdown.Toggle id="dropdown-basic">
            {selectedDesignation || "Select Designation"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {designations.map((designation, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleDesignationChange(designation)}
              >
                {designation}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="mx-2">
          <Dropdown.Toggle id="dropdown-basic">
            {selectedEmployee || "Select Employee"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {employees
              .filter((emp) => emp.designation === selectedDesignation)
              .map((emp, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleEmployeeChange(emp)}
                >
                  {emp.name}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {selectedEmployee && (
        <>
          <div className="row">
            <div className="col-2 pb-4">
              <h5>Total Courses:</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">
                    Attended
                  </Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {uniqueCoursesAttended}/{totalCoursesInDesignation}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-2 pb-4">
              <h5>Total Courses:</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">Pending</Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {totalCoursesInDesignation - uniqueCoursesAttended}/
                    {totalCoursesInDesignation}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-2 pb-4">
              <h5>Top Mark:</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">
                    {topCourse.course}
                  </Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {topCourse.score}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-2 pb-4">
              <h5>Worst Performance:</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">
                    {worstCourse.course}
                  </Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {worstCourse.score}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-2 pb-4">
              <h5>Total Performance :</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">Score:</Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {totalPerformanceScore
                      ? totalPerformanceScore.toFixed(2)
                      : 0}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-2 pb-4">
              <h5>Feedback :</h5>
              <Card className="mb-4 px-5 pt-4 pb-5" style={{ height: "75%" }}>
                <Card.Body className="p-0">
                  <Card.Text className="fw-600 fs-5 content">Score:</Card.Text>
                  <Card.Text className="fw-600 fs-1 content">
                    {feedbackScore.toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
          {filteredData.length > 0 ? (
  <div className="row">
  <div className="col-7">
    <div className="row">
      <div className="col-9">
        <h3>Performance History</h3>
      </div>
      <div className="col-3">
        <Dropdown className="mx-2">
          <Dropdown.Toggle id="dropdown-basic">
            {filterOption}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFilterOption("All")}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterOption("Final")}>
              Final
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course</th>
          <th>Score percentage</th>
          <th>Time (minutes)</th>
          <th>Attempt</th>
          <th>Result</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
      {filteredData.map((performance, index) => (
            <tr key={`${performance.courseID}-${performance.attempt}-${index}`}>
              <td>{performance.course}</td>
              <td>{performance.score}</td>
              <td>{(performance.time / 60).toFixed(2)}</td>
              <td>{performance.attempt}</td>
              <td>{performance.score > 50 ? "Pass" : "Fail"}</td>
              <td>
                {new Date(performance.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </div>
  <div className="col-5">
    <h3>Performance Overview</h3>
    <ResponsiveContainer width="100%" height={300}>
  <BarChart data={barChartData}>
    <XAxis dataKey="course" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="score" fill="#6C63FF" />
  </BarChart>
</ResponsiveContainer>
  </div>
</div>
) : (
  <p>No performance data available for the selected employee.</p>
)}
        </>
      )}
    </div>
  );
};

export default EmployeePerformance;
