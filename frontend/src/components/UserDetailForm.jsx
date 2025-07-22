import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";
import { getUser, updateUser, deleteUser } from "../services/userService";
import { NumericFormat } from "react-number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { AxiosError } from "axios";

const log = debug("list:UDF");

const UserDetailForm = ({ userId }) => {
  const queryClient = useQueryClient();
  const isEditing = userId ? true : false;

  const [isDeleting, setIsDelete] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayname: "",
    contactnumber: "",
    userrole: "buyer",
    licenseid: "",
    profilephoto:
      "https://img.iproperty.com.my/angel-legacy/1110x624-crop/static/2019/10/all-about-prop-agents-mainimage.jpg",
    isactive: "active",
    prefercontactmethod: "",
    preferlocation: "",
    preferbudget: 600000,
    preferrooms: 3,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUser(userId);
      setFormData({
        email: userProfile?.email || user?.email || "",
        displayname: userProfile?.displayname || user?.displayname || "",
        contactnumber: userProfile?.contactnumber || user?.contactnumber || "",
        userrole: userProfile?.userrole || user?.userrole || "",
        licenseid: userProfile?.licenseid || user?.licenseid || "",
        profilephoto: userProfile?.profilephoto || user?.profilephoto || "",
        isactive: userProfile?.isactive || user?.isactive || "",
        prefercontactmethod:
          userProfile?.prefercontactmethod || user?.prefercontactmethod || "",
        preferlocation:
          userProfile?.preferlocation || user?.preferlocation || "",
        preferbudget: userProfile?.preferbudget || user?.preferbudget || "",
        preferrooms: userProfile?.preferrooms || user?.preferrooms || "",
      });
    };
    fetchUserProfile();
  }, [userId, user]);

  const createMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (payload) => {
      setUser(payload);
      navigate(`/profile`);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.err);
      } else {
        // Fallback for unexpected error types
        setMessage("An unknown error occurred.");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, formData }) => updateUser(userId, formData),
    onSuccess: (data) => {
      log("updMut", data);
      setUser(data);
      navigate(`/profile`);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.err);
      } else {
        // Fallback for unexpected error types
        setMessage("An unknown error occurred.");
      }
    },
  });
  log(formData);
  const deleteMutation = useMutation({
    mutationFn: ({ userId, formData }) => deleteUser(userId, formData),
    onSuccess: (data) => {
      log("delMut", data);
      setUser("");
      localStorage.removeItem("token");
      navigate(`/`);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.err);
      } else {
        // Fallback for unexpected error types
        setMessage("An unknown error occurred.");
      }
    },
  });

  if (
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending
  ) {
    return <span className="loading loading-spinner text-warning"></span>;
  }

  const {
    email,
    password,
    passwordconf,
    displayname,
    contactnumber,
    userrole,
    licenseid,
    profilephoto,
    isactive,
    prefercontactmethod,
    preferlocation,
    preferbudget,
    preferrooms,
  } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      userrole: role, // Update only userRole
    });
  };

  log("isDelete Out", isDeleting);
  log("isEditing Out", isEditing);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (isEditing) {
      updateMutation.mutate({ userId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (evt) => {
    evt.preventDefault();
    log("inside handle delete 1");
    setIsDelete(true);
    log("inside handle delete formData", formData);

    setFormData({
      ...formData,
      isactive: "deleted", // Update only status
    });

    log("inside shoulddelete", formData);
    deleteMutation.mutate({ userId, formData });
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <fieldset className="bg-base-200 border-base-300 rounded-box border p-6 w-full max-w-md mx-auto">
          <legend className="fieldset-legend text-3xl text-center">
            <h1>{isEditing ? "Edit your Profile" : "Sign Up as a New User"}</h1>
          </legend>
          <div>
            <p className="pb-4 text-xl text-center text-red-500">
              {message ? <span className="font-bold">Warning: </span> : ""}
              {message}
            </p>
          </div>
          <div>
            <p>Fields marked with * are required</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label flex flex-col items-start font-semibold">
                Email *:
                <input
                  className="input validator input-bordered mt-1 w-full"
                  placeholder="mail@site.com"
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  onChange={handleChange}
                  disabled={isEditing ? true : false}
                  required
                />
                <span className="text-xs">
                  Please note that email is not editable after sign up.
                </span>
              </label>
            </div>
            {isEditing && (
              <>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Account Type *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      type="text"
                      id="userrole"
                      value={userrole}
                      name="userrole"
                      disabled={isEditing ? true : false}
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Account Status *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      type="text"
                      id="isactive"
                      value={isactive}
                      name="isactive"
                      disabled={isEditing ? true : false}
                    />
                  </label>
                </div>
              </>
            )}
            {!isEditing && (
              <>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Password *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="Your password"
                      type="password"
                      id="password"
                      value={password}
                      name="password"
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Confirm Password *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="Confirm password"
                      type="password"
                      id="passwordconf"
                      value={passwordconf}
                      name="passwordconf"
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </>
            )}
            <div className="form-control mb-4">
              <label className="label flex flex-col items-start font-semibold">
                Display Name *:
                <input
                  className="input input-bordered mt-1 w-full"
                  placeholder="Karina"
                  type="text"
                  id="displayname"
                  value={displayname}
                  name="displayname"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-control mb-4">
              <label className="label flex flex-col items-start font-semibold">
                Contact Number *:
                <input
                  className="input input-bordered mt-1 w-full"
                  placeholder="12345678"
                  type="text"
                  id="contactnumber"
                  value={contactnumber}
                  name="contactnumber"
                  onChange={handleChange}
                />
              </label>
            </div>
            {!isEditing && (
              <div className="pt-2 pb-4 flex flex-row justify-between">
                <label className="label font-semibold">Account Type *:</label>
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    type="button"
                    className={`btn ${
                      formData.userrole === "agent"
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                    onClick={() => handleRoleChange("agent")}
                  >
                    Agent
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      formData.userrole === "buyer"
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                    onClick={() => handleRoleChange("buyer")}
                  >
                    Buyer
                  </button>
                </div>
              </div>
            )}
            {userrole === "agent" ? (
              <>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    License Id *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="T2555412R"
                      type="text"
                      id="licenseid"
                      value={licenseid}
                      name="licenseid"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Profile Photo *:
                    <textarea
                      className="textarea h-24  textarea-bordered mt-1 w-full"
                      placeholder="https://img.abc123image.jpg"
                      type="url"
                      id="profilephoto"
                      value={profilephoto}
                      name="profilephoto"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Prefer Contact Method *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="whatsapp"
                      type="text"
                      id="prefercontactmethod"
                      value={prefercontactmethod}
                      name="prefercontactmethod"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Prefer Location *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="Tanjung Pagar"
                      type="text"
                      id="preferlocation"
                      value={preferlocation}
                      name="preferlocation"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Prefer Budget *:
                    <NumericFormat
                      prefix={"$"}
                      thousandSeparator={true}
                      allowNegative={false}
                      decimalScale={2}
                      id="preferbudget"
                      value={preferbudget}
                      name="preferbudget"
                      onChange={handleChange}
                      className="input input-bordered"
                      required
                    />
                  </label>
                </div>
                <div className="form-control mb-4">
                  <label className="label flex flex-col items-start font-semibold">
                    Prefer Rooms *:
                    <input
                      className="input input-bordered mt-1 w-full"
                      placeholder="3"
                      type="number"
                      id="preferrooms"
                      value={preferrooms}
                      name="preferrooms"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </>
            )}
            {isEditing ? (
              <div className="label pt-4 flex flex-row justify-center">
                <button type="submit" className="btn">
                  Update Profile
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Delete Profile
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="label pt-4 flex flex-row justify-center">
                <button type="submit" className="btn btn-lg btn-neutral">
                  Sign Up
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
          {!isEditing && (
            <div className="text-center pt-8 ">
              Already have an account?{" "}
              <Link to="/login" className="link text-lg text-primary">
                Login Here
              </Link>
            </div>
          )}
        </fieldset>
      </div>
    </>
  );
};

export default UserDetailForm;
