import React, { useEffect, useState } from 'react';
import StatItem from './StatItem';
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../wrappers/StatsContainer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ManagerStatsContainer = ({ data }) => {
  const [completedEmployees, setCompletedEmployees] = useState(0);
  const [pendingEmployees, setPendingEmployees] = useState(0);
  const totalEmployees = data.length;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const managerId = decodedToken.empId;
        try {
          const response = await axios.get(`http://localhost:8000/api/feedback/manager/${managerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const feedbackData = response.data.feedbacks;
          const completedCount = feedbackData.length;
          setCompletedEmployees(completedCount);

          const totalPending = totalEmployees - completedCount;
          setPendingEmployees(totalPending);
        } catch (error) {
          console.error(
            "Error fetching feedback details",
            error.response?.data || error.message
          );
        }
      } else {
        console.error("No token found, user is not authenticated.");
      }
    };

    fetchData();
  }, [totalEmployees]);

  const defaultStats = [
    {
      title: 'Total Employees',
      count: totalEmployees || 0,
      icon: <FaSuitcaseRolling />,
      color: '#6C63FF',
      bcg: '#e0e8f9',
    },
    {
      title: 'Completed Employees',
      count: completedEmployees || 0,
      icon: <FaCalendarCheck />,
      color: '#86D293',
      bcg: '#E7FBE6',
    },
    {
      title: 'Pending Employees',
      count: pendingEmployees || 0,
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

export default ManagerStatsContainer;
