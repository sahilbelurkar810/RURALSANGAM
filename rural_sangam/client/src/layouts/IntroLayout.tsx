import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const IntroLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="p-4 flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export default IntroLayout;
