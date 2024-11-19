import React, { createContext, useState, useContext } from "react";

// Create a context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "", // You can replace this with actual data from an API or authentication system
  });

  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user data
export const useUser = () => {
  return useContext(UserContext);
};
