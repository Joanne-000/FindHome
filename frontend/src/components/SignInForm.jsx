import { useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { signIn } from "../services/authService";
import isEmail from "validator/lib/isEmail";
import {
  useMutation,
} from '@tanstack/react-query'
import debug from "debug";
import { AxiosError } from "axios";

const log = debug("list:SIF");

const SignInForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userrole: ""
  });

  const signInMutation = useMutation({
    mutationFn:  () => signIn(formData),
    onSuccess: (payload)=>{
      log(payload)
      setUser(payload);
      navigate(`/listings`)
    },
    onError:(error)=>{
            if (error instanceof AxiosError) {
            setMessage(error.response?.data?.err);
          } else {
            // Fallback for unexpected error types
            setMessage("An unknown error occurred.");
          }}
  })

    if (signInMutation.isPending) {
      return <span className="loading loading-spinner text-warning loading-xl" ></span>
    }

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const {
    email,
    password,
    userrole
  } = formData;

  
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    signInMutation.mutate(formData)
  };

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
  <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
        <p className="pb-4 text-xl text-center text-red-500">{message?<span className="font-bold">Warning: </span>:""}{message}</p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("agent")}
            className={`btn ${formData.userrole === "agent" ? "btn-primary" : "btn-outline"}`}
          >
            Agent
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("buyer")}
            className={`btn ${formData.userrole === "buyer" ? "btn-primary" : "btn-outline"}`}
          >
            Buyer
          </button>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
          <div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Email</span>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="mail@site.com"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
              required
              />
          </label>
          </div>
          <div>
          
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Password</span>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="***"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="btn btn-warning w-1/2"
              disabled={isFormInvalid()}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn btn-outline w-1/3"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>

  );
};

export default SignInForm;
