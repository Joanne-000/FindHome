import { useEffect, useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";
import { getUser, updateUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";
import {
  useMutation,
} from '@tanstack/react-query'


const UserDetailForm = ({userId}) => {
  const isEditing = userId ? true : false;


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
        profilephoto: "",
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
      console.log(payload)
      setUser(payload);
      navigate(`/profile`)
    }})

    
    const updateMutation = useMutation({
      mutationFn: ({ userId, formData }) => updateUser(userId, formData),
      onSuccess: (payload)=>{
        console.log(payload)
        setUser(payload);
        navigate(`/profile`)
      }})

    if (createMutation.isPending || updateMutation.isPending) {
      return <progress />
    }

    if (createMutation.isError) {
    return <span> {createMutation.error.message}</span>
    }
    if ( updateMutation.isError) {
      return <span> {updateMutation.error.message}</span>
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
  console.log("formData",formData)

  const handleSubmit = async (evt) => {
    if(isEditing){
      console.log("userId,formData",userId,formData)
      evt.preventDefault();
      updateMutation.mutate({ userId,formData })
    }else{
    evt.preventDefault();
    createMutation.mutate(formData)
    }
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
        {isEditing && 
            <div >
        <label >Account Type *:
        <input
          type="String"
          id="userrole"
          value={userrole}
          name="userrole"
          disabled={isEditing? true : false}
          />
        </label>
      </div>}
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
            type="String"
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
            type="String"
            id="licenseid"
            value={licenseid}
            name="licenseid"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Profile Photo *:
          <input
            type="String"
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
            type="String"
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
            type="String"
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
            type="Number"
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
            type="Number"
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
            <button type="button" onClick={() => setIsModalOpen(true)}>
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
    {isEditing ? (
    <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
      <div onClick={() => setIsModalOpen(false)}></div>

      <div >
        <header >
          <p >Confirm Profile Deletion</p>
          <button aria-label="close" onClick={() => setIsModalOpen(false)}></button>
        </header>

        <section >
          <p>This action cannot be undone. Are you sure you want to continue?</p>
        </section>

        <footer >
          <button
            onClick={() => {
              handleDelete()
              setIsModalOpen(false);
            }}
          >
            Confirm
          </button>
          <button onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </footer>
      </div>
    </div>): ""}
    </>
  );
};

export default UserDetailForm;
