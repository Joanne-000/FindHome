import { useEffect, useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";
import { getUser, updateUser,deleteUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";
import {
  useMutation,
} from '@tanstack/react-query'
import debug from "debug";
import { AxiosError } from "axios";

const log = debug("list:UDF");

const UserDetailForm = ({userId}) => {
  const isEditing = userId ? true : false;

  const [isDeleting , setIsDelete] = useState(false);

  const { setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password:"",
    displayname: "",
    contactnumber: "",        
    userrole: "buyer",
    licenseid: "",
    profilephoto: "https://img.iproperty.com.my/angel-legacy/1110x624-crop/static/2019/10/all-about-prop-agents-mainimage.jpg",
    isactive: "active",
    prefercontactmethod: "",
    preferlocation: "",
    preferbudget: "",
    preferrooms:"",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUser(userId);
      setFormData({
        email: userProfile?.email || "",
      displayname: userProfile?.displayname || "",
      contactnumber: userProfile?.contactnumber || "",
      userrole: userProfile?.userrole || "",
      licenseid: userProfile?.licenseid || "",
      profilephoto: userProfile?.profilephoto || "",
      isactive: userProfile?.isactive || "",
      prefercontactmethod: userProfile?.prefercontactmethod || "",
      preferlocation: userProfile?.preferlocation || "",
      preferbudget: userProfile?.preferbudget || "",
      preferrooms: userProfile?.preferrooms || "",
      });
    };
    fetchUserProfile();
  }, [userId]);

  const createMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (payload)=>{
      setUser(payload);
      navigate(`/profile`)
    },
    onError:(error)=>{
      if (error instanceof AxiosError) {
      setMessage(error.response?.data?.err);
    } else {
      // Fallback for unexpected error types
      setMessage("An unknown error occurred.");
    }},
})
    
    const updateMutation = useMutation({
      mutationFn: ({ userId, formData }) => updateUser(userId, formData),
      onSuccess: (data)=>{
        log("updMut",data)
        setUser(data);
        navigate(`/profile`)
      },
      onError:(error)=>{
        if (error instanceof AxiosError) {
        setMessage(error.response?.data?.err);
      } else {
        // Fallback for unexpected error types
        setMessage("An unknown error occurred.");
      }}})

      const deleteMutation = useMutation({
        mutationFn: ({ userId, formData }) => deleteUser(userId, formData),
        onSuccess: (data)=>{
          log("delMut",data)
          setUser("");
          localStorage.removeItem("token");
          navigate(`/`)    
        },
        onError:(error)=>{
          if (error instanceof AxiosError) {
          setMessage(error.response?.data?.err);
        } else {
          // Fallback for unexpected error types
          setMessage("An unknown error occurred.");
        }}})
  
    if (createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) {
      return <progress />
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
      userrole: role // Update only userRole
    });
  };

  log("isDelete Out",isDeleting )
  log("isEditing Out",isEditing)

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(isEditing ){
      updateMutation.mutate({ userId,formData })
    } else{
    createMutation.mutate(formData)
    }
  };

  const handleDelete = (evt) => {
    evt.preventDefault();
    log("inside handle delete 1")
    setIsDelete(true)
    log("inside handle delete formData",formData)

    setFormData({
      ...formData,
      isactive: "deleted" // Update only status
    })

      log("inside shoulddelete", formData)
      deleteMutation.mutate({ userId,formData })

    };


  return (
    <>
    <div>
      <h1>
        {isEditing ? "Edit your Profile" : "Sign Up as a New User"}
      </h1>
      <p >Fields marked with * are required</p>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
      <div >
              <label>Email *: 
              <input
                type="email"
                id="email"
                value={email}
                name="email"
                onChange={handleChange}
                disabled={isEditing? true : false}
                required
                />
                <p>Please note that email is not editable after sign up.</p>
              </label>
            </div>
        {isEditing && (
          <>
          <div >
          <label >Account Type *:
          <input
            type="text"
            id="userrole"
            value={userrole}
            name="userrole"
            disabled={isEditing? true : false}
            />
          </label>
        </div>
            <div >
        <label >Account Status *:
        <input
          type="text"
          id="isactive"
          value={isactive}
          name="isactive"
          disabled={isEditing? true : false}
          />
        </label>
      </div>
          </>)}
        {!isEditing && (
          <>
            <div>
              <label >Password *:
              <input
                type="password"
                id="password"
                value={password}
                name="password"
                onChange={handleChange}
                required
              />
            </label>
            </div>              
            <div >
              <label >Confirm Password *:
              <input
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
        <div >
          <label >Display Name *:
          <input
            type="text"
            id="displayname"
            value={displayname}
            name="displayname"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
          <label >Contact Number *:
          <input
            type="text"
            id="contactnumber"
            value={contactnumber}
            name="contactnumber"
            onChange={handleChange}
          />
          </label>
        </div>
        {!isEditing && (

        <div >
        <button type="button" onClick={() => handleRoleChange("agent")}>
        Agent
      </button>
      <button type="button" onClick={() => handleRoleChange("buyer")}>
        Buyer
      </button>
        </div>)}
        {userrole === "agent" ? 
        <>
        <div >
          <label >License Id *:
          <input
            type="text"
            id="licenseid"
            value={licenseid}
            name="licenseid"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Profile Photo *:
          <textarea
            type="url"
            id="profilephoto"
            value={profilephoto}
            name="profilephoto"
            onChange={handleChange}
            />
          </label>
        </div>
        </>
        :
        <>
        <div >
          <label >Prefer Contact Method *:
          <input
            type="text"
            id="prefercontactmethod"
            value={prefercontactmethod}
            name="prefercontactmethod"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Location *:
          <input
            type="text"
            id="preferlocation"
            value={preferlocation}
            name="preferlocation"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Budget *:
          <input
            type="number"
            id="preferbudget"
            value={preferbudget}
            name="preferbudget"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Rooms *:
          <input
            type="number"
            id="preferrooms"
            value={preferrooms}
            name="preferrooms"
            onChange={handleChange}
            />
          </label>
        </div>
        </>
        }
        {isEditing ? (
          <div >
            <button type="submit" >
              Update Profile
            </button>
            <button type="button" onClick={handleDelete} disabled={isDeleting }>
              Delete Profile
            </button>
            <button  type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        ) : (
          <div >
            <button
              type="submit"
            >
              Sign Up
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        )}
      </form>
      {!isEditing && (
        <Link to="/login">
          Already have an account? Login Here
        </Link>
      )}
    </div>
    </>
  );
};

export default UserDetailForm;
