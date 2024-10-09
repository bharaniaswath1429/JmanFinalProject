import React from "react";
import { Link, useLocation } from "react-router-dom";
import './Sidebar.css'

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <div className="bg-light border-right vh-100" id="sidebar-wrapper" style={{width:'280px'}}>
      <div className="sidebar-heading d-flex align-items-center justify-content-center m-2">
        <h2 style={{color:'#6C63FF', fontWeight:'600'}}>J-SKILL</h2>
      </div>
      <div className="list-group list-group-flush">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`list-group-item d-flex align-items-center justify-content-center p-3 mb-1 list-group-item-action ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;