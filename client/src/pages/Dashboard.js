import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import BigSidebar from '../components/BigSidebar';
import SmallSidebar from '../components/SmallSidebar';
import Navbar1 from '../components/Navbar1';
import Wrapper from '../wrappers/SharedLayout';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const empId = decoded.userId;
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/employee?empId=${empId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    toast.success("Logging out...");
    setTimeout(() => {
      navigate('/');
      localStorage.removeItem('authToken');
    }, 0);
    setUser(null);
  };

  return (
    user && (
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userType={user.user.userType}/>
          <BigSidebar isSidebarOpen={isSidebarOpen} userType={user.user.userType}/>
          <div>
            <Navbar1 toggleSidebar={toggleSidebar} user={user.user} userType={user.user.userType} logout={logout} />
            <div className='dashboard-page'>
              <Outlet context={user} />
            </div>
          </div>
        </main>
      </Wrapper>
    )
  );
};

export default Dashboard;

