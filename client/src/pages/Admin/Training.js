import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "./Training.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminTraining = () => {
  const adminMenuItems = [
    { path: "/admin", name: "Home" },
    { path: "/employeelist", name: "Manage Employees" },
    { path: "/training", name: "Manage Training" },
  ];

  const [empName, setEmpName] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    duration: "",
    designation: "",
    description: "",
    startCourseDate: "",
    courseExpireDate: "",
    questions: [{ question: "", answers: ["", "", "", ""], correctAnswer: "" }],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setEmpName(localStorage.getItem("empName"));

    if (token) {
      axios
        .get("http://localhost:8000/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          fetchCourses(token);
        })
        .catch((error) => {
          console.error(
            "Error fetching protected route",
            error.response?.data || error.message
          );
        });
    } else {
      console.error("No token found, user is not authenticated.");
    }
  }, []);

  const fetchCourses = (token) => {
    axios
      .get("http://localhost:8000/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);
        setFilteredCourses(response.data);
      })
      .catch((error) => console.error("Error fetching courses", error));
  };

  const handleQuizChange = (e) => {
    setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = newQuiz.questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedAnswers = newQuiz.questions[questionIndex].answers.map(
      (ans, i) => (i === answerIndex ? value : ans)
    );

    const updatedQuestions = newQuiz.questions.map((q, i) =>
      i === questionIndex ? { ...q, answers: updatedAnswers } : q
    );

    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        { question: "", answers: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value) ||
        course.designation.toLowerCase().includes(value)
    );
    setFilteredCourses(filtered);
  };

  const handleDeleteCourse = (courseId) => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(`http://localhost:8000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success("Course deleted successfully");
        setCourses(courses.filter((course) => course.id !== courseId));
        setFilteredCourses(
          filteredCourses.filter((course) => course.id !== courseId)
        );
      })
      .catch((error) => {
        toast.error("Error deleting course");
        console.error(error);
      });
  };

  const handleEditCourse = (course) => {
    setShowQuizModal(true);
    setNewQuiz(course);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    axios
      .post("http://localhost:8000/api/courses", newQuiz, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Quiz created successfully");
        setCourses([...courses, response.data.quiz]);
        setShowQuizModal(false);
      })
      .catch((error) => {
        toast.error("Error creating quiz");
        console.log(error);
      });
  };

  useEffect(() => {
    if (!showQuizModal) {
      setNewQuiz({
        title: "",
        duration: "",
        designation: "",
        description: "",
        startCourseDate: "",
        courseExpireDate: "",
        questions: [{ question: "", answers: ["", "", "", ""], correctAnswer: "" }],
      });
    }
  }, [showQuizModal]);

  console.log(courses)

  return (
    <div>
      <h2 style={{ fontWeight: "700", color: "#6C63FF" }}>Courses</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by Title or Designation"
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
          style={{ maxWidth: "300px" }}
        />
        <Button className="me-4 btn1" onClick={() => setShowQuizModal(true)}>
          Create Course
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr style={{ color: "#6C63FF", fontWeight: "500" }}>
            <th>Title</th>
            <th>Duration (min)</th>
            <th>Designation</th>
            <th>Number of Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No courses available
              </td>
            </tr>
          ) : (
            filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.duration}</td>
                <td>{course.designation}</td>
                <td>{course.questions.length}</td>
                <td>
                  <FaEdit
                    style={{
                      cursor: "pointer",
                      color: "#6C63FF",
                      marginRight: "10px",
                    }}
                    onClick={() => handleEditCourse(course)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", color: "#FF6347" }}
                    onClick={() => handleDeleteCourse(course.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal
        show={showQuizModal}
        onHide={() => setShowQuizModal(false)}
        dialogClassName="modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#6C63FF" }}>Create Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleQuizSubmit}>
            <Form.Group controlId="quizTitle">
              <Form.Label style={{ color: "#6C63FF" }}>Course Title</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                name="title"
                value={newQuiz.title}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quizDuration">
              <Form.Label style={{ color: "#6C63FF" }}>
                Duration (minutes)
              </Form.Label>
              <Form.Control
                className="mb-2"
                type="number"
                name="duration"
                value={newQuiz.duration}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quizDesignation">
              <Form.Label style={{ color: "#6C63FF" }}>Designation</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                name="designation"
                value={newQuiz.designation}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quizDescription">
              <Form.Label style={{ color: "#6C63FF" }}>Description</Form.Label>
              <Form.Control
                className="mb-2"
                as="textarea"
                rows={3}
                name="description"
                value={newQuiz.description}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quizStartCourseDate">
              <Form.Label style={{ color: "#6C63FF" }}>
                Start Course Date
              </Form.Label>
              <Form.Control
                className="mb-2"
                type="date"
                name="startCourseDate"
                value={newQuiz.startCourseDate}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quizExpireDate">
              <Form.Label style={{ color: "#6C63FF" }}>
                Course Expiry Date
              </Form.Label>
              <Form.Control
                className="mb-2"
                type="date"
                name="courseExpireDate"
                value={newQuiz.courseExpireDate}
                onChange={handleQuizChange}
                required
              />
            </Form.Group>
            {/* Render questions */}
            {newQuiz.questions.map((question, index) => (
              <div key={index}>
                <Form.Group controlId={`question${index}`}>
                  <Form.Label style={{ color: "#6C63FF" }}>
                    Question {index + 1}
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    required
                  />
                </Form.Group>
                {question.answers.map((answer, answerIndex) => (
                  <Form.Group
                    controlId={`answer${index}-${answerIndex}`}
                    key={answerIndex}
                  >
                    <Form.Label style={{ color: "#6C63FF" }}>
                      Answer {answerIndex + 1}
                    </Form.Label>
                    <Form.Control
                      className="mb-2"
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(index, answerIndex, e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                ))}
                <Form.Group controlId={`correctAnswer${index}`}>
                  <Form.Label style={{ color: "#6C63FF" }}>
                    Correct Answer
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(index, "correctAnswer", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
            ))}
            <Button variant="secondary" onClick={addQuestion} className="mb-3">
              Add Question
            </Button>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowQuizModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminTraining;

