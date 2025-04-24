const Login = () => {
  return (
    <div className="flex h-full items-center justify-center ">
      <div className="bg-base-200 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select id="role" className="select select-bordered w-full">
              <option value="volunteer">Volunteer</option>
              <option value="school">School</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="checkbox checkbox-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn bg-accent hover:bg-neutral w-full"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Not registered?{" "}
          <a
            href="/signup"
            className="text-primary hover:underline hover:text-secondary"
          >
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
