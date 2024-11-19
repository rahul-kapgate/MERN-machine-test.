import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the schema for login
const loginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware to hash the password before saving the user
loginSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export the model
const Login = mongoose.model("Login", loginSchema);
export default Login;
