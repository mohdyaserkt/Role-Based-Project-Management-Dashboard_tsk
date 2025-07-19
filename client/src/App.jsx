import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./features/auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Signup from "./features/auth/Singup";
import AdminDashboard from "./features/admin/AdminDashboard";
import EmployeeDashboard from "./features/employee/EmployeeDashboard";
import ManagerDashboard from "./features/manager/ManagerDashboard";
import HomePage from "./features/homepage/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/manager"
  element={
    <ProtectedRoute roles={['manager']}>
      <ManagerDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
