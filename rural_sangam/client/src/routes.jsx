import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SchoolDashboard from "./pages/SchoolDashboard/SchoolDashboard";
// import VolunteerDashboard from "./pages/VolunteerDashboard/VolunteerDashboard";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import MyRequests from "./pages/SchoolDashboard/MyRequests";
const AppRoutes = () => (
  <Router>
    <Routes>
      {/* <Route path="/school-dashboard" element={<SchoolDashboard />} />
      <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
      <Route
        path="/school/requests"
        element={
          <Layout role="school" user={schoolUser}>
            <MyRequests />
          </Layout>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
