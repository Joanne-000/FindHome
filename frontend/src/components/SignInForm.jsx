import { useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { signIn } from "../services/authService";
import isEmail from "validator/lib/isEmail";
import {
  useMutation,
} from '@tanstack/react-query'

const SignInForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userrole: ""
  });

  const {mutate,isPending, isError, error } = useMutation({
    mutationFn:  signIn,
    onSuccess: (payload)=>{
      console.log(payload)
      setUser(payload);
      navigate(`/profile`)
    }})

    if (isPending) {
      return <progress />
    }

    if (isError) {
      return <pre> {JSON.stringify(error,null,2)}</pre>
    }
  
  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    mutate(formData)
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
