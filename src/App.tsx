import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import UsersList from "./pages/admin/users/list/UsersList";
import LocationList from "./pages/admin/locations/list/LocationList";
import UrlProfilesList from "./pages/admin/urlProfiles/list/UrlProfilesList";
import ClientList from "./pages/admin/clients/list/ClientList";
import ProtectedRoute from "./utils/ProtectedRoute";
import NotFound from "./utils/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={ <ProtectedRoute allowedRoles={[]}> <Home /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LocationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/urlProfiles"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UrlProfilesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ClientList />
            </ProtectedRoute>
          }
        />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
