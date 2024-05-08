import './App.css';
import Department from './Departments/Department';
import {Home} from './Home/Home';
import Doctor from './Doctors/Doctor';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import Departmentdetails from './Departments/Departmentdetails';


function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        Hospital Management System
      </h3>
        
      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/departments">
              Departments
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/doctor">
              Doctor
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/departments/:id" element={<Departmentdetails/>} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
