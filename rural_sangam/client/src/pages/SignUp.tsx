import React, { useState } from "react";
import { register, checkAuthStatus } from "../services/authServices";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    role: "volunteer",
    password: "",
    reenterPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors((prev) => ({
        ...prev,
        email: isEmailValid ? "" : "Invalid email address",
      }));
    }

    if (id === "reenterPassword" || id === "password") {
      const arePasswordsSame =
        id === "reenterPassword"
          ? value === formData.password
          : value === formData.reenterPassword;
      setErrors((prev) => ({
        ...prev,
        password: arePasswordsSame ? "" : "Passwords do not match",
      }));
    }
  };

  const validateForm = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const arePasswordsSame = formData.password === formData.reenterPassword;
    const areFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    setIsFormValid(isEmailValid && arePasswordsSame && areFieldsFilled);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const userData = await checkAuthStatus();
      console.log("Registration successful, setting user:", userData);
      setUser(userData);
      navigate("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12 bg-gradient-to-b from-black to-black">
      <div className="bg-black p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl w-full max-w-md lg:max-w-lg transform transition-all duration-300 hover:scale-[1.02] text-white from-black to-black">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-10 text-center text-blue-600 bg-clip-text">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 from-black to-black">
          <div className="space-y-3 md:space-y-4">
            <label htmlFor="name" className="block text-sm font-bold tracking-wide text-white">
              Name <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full focus:ring-4 focus:ring-blue-400 transition-all duration-300 rounded-md shadow-sm bg-gray-700 text-white"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-3 md:space-y-4">
            <label htmlFor="email" className="block text-sm font-bold tracking-wide text-white">
              Email <span className="text-blue-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full focus:ring-4 focus:ring-blue-400 transition-all duration-300 rounded-md shadow-sm bg-gray-700 text-white"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.email}</p>
            )}
          </div>
          <div className="space-y-3 md:space-y-4">
            <label htmlFor="role" className="block text-sm font-bold tracking-wide text-white">
              Role <span className="text-blue-400">*</span>
            </label>
            <select
              id="role"
              className="select select-bordered w-full focus:ring-4 focus:ring-blue-400 transition-all duration-300 rounded-md shadow-sm bg-gray-700 text-white"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="volunteer">Volunteer</option>
              <option value="school">School</option>
            </select>
          </div>
          <div className="space-y-3 md:space-y-4">
            <label htmlFor="password" className="block text-sm font-bold tracking-wide text-white">
              Password <span className="text-blue-400">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full focus:ring-4 focus:ring-blue-400 transition-all duration-300 rounded-md shadow-sm bg-gray-700 text-white"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-3 md:space-y-4">
            <label htmlFor="reenterPassword" className="block text-sm font-bold tracking-wide text-white">
              Re-enter Password <span className="text-blue-400">*</span>
            </label>
            <input
              type="password"
              id="reenterPassword"
              className="input input-bordered w-full focus:ring-4 focus:ring-blue-400 transition-all duration-300 rounded-md shadow-sm bg-gray-700 text-white"
              placeholder="Re-enter your password"
              value={formData.reenterPassword}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.password}</p>
            )}
          </div>
          {error && (
            <div className="p-4 rounded-xl bg-red-900 text-red-200 text-center text-sm font-medium border border-red-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 w-full text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-4 ring-blue-400"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing up...</span>
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 md:mt-8 text-center text-sm font-medium text-white">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
