import { useState } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../services/authService";
import isEmail from "validator/lib/isEmail";

const SignInForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userrole: ""
  });
  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
        console.log("submit")
        console.log("formData",formData)

      const signedInUser = await signIn(formData);
      navigate("/")
    //   setUser(signedInUser);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const {
    email,
    password,
    userrole
  } = formData;

  const isFormInvalid = () => {
        const result = isEmail(email) && password.length >2 && password && userrole
        return !result;
  };

  const handleRoleChange = (role) => {
    setFormData({
        ...formData,
      userrole: role // Update only userRole
    });
  };

  return (
    <>
    <div>
      <h1 >Sign In</h1>
      <p >{message}</p>
      <section>
        <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
            <button onClick={() =>handleRoleChange("agent")} type="button">
              Agent
            </button>
            <button onClick={()=>handleRoleChange("buyer")} type="button">
              Buyer
            </button>
            </div>
          <div className="field">
            <label >Email:</label>
            <input
              type="email"
              autoComplete="off"
              id="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          <div >
            <label >Password:</label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button disabled={isFormInvalid()}  type="submit">
              Sign In
            </button>
            <button onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
    </>
  );
};

export default SignInForm;
