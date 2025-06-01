export default function Topbar({ user }) {
  return (
    <header className="bg-white border-b px-4 py-2 flex justify-between items-center">
      <div className="text-lg font-semibold">RuralSangam</div>
      <div className="text-sm text-gray-600">
        Welcome, {user?.name || "User"}
      </div>
    </header>
  );
}
