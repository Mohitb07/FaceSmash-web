import BottomNavigation from '../components/BottomNavigation';
import Sidebar from '../components/SideNavigation';

const Navigation = () => {
  return (
    <>
      <div>
        <Sidebar />
      </div>
      <div className="bg-slate-900 fixed z-50 bottom-0 w-full">
        <BottomNavigation />
      </div>
    </>
  );
};
export default Navigation;
