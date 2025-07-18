import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const signUp = async (formData) => {
  try {
    console.log("signup start");
    const res = await axios.post(`${BASE_URL}/signup`, formData);
    const data = await res.data;

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1])).payload;
      return payload;
    }
  } catch (error) {
    console.error(error.response.data.err);
    throw new Error(error);
  }
};

const signIn = async (formData) => {
  try {
    console.log("signin formData", formData);

    const res = await axios.post(`${BASE_URL}/signin`, formData);
    const data = res.data;
    console.log("signin data", res);

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1])).payload;
      console.log(payload);
      return payload;
    }

    throw new Error("Invalid response from server");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export { signUp, signIn };
