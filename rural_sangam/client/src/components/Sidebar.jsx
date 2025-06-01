import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  const links = {
    school: [
      { name: "My Requests", path: "/school/requests" },
      { name: "Create Request", path: "/school/create" },
      { name: "Collaborations", path: "/school/collaborations" },
    ],
    volunteer: [
      { name: "Open Requests", path: "/volunteer/requests" },
      { name: "My Applications", path: "/volunteer/applications" },
      { name: "Collaborations", path: "/volunteer/collaborations" },
    ],
    admin: [
      { name: "All Users", path: "/admin/users" },
      { name: "Requests", path: "/admin/requests" },
      { name: "Reports", path: "/admin/reports" },
    ],
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen border-r">
      <h2 className="text-xl font-bold mb-4 capitalize">{role} Dashboard</h2>
      <nav className="space-y-2">
        {links[role].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="block text-blue-600 hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
