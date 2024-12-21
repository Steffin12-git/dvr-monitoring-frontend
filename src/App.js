/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react/jsx-pascal-case */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login/Login";
import ListUser from "./Admin/Users/ListUser/ListUser";
import Update_user from "./Admin/Users/UpdateUser/Update_user";
import Delete from "./Components/Delete/Delete";
import Signup from "./Admin/Users/AddNewUser/Signup.jsx";
import Devices from "./Admin/Devices_list/Devices/Devices.jsx";
import UpdateDevice from "./Admin/Devices_list/Update_Device/UpdateDevice.jsx";
import Add_Device from "./Admin/Devices_list/Device_Add/Add_Device.jsx";
import DeviceListUser from "./Users/DeviceListUser.jsx";
import Download_file from "./Admin/Devices_list/Config_download/Download_file.jsx";
import Qrcode from "./Admin/Devices_list/Qrcode/Qrcode.jsx";

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
