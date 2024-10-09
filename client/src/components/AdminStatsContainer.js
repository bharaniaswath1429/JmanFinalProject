import React, { useEffect, useState } from "react";
import axios from "axios";
import StatItem from "./SmallStatItem";
import { Bar, Pie } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminStatsContainer = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [insights, setInsights] = useState({
    topPerformers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      const decodedToken = jwtDecode(token);

      try {
        const [empRes, mgrRes, courseRes, perfRes, feedbackRes] =
          await Promise.all([
            axios.get("http://localhost:8000/api/admin/users/employee", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/api/admin/users/manager", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/api/allcourses", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/api/performance", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/api/feedback/feedback", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setEmployees(empRes.data.employees);
        setManagers(mgrRes.data.employees);
        setCourses(courseRes.data);
        setPerformance(perfRes.data);
        setFeedback(feedbackRes.data.feedbacks);

        calculateInsights(
          empRes.data.employees,
          mgrRes.data.employees,
          courseRes.data,
          perfRes.data,
          feedbackRes.data.feedbacks
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateInsights = (
    employees,
    managers,
    courses,
    performance,
    feedback
  ) => {
    const totalEmployees = employees.length;
  const totalManagers = managers.length;
  const totalCourses = courses.length;
  const totalFeedbacks = feedback.length;

  // Calculate total scores for each employee
  const topPerformers = performance.reduce((acc, curr) => {
    acc[curr.employeeID] = (acc[curr.employeeID] || 0) + curr.score;
    return acc;
  }, {});

  // Sort performers based on scores
  const sortedTopPerformers = Object.entries(topPerformers)
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({ employeeID: id, score }));


  const completedCoursesCount = performance.filter(p => p.score > 0).length;
  const feedbackSubmittedCount = feedback.length;

  const scoresOnlyCount = employees.filter(emp =>
    !performance.some(perf => perf.employeeID === emp.employeeID) &&
    feedback.some(f => f.employeeID === emp.employeeID)
  ).length;

  const noScoresCount = employees.filter(emp =>
    !performance.some(perf => perf.employeeID === emp.employeeID) &&
    !feedback.some(f => f.employeeID === emp.employeeID)
  ).length;
    setInsights({
        totalEmployees,
        totalManagers,
        totalCourses,
        totalFeedbacks,
        topPerformers: sortedTopPerformers,
        completedCoursesCount,
        feedbackSubmittedCount,
        scoresOnlyCount,
        noScoresCount,
    });
  };

  const barChartData = {
    labels: [
      "Total Employees",
      "Total Managers",
      "Total Courses",
      "Completed Courses",
      "Feedback Submitted",
    ],
    datasets: [
      {
        label: "Counts",
        data: [
          insights.totalEmployees,
          insights.totalManagers,
          insights.totalCourses,
          insights.completedCoursesCount,
          insights.feedbackSubmittedCount,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* <div className="row">
        <div className="col-2">
          <StatItem title="Total Employees" count={insights.totalEmployees} />
        </div>
        <div className="col-2">
          <StatItem
            title="Top Performers"
            count={
              insights.topPerformers.length > 0
                ? insights.topPerformers
                    .map((p) => `${p.employeeID}: ${p.score}`)
                    .join(", ")
                : "N/A"
            }
          />
        </div>
        <div className='col-2'>
        <StatItem title="Top Performer" count={`${insights.topPerformer.name}: ${insights.topPerformer.score}`} />
      </div>
      <div className='col-2'>
        <StatItem title="Bottom Performer" count={`${insights.bottomPerformer.name}: ${insights.bottomPerformer.score}`} />
      </div>
      </div> */}
      <div className="charts-container">
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default AdminStatsContainer;
