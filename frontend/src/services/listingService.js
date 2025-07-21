import axios from "axios";
import { getUserFromToken } from "../contexts/UserContext";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/listings`;

const getAllListings = async () => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
    console.log("get listings start");

    const res = await axios.get(`${BASE_URL}`);

    if (res.status !== 200) throw new Error("Failed to show listings");
    const data = await res.data;

    if (data.err) {
      throw new Error(data.err);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getOneListing = async (listingId) => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
    console.log("get 1 listing start");
    console.log("listingId", listingId);

    const res = await axios.get(`${BASE_URL}/${listingId}`);

    if (res.status !== 200) throw new Error("Failed to show 1 listing");
    const data = await res.data;

    if (data.err) {
      throw new Error(data.err);
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const createListing = async (userId, userFormData) => {
  try {
    const currentUser = getUserFromToken();
    console.log(userFormData);

    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.post(`${BASE_URL}/${userId}/new`, userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) throw new Error("Failed to update user details");

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

const updateListing = async (userId, listingId, userFormData) => {
  try {
    const currentUser = getUserFromToken();
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.put(
        `${BASE_URL}/${userId}/${listingId}/edit`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) throw new Error("Failed to update user details");

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

const deleteListing = async (userId, listingId, userFormData) => {
  console.log("userFormData in service", userFormData);

  try {
    const currentUser = getUserFromToken();
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.put(
        `${BASE_URL}/${userId}/${listingId}/del`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) throw new Error("Failed to update user details");

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

export {
  getAllListings,
  getOneListing,
  createListing,
  updateListing,
  deleteListing,
};
