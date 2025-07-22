import axios from "axios";
import { getUserFromToken } from "../contexts/UserContext";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getUser = async (userId) => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
    const currentUser = await getUserFromToken();

    if (!userId) {
      throw new Error("Please log in");
    }
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.get(`${BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.status !== 200) throw new Error("Failed to show user details");
      const data = await res.data;

      if (data.err) {
        throw new Error(data.err);
      }
      return data;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateUser = async (userId, userFormData) => {
  try {
    const currentUser = getUserFromToken();

    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.put(`${BASE_URL}/${userId}/edit`, userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) throw new Error("Failed to update user details");

      const data = await res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        const payload = getUserFromToken();
        return payload;
      }

      if (data.err) {
        throw new Error(data.err);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// if users were to delete an account, we will set it as inactive instead of deleting them
const deleteUser = async (userId, userFormData) => {
  try {
    const currentUser = getUserFromToken();
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.put(`${BASE_URL}/${userId}/del`, userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) throw new Error("Failed to update user details");

      const data = await res.data;
      if (data.token) {
        return;
      }

      if (data.err) {
        throw new Error(data.err);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getUser, updateUser, deleteUser };
