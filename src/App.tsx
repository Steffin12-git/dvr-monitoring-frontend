import {BrowserRouter as Router, Routes,
  Route,
 } from "react-router-dom"
import Login from "./pages/login/Login"
import Home from "./pages/home/Home"
import UsersList from "./pages/admin/users/list/UsersList"
import LocationList from "./pages/admin/locations/list/LocationList"
function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/admin/users" element={<UsersList/>}/>
        <Route path="/admin/locations" element={<LocationList/>}/>
      </Routes>
    </Router>
  )
}

export default App
