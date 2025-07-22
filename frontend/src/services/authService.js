import axios from "axios";
import { getUserFromToken } from "../contexts/UserContext";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const signUp = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/signup`, formData);
    const data = await res.data;

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1])).payload;
      return payload;
    }
  } catch (err) {
    console.error(err.response.data.err);
    throw err;
  }
};

const signIn = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/signin`, formData);
    const data = res.data;

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1])).payload;
      return payload;
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getTop5Listings = async () => {
  // userId is from userContext where we setUser during signin.
  // currentUser is get from token when we save suring signin.
  try {
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

const checkout = async (userId) => {
  try {
    const currentUser = await getUserFromToken();

    if (!userId) {
      throw new Error("Please log in");
    }
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized");
    } else {
      const res = await axios.post(
        `${BASE_URL}/${userId}/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const session = await res.data;
      window.location.href = session.url; // Stripe checkout page
    }
  } catch (err) {
    console.log("Stripe session error:", err);
    alert("Payment session failed to start. Please try again.");
    throw err;
  }
};
export { signUp, signIn, getTop5Listings, checkout };
