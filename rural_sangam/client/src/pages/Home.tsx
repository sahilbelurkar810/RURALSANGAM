import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background image with blur for entire page */}
      <div className="fixed inset-0">
        <div className="w-full h-full bg-[url('/hero-image.jpg')] bg-cover bg-center blur-sm opacity-20" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-accent text-white min-h-screen">
        {/* Background hero image with blur */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[url('/hero-image.jpg')] bg-cover bg-center blur-sm opacity-50" />
        </div>
        {/* Additional full height image covering half width */}
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <div className="w-full h-full bg-[url('/hero-image.jpg')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Welcome to RuralSangam</h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8">
                Connecting schools and volunteers to transform rural education together
              </p>
              {!user && (
                <Link to="/register" className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white text-accent rounded-lg font-semibold hover:bg-gray-100 transition">
                  Join Our Mission
                </Link>
              )}
            </div>
            <div className="flex justify-center">
              {/* Removed placeholder since we're using background image */}
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome message for logged in users */}
        {user && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-400">Getting Started</h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Thank you for joining RuralSangam, where schools and volunteers
              connect to make a difference in rural education.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {user?.user?.role === "school" && (
                <div className="bg-blue-50/90 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-blue-400">For Schools:</h3>
                  <ul className="space-y-2 sm:space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Complete your school profile
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Create requests for volunteers
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Review volunteer applications
                    </li>
                  </ul>
                </div>
              )}

              {user?.user?.role === "volunteer" && (
                <div className="bg-green-50/90 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-blue-400">For Volunteers:</h3>
                  <ul className="space-y-2 sm:space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Complete your volunteer profile
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Browse open requests from schools
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Apply to volunteer opportunities
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to action for incomplete profiles */}
        {user && user.user && !user.profile && (
          <div className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-200 rounded-lg p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-yellow-800 mb-0">
                  Please complete your profile to get the most out of RuralSangam.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                {user.user.role === "school" ? (
                  <Link
                    to="/school/profile"
                    className="w-full sm:w-auto inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                  >
                    Set Up School Profile
                  </Link>
                ) : user.user.role === "volunteer" ? (
                  <Link
                    to="/volunteer/profile"
                    className="w-full sm:w-auto inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                  >
                    Set Up Volunteer Profile
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-blue-400">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                <img src="/school-icon.png" alt="School Registration" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-400">Schools Register</h3>
              <p className="text-gray-600">Create a profile and post volunteer requirements</p>
            </div>
            <div className="text-center bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                <img src="/volunteer-icon.png" alt="Volunteer Connection" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-400">Volunteers Connect</h3>
              <p className="text-gray-600">Browse opportunities and apply to help</p>
            </div>
            <div className="text-center bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                <img src="/impact-icon.png" alt="Making Impact" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-400">Make an Impact</h3>
              <p className="text-gray-600">Work together to improve rural education</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
