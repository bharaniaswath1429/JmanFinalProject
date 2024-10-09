// import { NavLink } from 'react-router-dom';
// import {managerlinks, adminlinks, employeelinks} from '../utils/links';

// const NavLinks = ({ toggleSidebar, userType}) => {

//   let links = employeelinks;
//   if(userType === 'manager'){
//     links = managerlinks
//   }

//   return (
//     <div className='nav-links'>
//       {links.map((link) => {
//         const { text, path, id, icon } = link;
//         return (
//           <NavLink
//             to={path}
//             className={({ isActive }) => {
//               return isActive ? 'nav-link active' : 'nav-link';
//             }}
//             key={id}
//             onClick={toggleSidebar}
//             end
//           >
//             <span className='icon'>{icon}</span>
//             <span style={{color:'#6C63FF'}}>{text}</span>
//           </NavLink>
//         );
//       })}
//     </div>
//   );
// };
// export default NavLinks;


import { NavLink } from 'react-router-dom';
import { managerlinks, adminlinks, employeelinks } from '../utils/links';

const NavLinks = ({ toggleSidebar, userType }) => {
  let links;

  // Determine which links to use based on the userType
  switch (userType) {
    case 'manager':
      links = managerlinks;
      break;
    case 'admin':
      links = adminlinks;
      break;
    default:
      links = employeelinks;
  }

  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon } = link;
        return (
          <NavLink
            to={path}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            key={id}
            onClick={toggleSidebar}
            end
          >
            <span className='icon'>{icon}</span>
            <span style={{ color: '#6C63FF' }}>{text}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
