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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-base-100 to-base-300">
      <div className="bg-base-200 p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-accent">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold">
              Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full focus:ring-2 focus:ring-accent transition-all"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full focus:ring-2 focus:ring-accent transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold">
              Role <span className="text-accent">*</span>
            </label>
            <select
              id="role"
              className="select select-bordered w-full focus:ring-2 focus:ring-accent transition-all"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="volunteer">Volunteer</option>
              <option value="school">School</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password <span className="text-accent">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full focus:ring-2 focus:ring-accent transition-all"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reenterPassword" className="block text-sm font-semibold">
              Re-enter Password <span className="text-accent">*</span>
            </label>
            <input
              type="password"
              id="reenterPassword"
              className="input input-bordered w-full focus:ring-2 focus:ring-accent transition-all"
              placeholder="Re-enter your password"
              value={formData.reenterPassword}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {error && (
            <div className="p-3 rounded bg-error bg-opacity-10 text-error text-center text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn bg-accent hover:bg-accent-focus w-full text-white font-semibold transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:text-accent-focus font-semibold transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
