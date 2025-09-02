import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <Navbar/>
        <main className="p-4">
          <Outlet /> {/* renders child pages etc. */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
