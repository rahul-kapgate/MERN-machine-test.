import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser"; 
import multer from "multer";
import Employee from "./models/employ.model.js";
import Login from "./models/login.model.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());                // for coss origin
app.use(express.json());        // json data
app.use(bodyParser.json());     // Middleware to parse JSON requests
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));


// Database conetion
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected !!");
  })
  .catch((error) => {
    console.log("Connetion Faild !!", error);
  });


// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// API endpoint for login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Api endpoint for Form data to store in db
app.post("/api/employees", upload.single("file"), async (req, res) => {
  const { name, email, mobile, designation, gender, courses } = req.body;
  const file = req.file;

  // Validate required fields
  if (
    !name ||
    !email ||
    !mobile ||
    !designation ||
    !gender ||
    !courses ||
    !file
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Create a new employee document in the existing Employee collection
  const newEmployee = new Employee({
    name,
    email,
    mobile,
    designation,
    gender,
    courses: courses.join(", "),
  });

  try {
    // Save the employee document to the existing Employee collection
    await newEmployee.save();

    // If a file is uploaded, you can also save the file path in the database
    const filePath = `/uploads/${file.filename}`; // This is the file path after it's uploaded
    console.log("File uploaded:", filePath); // You can store the file path in the employee document if needed

    // Send a success response
    res.status(200).json({ message: "Employee data saved successfully!" });
  } catch (error) {
    console.error("Error saving employee data:", error);
    res.status(500).json({ message: "Failed to save employee data." });
  }
});


// API Endpoint to Fetch all Employees:
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});


//Delete endpoint
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the format of the custom id (since it's a Number, not ObjectId)
  if (isNaN(id)) {
    return res.status(400).send({ message: "Invalid Employee ID format" });
  }

  try {
    // Delete the employee by custom id
    const deletedEmployee = await Employee.deleteOne({ id: Number(id) });

    if (deletedEmployee.deletedCount === 0) {
      return res.status(404).send({ message: "Employee not found" });
    }

    res.status(200).send({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});



// API Endpoint to Edit Employee:
app.put("/api/employees/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, courses } = req.body;
  const file = req.file;

  // Validate required fields
  if (!name || !email || !mobile || !designation || !gender || !courses) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Check if employee exists
    const employee = await Employee.findOne({ id: Number(id) });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee fields
    employee.name = name;
    employee.email = email;
    employee.mobile = mobile;
    employee.designation = designation;
    employee.gender = gender;

    // Handle courses (ensure array or parse string)
    const coursesArray = Array.isArray(courses) ? courses : courses.split(", ");
    employee.courses = coursesArray.join(", ");

    // Handle file upload
    if (file) {
      employee.filePath = `/uploads/${file.filename}`;
    }

    // Save the updated document
    await employee.save();

    // Send updated employee in response
    res.status(200).json({
      message: "Employee updated successfully!",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Failed to update employee data." });
  }
});




//Api endpoint to get data of one employee to Edit it
app.get("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the employee by custom `id` (or use ObjectId if necessary)
    const employee = await Employee.findOne({ id: Number(id) }); // For custom `id`
    // or use ObjectId if you're using MongoDB's default ObjectId
    // const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Send the employee data as response
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Failed to fetch employee data" });
  }
});



// API endpoint to get logged-in user's username
app.get("/api/auth/username", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find the user in the database based on the provided username
    const user = await Login.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct using bcrypt compare
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Return the username if the password matches
      return res.status(200).json({ username: user.username });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});






// API endpoint to fetch stored images




app.get("/", (req, res) => {
  res.send("Server is On........");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
