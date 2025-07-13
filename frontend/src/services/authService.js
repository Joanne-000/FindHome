import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const signUp = async (formData) => {
  try {
    console.log("signup start");
    const res = await axios.post(`${BASE_URL}/signup`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    const data = res.data;
    console.log("signup data", res.data);

    if (data.err) {
      console.log(data.err);
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      return JSON.parse(atob(data.token.split(".")[1])).payload;
    }
  } catch (error) {
    console.error(error.response.data.err);
  }
};

const signUpOld = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      return JSON.parse(atob(data.token.split(".")[1])).payload;
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
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
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { signUp, signIn };
