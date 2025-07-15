import axios from "axios";
import { getUserFromToken } from "../contexts/UserContext";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getUser = async (userId) => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
    console.log("get user start");

    const currentUser = await getUserFromToken();

    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      console.log("get user");
      const res = await axios.get(`${BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("res", res);

      // if (!res.ok) throw new Error("Failed to show user details");
      const data = await res.data;
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
      const res = await axios.put(`${BASE_URL}/${userId}`, userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
