import Wrapper from '../wrappers/Navbar';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { FaAlignJustify } from "react-icons/fa6";
import { useState } from 'react';

const Navbar1 = ({ toggleSidebar, user, logout, userType }) => {
  const [showLogout, setShowLogout] = useState(false);

  const username = user?.name

  return (
    <Wrapper>
      <div className='nav-center my-4'>
        <button type='button' className='toggle-btn' onClick={toggleSidebar}>
          <FaAlignJustify style={{color:'#6C63FF'}}/>
        </button>
        <div>
          <h3 className='logo-text' style={{color:'#6C63FF'}}>{userType[0].toUpperCase()+userType.substring(1)} Dashboard</h3>
        </div>
        <div className='btn-container'>
          <button
            type='button'
            className='btn'
            onClick={() => setShowLogout(!showLogout)}
            style={{border:'2px solid #6C63FF'}}
          >
            <FaUserCircle />
            <span style={{color:'#6C63FF'}}>{username}</span>
            <FaCaretDown />
          </button>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'} style={{backgroundColor:'grey', borderRadius:'5px'}}>
            <button type='button' className='dropdown-btn' style={{color:'white', fontWeight:'500'}} onClick={logout}>
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar1;
