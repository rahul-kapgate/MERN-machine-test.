import React from "react";
import logo from "../assets/LogoImage.png";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

const EmployeeLayout = () => {

   const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-gray-900 px-6 py-4 shadow-lg">
        <div className="font-bold text-indigo-500 text-xl">
          <img src={logo} alt="Logo" className="h-16 w-auto rounded-full" />
        </div>
        <nav className="flex gap-6 text-sm">
          <Link to="/home" className="cursor-pointer hover:text-indigo-500">
            Home
          </Link>
          <Link
            to="/employees"
            className="cursor-pointer hover:text-indigo-500"
          >
            Employees
          </Link>
          <span className="cursor-pointer hover:text-indigo-500">
            {user.username}
          </span>
          <Link
            to="/"
            onClick={() => alert(`${user.username} Logout`)} // Wrap the alert in a function
            className="hover:text-indigo-500 transition"
          >
            Logout
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 p-8 flex gap-10">
          <h1 className="text-3xl font-bold text-white bg-indigo-600 rounded-2xl p-4 shadow-md">
            <Link
              to="/employeeForm"
              className="block text-center hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out rounded-2xl"
            >
              Create Employee
            </Link>
          </h1>

          <h1 className="text-3xl font-bold text-white bg-indigo-600 rounded-2xl p-4 shadow-md">
            <Link
              to="/employeelist"
              className="block text-center hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out rounded-2xl"
            >
              Employee List
            </Link>
          </h1>
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
