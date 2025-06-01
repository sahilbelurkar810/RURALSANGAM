import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, role, user }) {
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
