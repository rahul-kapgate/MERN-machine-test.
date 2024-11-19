import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoImage.png";
import axios from "axios"; // Import Axios
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx"; 


const EmployeeList = () => {
  const { user } = useUser();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Ensure this is declared at the top

  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const pageSize = 5;

  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch employee data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic: Slice the array based on current page and pageSize
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/employees/${id}`
        );
        // Ensure the response is successful before updating the state
        if (response.status === 200) {
          setEmployees(employees.filter((emp) => emp.id !== id)); // Remove deleted employee from the list
        }
      } catch (err) {
        alert(
          `Failed to delete employee: ${
            err.response ? err.response.data.message : err.message
          }`
        );
      }
    }
  };

  //handle Edit
  const handleEdit = (id) => {
    // Navigate to the edit page, passing the employee id
    navigate(`/employeeForm/${id}`);
  };

  // Toggle Active/Deactive
  const toggleStatus = (id) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === "Active" ? "Deactive" : "Active" }
          : emp
      )
    );
  };

  if (loading) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  const totalPages = Math.ceil(filteredEmployees.length / pageSize); // Total pages

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
      {/* Header */}
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
            onClick={() => alert(`${user.username} Logout`)}
            className="hover:text-indigo-500 transition"
          >
            Logout
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-indigo-500">Employee List</h1>
          <Link
            to="/employeeForm"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Create Employee
          </Link>
        </header>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Search Keyword"
            className="border border-gray-600 p-2 rounded flex-1 bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Search
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="border border-gray-600 p-2">ID</th>
              <th className="border border-gray-600 p-2">Image</th>
              <th className="border border-gray-600 p-2">Name</th>
              <th className="border border-gray-600 p-2">Email</th>
              <th className="border border-gray-600 p-2">Mobile</th>
              <th className="border border-gray-600 p-2">Designation</th>
              <th className="border border-gray-600 p-2">Status</th>
              <th className="border border-gray-600 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="text-center bg-gray-800">
                  <td className="border border-gray-600 p-2">{emp.id}</td>
                  <td className="border border-gray-600 p-2">
                    <img
                      src={emp.image || "/fallback-image-url"}
                      alt={emp.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="border border-gray-600 p-2">{emp.name}</td>
                  <td className="border border-gray-600 p-2">{emp.email}</td>
                  <td className="border border-gray-600 p-2">{emp.mobile}</td>
                  <td className="border border-gray-600 p-2">
                    {emp.designation}
                  </td>
                  <td className="border border-gray-600 p-2">
                    <button
                      className={`px-4 py-1 rounded ${
                        emp.status === "Active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => toggleStatus(emp.id)}
                    >
                      {emp.status}
                    </button>
                  </td>
                  <td className="border border-gray-600 p-2">
                    <button
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => handleEdit(emp.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="border border-gray-600 p-2 text-center text-gray-400"
                >
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-indigo-600`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;
