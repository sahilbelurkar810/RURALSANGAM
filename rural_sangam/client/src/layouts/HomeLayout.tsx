import { Outlet } from "react-router-dom";
import ProtectedNavbar from "../components/ProtectedNavbar";
import Footer from "../components/Fotter";
export default function HomeLayout() {
  return (
    <div>
      <ProtectedNavbar />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
