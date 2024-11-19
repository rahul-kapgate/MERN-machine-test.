import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Employee from "./components/Employee";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";



function App() {
  return (
    <BrowserRouter>
      {/* Routes should be inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employeeForm" element={<EmployeeForm />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/employeeForm/:id" element={<EmployeeForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
