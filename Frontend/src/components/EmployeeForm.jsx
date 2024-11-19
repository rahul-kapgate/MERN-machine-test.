import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoImage.png";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";



const EmployeeForm = () => {

   const { user } = useUser();

   const { id } = useParams(); // Get the employee ID from the URL
   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [emailList, setEmailList] = useState(["existing@example.com"]);

 useEffect(() => {
   if (id) {
     const fetchEmployee = async () => {
       try {
         const response = await axios.get(
           `http://localhost:5000/api/employees/${id}`
         );
         console.log("Fetched Employee Data:", response.data);
         setFormData({
           name: response.data.name || "",
           email: response.data.email || "",
           mobile: response.data.mobile || "",
           designation: response.data.designation || "",
           gender: response.data.gender || "",
           courses: response.data.courses || [],
           file: null, // Cannot prepopulate file input
         });
         
       } catch (error) {
         console.error("Error fetching employee data:", error);
       }
     };
     fetchEmployee();
   }
 }, [id]);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    } else if (emailList.includes(formData.email)) {
      newErrors.email = "Email is already taken.";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be numeric.";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }


    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (formData.courses.length === 0)
      newErrors.courses = "Please select at least one course.";

    if (!formData.designation || formData.designation === "") {
      newErrors.designation = "Please select a designation.";
    }

    if (!formData.file) {
      newErrors.file = "Please upload an image.";
    } else if (!["image/jpeg", "image/png"].includes(formData.file.type)) {
      newErrors.file = "Only jpg/png files are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        courses: checked
          ? [...prev.courses, value]
          : prev.courses.filter((course) => course !== value),
      }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare FormData for file upload
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("mobile", formData.mobile);
      dataToSend.append("designation", formData.designation);
      dataToSend.append("gender", formData.gender);
      formData.courses.forEach((course) =>
        dataToSend.append("courses[]", course)
      );
      dataToSend.append("file", formData.file);

      try {
        if (id) {
          console.log("Submitting Data for Edit:", [...dataToSend]);
          await axios.put(
            `http://localhost:5000/api/employees/${id}`,
            dataToSend,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          alert("Employee updated successfully!");
        } else {
          console.log("Submitting Data for Create:", [...dataToSend]);
          await axios.post("http://localhost:5000/api/employees", dataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Employee created successfully!");
        }
        navigate("/employees");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      }

    }
  };

  return (
    <>
      <div className="bg-gray-900 text-gray-300 min-h-screen">
        <header className="flex justify-between items-center bg-gray-800 px-6 py-4 shadow-md">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
            <span className="text-2xl font-bold text-indigo-500">
              Employee Portal
            </span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link to="/home" className="hover:text-indigo-500 transition">
              Home
            </Link>
            <Link to="/employees" className="hover:text-indigo-500 transition">
              Employees
            </Link>
            <span className="hover:text-indigo-500 transition">
              {user.username}
            </span>
            {/* <span className="hover:text-indigo-500 transition">Logout</span> */}
            <Link
              to="/"
              onClick={() => alert(`${user.username} Logout`)} // Wrap the alert in a function
              className="hover:text-indigo-500 transition"
            >
              Logout
            </Link>
          </nav>
        </header>

        <main className="max-w-3xl mx-auto mt-10 bg-gray-800 text-gray-300 p-8 rounded-lg shadow-lg">
          <h1 className="text-center text-3xl font-bold text-indigo-500 mb-6">
            Create Employee
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile No
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Designation Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Designation
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="" disabled>
                  Select your designation
                </option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
                <option value="Developer">Developer</option>
                <option value="Intern">Intern</option>
                <option value="Implementation">Implementation</option>
              </select>
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designation}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={formData.gender === "M"}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={formData.gender === "F"}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  Female
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Courses Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Courses</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value="MCA"
                    checked={formData.courses.includes("MCA")}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  MCA
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value="Mtech"
                    checked={formData.courses.includes("Mtech")}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  M.Tech
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value="Btech"
                    checked={formData.courses.includes("Btech")}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  B.Tech
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value="BCA"
                    checked={formData.courses.includes("BCA")}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  BCA
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value="BSC"
                    checked={formData.courses.includes("BSC")}
                    onChange={handleChange}
                    className="mr-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  BSC
                </label>
              </div>
              {errors.courses && (
                <p className="text-red-500 text-sm mt-1">{errors.courses}</p>
              )}
            </div>

            {/* File Upload Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-300"
              />
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
            >
              Submit
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default EmployeeForm;
