import React, { useState } from "react";
import { register } from "../services/authServices";

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
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  };

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="flex h-full items-center justify-center ">
      <div className="bg-base-200 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name <span>*</span>
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-neutral-content text-sm mt-2">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Role <span>*</span>
            </label>
            <select
              id="role"
              className="select select-bordered w-full"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="volunteer">Volunteer</option>
              <option value="school">School</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password <span>*</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reenterPassword"
              className="block text-sm font-medium"
            >
              Re-enter Password <span>*</span>
            </label>
            <input
              type="password"
              id="reenterPassword"
              className="input input-bordered w-full"
              placeholder="Re-enter your password"
              value={formData.reenterPassword}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-neutral-content text-sm mt-2">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn bg-accent hover:bg-neutral w-full cursor-pointer "
            disabled={!isFormValid}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary hover:underline hover:text-secondary"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
