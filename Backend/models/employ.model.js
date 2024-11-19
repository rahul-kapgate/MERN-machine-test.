import mongoose from "mongoose";

const EmploySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    courses: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate an incremental ID
EmploySchema.pre("save", async function (next) {
  if (!this.id) {
    // Get the highest current ID in the collection
    const lastEmployee = await Employee.findOne().sort({ id: -1 }).exec();
    this.id = lastEmployee ? lastEmployee.id + 1 : 1; // Increment ID or start at 1
  }
  next();
});

// Save to the 'Employee' collection
const Employee = mongoose.model("Employee", EmploySchema);

export default Employee;
