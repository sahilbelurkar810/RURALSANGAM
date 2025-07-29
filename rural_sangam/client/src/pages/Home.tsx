import { useAuth } from "../hooks/useAuth";
import { Link, Navigate } from "react-router";

const Home = () => {
  const { user } = useAuth();

  // Redirect users with profiles to their dashboards
  if (user && user.user && user.profile) {
    if (user.user.role === "school") {
      return <Navigate to="/school/dashboard" replace />;
    } else if (user.user.role === "volunteer") {
      return <Navigate to="/volunteer/dashboard" replace />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to RuralSangam</h1>

      {/* Welcome message and instructions */}
      <div className="bg-accent rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        <p className="mb-4">
          Thank you for joining RuralSangam, where schools and volunteers
          connect to make a difference in rural education.
        </p>

        {user?.user?.role === "school" && (
          <div>
            <h3 className="font-medium mb-2">For Schools:</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Complete your school profile</li>
              <li>Create requests for volunteers</li>
              <li>Review volunteer applications</li>
            </ul>
          </div>
        )}

        {user?.user?.role === "volunteer" && (
          <div>
            <h3 className="font-medium mb-2">For Volunteers:</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Complete your volunteer profile</li>
              <li>Browse open requests from schools</li>
              <li>Apply to volunteer opportunities</li>
            </ul>
          </div>
        )}
      </div>

      {/* Call to action */}
      {user && user.user && !user.profile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-yellow-800 mb-4">
            Please complete your profile to get the most out of RuralSangam.
          </p>

          {user.user.role === "school" ? (
            <Link
              to="/school/profile"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Up School Profile
            </Link>
          ) : user.user.role === "volunteer" ? (
            <Link
              to="/volunteer/profile"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Up Volunteer Profile
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Home;
