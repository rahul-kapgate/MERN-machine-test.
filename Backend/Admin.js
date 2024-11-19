// import mongoose from "mongoose";
// import Login from "./models/login.model.js"; // Update this with the correct path

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/test", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB:", err));

// // Data for two users
// const users = [
//   {
//     username: "user1",
//     password: "password123",
//   },
//   {
//     username: "user2",
//     password: "password456",
//   },
// ];

// // Insert the users into the database
// async function createUsers() {
//   try {
//     for (const user of users) {
//       const newUser = new Login(user);
//       await newUser.save();
//     }
//     console.log("Users added successfully");
//   } catch (err) {
//     console.error("Error adding users:", err);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// createUsers();
