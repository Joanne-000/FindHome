// import { getUserFromToken } from "../contexts/UserContext";
const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1])).payload;
};

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getUser = async (userId) => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
    const currentUser = getUserFromToken();
    if (currentUser._id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await fetch(`${BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // if (!res.ok) throw new Error("Failed to show user details");
      const data = await res.json();
      if (data.err) {
        throw new Error(data.err);
      }
      return data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const updateUser = async (userId, userFormData) => {
  try {
    const currentUser = getUserFromToken();
    if (currentUser._id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await fetch(`${BASE_URL}/${userId}/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        const payload = getUserFromToken();
        return payload;
      }

      if (data.err) {
        throw new Error(data.err);
      }
      return data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// if users were to delete an account, we will set it as inactive instead of deleting them
const deleteUser = async (userId, userFormData) => {
  try {
    const currentUser = getUserFromToken();
    if (currentUser._id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await fetch(`${BASE_URL}/${userId}/delete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      });
      const data = await res.json();
      if (data.err) {
        throw new Error(data.err);
      }
      return data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { getUser, updateUser, deleteUser };
