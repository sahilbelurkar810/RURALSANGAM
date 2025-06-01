import { useState } from "react";
import {
  login as loginService,
  checkAuthStatus,
} from "../services/authServices";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Email and Password are required.");
      setIsLoading(false);
      return;
    }

    try {
      // First login with credentials
      await loginService({ email, password });

      // Then fetch complete user data including profile
      const userData = await checkAuthStatus();
      console.log("Login successful, setting user:", userData);
      setUser(userData);
      navigate("/home"); // Navigate to home instead of dashboard
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-base-100 to-base-300">
      <div className="bg-base-200 p-10 rounded-lg shadow-xl w-full max-w-md border border-base-300">
        <h2 className="text-4xl font-bold mb-8 text-center text-primary">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-base-content mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-base-content mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="checkbox checkbox-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-base-content">
                Remember me
              </label>
            </div>
          </div>
          {error && <div className="p-3 rounded-lg bg-error/10 text-center text-error font-medium">{error}</div>}
          <button
            type="submit"
            className={`btn btn-primary w-full text-primary-content hover:brightness-110 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? 
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </span> : 
              "Login"
            }
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-base-content">
          Not registered?{" "}
          <a
            href="/signup"
            className="font-semibold text-primary hover:text-secondary transition-colors"
          >
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
