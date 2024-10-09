import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const empId = decodedToken.userId;

          const employeeResponse = await axios.get(`http://localhost:8000/api/employee?empId=${empId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setProfileData(employeeResponse.data.user);
        } catch (err) {
          setError(err.response ? err.response.data.message : err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No token found');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <div>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Employee ID:</strong> {profileData.employeeID}</p>
          <p><strong>Designation:</strong> {profileData.designation}</p>
        </div>
      ) : (
        <div>No profile data available</div>
      )}
    </div>
  );
};

export default AdminProfile;
