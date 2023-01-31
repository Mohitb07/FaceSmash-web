import BottomNavigation from '@/components/BottomNavigation';
import Sidebar from '@/components/SideNavigation';

const Navigation = () => {
  return (
    <>
      <div>
        <Sidebar />
      </div>
      <div className="fixed bottom-0 z-50 w-full bg-slate-900">
        <BottomNavigation />
      </div>
    </>
  );
};
export default Navigation;
