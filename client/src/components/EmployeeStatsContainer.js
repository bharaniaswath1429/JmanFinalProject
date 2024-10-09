import React, { useEffect, useState } from 'react';
import StatItem from './StatItem';
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../wrappers/StatsContainer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const EmployeeStatsContainer = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const empId = decodedToken.userId;

        try {
          // Fetch total courses based on employee designation
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

          setTotalCourses(courseResponse.data.length);

          // Fetch performance data to calculate completed courses
          const performanceResponse = await axios.get(
            `http://localhost:8000/api/employee-performance?employeeID=${empId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const uniqueCourses = new Set(performanceResponse.data.map(item => item.courseID));
          setCompletedCourses(uniqueCourses.size);

        } catch (error) {
          console.error(
            "Error fetching course or performance details",
            error.response?.data || error.message
          );
        }
      } else {
        console.error("No token found, user is not authenticated.");
      }
    };

    fetchData();
  }, []);

  const defaultStats = [
    {
      title: 'Total Courses',
      count: totalCourses || 0,
      icon: <FaSuitcaseRolling />,
      color: '#6C63FF',
      bcg: '#e0e8f9',
    },
    {
      title: 'Completed Courses',
      count: completedCourses || 0,
      icon: <FaCalendarCheck />,
      color: '#86D293',
      bcg: '#E7FBE6',
    },
    {
      title: 'Pending Courses',
      count: totalCourses - completedCourses || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => (
        <StatItem key={index} {...item} />
      ))}
    </Wrapper>
  );
};

export default EmployeeStatsContainer;

