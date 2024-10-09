import NavLinks from './NavLinks';
import Logo from '../components/Logo';
import Wrapper from '../wrappers/BigSidebar';

const BigSidebar = ({ isSidebarOpen, userType}) => {
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen
            ? 'sidebar-container'
            : 'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks userType={userType}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;

