import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Fotter";

const IntroLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default IntroLayout;
