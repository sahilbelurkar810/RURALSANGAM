import { Outlet } from "react-router";
import ProtectedNavbar from "../components/ProtectedNavbar";

export default function HomeLayout() {
  return (
    <div>
      <ProtectedNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
