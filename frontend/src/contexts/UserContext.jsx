import { createContext, useState } from "react";
import debug from "debug";

const log = debug("list:user context");

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1])).payload;
};

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());
  const value = { user, setUser };
  log("delMut", user);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { getUserFromToken, UserProvider, UserContext };
