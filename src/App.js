/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react/jsx-pascal-case */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/Login";
import ListUser from "./admin/user-mngmt/user-list/ListUser.jsx";
import Update_user from "./admin/user-mngmt/user-update/UpdateUser.jsx";
import Delete from "./components/delete-modal/Delete.jsx";
import Signup from "./admin/user-mngmt/user-create/CreateUsers.jsx";
import Devices from "./admin/device-mngmt/device-list/DeviceList.jsx";
import UpdateDevice from "./admin/device-mngmt/device-update/UpdateDevice.jsx";
import Add_Device from "./admin/device-mngmt/device-add/AddDevices.jsx";
import DeviceListUser from "./pages/home/ListDevice.jsx";
import Download_file from "./admin/device-mngmt/config-dwnld/ConfigDownload.jsx";
import Qrcode from "./admin/device-mngmt/qr-display/QrDisplay.jsx";
import ScrollbarStyles from "./components/shared/ScrollBarStyles.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import NotFound from "./components/shared/NotFound.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected routes for admin and normal user */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[]}>
              <DeviceListUser />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        {/* Protected routes for admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ListUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/update/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Update_user />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Signup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/Delete"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Delete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Devices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations/update/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateDevice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Add_Device />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations/:id/qrcode"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Qrcode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations/:id/config"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Download_file />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollbarStyles />
    </Router>
  );
}
export default App;
