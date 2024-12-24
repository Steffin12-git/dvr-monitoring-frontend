/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react/jsx-pascal-case */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login-ui/Login";
import ListUser from "./admin/user-mngmt/user-list/ListUser.jsx";
import Update_user from "./admin/user-mngmt/user-update/UpdateUser.jsx";
import Delete from "./components/delete-ui/Delete.jsx";
import Signup from "./admin/user-mngmt/user-create/CreateUsers.jsx";
import Devices from "./admin/device-mngmt/device-list/DeviceList.jsx";
import UpdateDevice from "./admin/device-mngmt/device-update/UpdateDevice.jsx";
import Add_Device from "./admin/device-mngmt/device-add/AddDevices.jsx";
import DeviceListUser from "./normal-users/ListDevice.jsx";
import Download_file from "./admin/device-mngmt/config-dwnld/ConfigDownload.jsx";
import Qrcode from "./admin/device-mngmt/qr-display/QrDisplay.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usersList" element={<ListUser />} />
        <Route path="/usersList/update/:id" element={<Update_user />} />
        <Route path="/usersList/add" element={<Signup />} />
        <Route path="/usersList/Delete" element={<Delete />} />
        <Route path="/devicesList" element={<Devices />} />
        <Route path="/devicesList/update/:id" element={<UpdateDevice />} />
        <Route path="/devicesList/add" element={<Add_Device />} />
        <Route path="/devicesList/urlProfiles" element={<DeviceListUser />} />
        <Route path="/devicesList/:id/qrcode" element={<Qrcode />} />
        <Route path="/devicesList/:id/config" element={<Download_file />} />
      </Routes>
    </Router>
  );
}
export default App;
