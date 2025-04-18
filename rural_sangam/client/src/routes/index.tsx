import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Intro from "../pages/Intro";
import IntroLayout from "../layouts/IntroLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<IntroLayout />}>
        <Route path="/" element={<Intro />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
