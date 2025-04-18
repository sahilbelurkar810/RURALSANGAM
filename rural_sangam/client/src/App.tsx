import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";

function LoginPage() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default LoginPage;
