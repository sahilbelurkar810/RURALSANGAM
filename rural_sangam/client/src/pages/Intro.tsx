import React from "react";
import { Link } from "react-router";

function Intro() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1692269726060-9c604e06f63b?q=80&w=1932&auto=format&fit=crop"
          alt="Rural Education"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />

        {/* Overlay Text */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to RuralSangam
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Connecting rural schools with passionate volunteers. Build bridges,
            share knowledge, and create lasting impact across rural India.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Optional: dark overlay if you want even more contrast */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* Other sections below */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-12">
            How RuralSangam Works
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Card 1 */}
            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">For Schools</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Create volunteer requests</li>
                <li>• Connect with mentors</li>
                <li>• Access learning resources</li>
                <li>• Schedule virtual sessions</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">For Volunteers</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Browse opportunities</li>
                <li>• Share expertise</li>
                <li>• Mentor students</li>
                <li>• Impact communities</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600 text-left">
                We bridge the educational gap between urban and rural areas by
                fostering meaningful knowledge exchanges and community
                development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ... you can continue more sections if needed ... */}
      {/* Statistics Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-12">Our Impact</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-5xl font-bold text-blue-600">500+</p>
              <p className="mt-2 text-gray-600">Schools Supported</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-blue-600">1200+</p>
              <p className="mt-2 text-gray-600">Active Volunteers</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-blue-600">10,000+</p>
              <p className="mt-2 text-gray-600">Students Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Whether you're a school seeking support or a volunteer ready to
            contribute, RuralSangam is your platform for change.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Intro;
