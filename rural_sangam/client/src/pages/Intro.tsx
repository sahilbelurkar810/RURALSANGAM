import React from "react";
import { Link } from "react-router";

function Intro() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-primary">
            Welcome to RuralSangam
          </h1>
          <p className="py-6 text-lg">
            Connecting communities, fostering growth. Find your perfect match,
            explore opportunities, and build lasting relationships in the heart
            of rural India.
          </p>
          <div className="space-x-4">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
