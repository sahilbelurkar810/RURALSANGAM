import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Fotter";

const IntroLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default IntroLayout;
