import { useState } from "react";
import { Link, useNavigate } from "react-router";
// import { signUp } from "../services/authService";
// import { getUser, updateUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";

const UserDetailForm = ({userId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
        password:"",
        displayName: "",
        contactNumber: "",        
        userRole: "buyer",
        agentId: "",
        isActive: "active",
        preferContactMethod: "",
        preferLocation: "",
        preferBudget: "",
        preferRooms:"",
  });

  const isEditing = userId ? true : false;

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const userProfile = await getUser(userId);
//       setFormData({
//         email: userProfile.email,
//         password: userProfile.password,
//         displayName: userProfile.displayName,
//         contactNumber: userProfile.contactNumber,        
//         userRole: userProfile.userRole,
//         agentId: userProfile.agentId,
//         isActive: userProfile.isActive,
//         preferContactMethod: userProfile.preferContactMethod,
//         preferLocation: userProfile.preferLocation,
//         preferBudget: userProfile.preferBudget,
//         preferRooms: userProfile.preferRooms,
//       });
//     };
//     fetchUserProfile();
//   }, [userId]);

  const {
      email,
      password,
      passwordConf,
      displayName,
      contactNumber,
      userRole,
      agentId,
      profilePhoto,
      isActive,
      preferContactMethod, 
      preferLocation,
      preferBudget,
      preferRooms,
  } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({
        ...formData,
      userRole: role // Update only userRole
    });
  };

  const handleSubmit = async (evt) => {
//     evt.preventDefault();
//     try {
//       if (isEditing) {
//         const updateProfile = await updateUser(userId, formData);
//         // setUser(updateProfile);
//       } else {
//         const newUser = await signUp(formData);
//         // setUser(newUser);
//         setTimeout(() => {
//           navigate(`/reservations`);
//         }, 1500);
//       }
//     } catch (err) {
//       setMessage(err.message);
//     }
console.log("submit")
  };

  console.log(formData.userRole)
//   const handleDelete = async () => {
//     await deleteUser(userId);
//     // setUser("");
//     localStorage.removeItem("token")
//     navigate(`/`);
//   }
  const isFormInvalid = () => {
    // if(isEditing){
    //   if(contactNumber.length === 0 ){
    //     const result = displayName.length >2 && birthday 
    //     return !result;
    //   }else{
    //     const result = contactNumber.length >7 && displayName.length >2 && birthday
    //     return !result;
    //   }
    // }else{
    //   if(contactNumber.length === 0 ){
    //     const result = displayName.length >2 && birthday && isEmail(email) && password.length >2 && password === passwordConf
    //     return !result;
    //   }else{
    //     const result = contactNumber.length >7 && displayName.length >2 && birthday && isEmail(email) && password.length >2 && password === passwordConf
    //     return !result;
    //   }
    // }
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
        {!isEditing && (
          <>
            <div >
              <label>Email *: 
              <input
                type="email"
                id="email"
                value={email}
                name="email"
                onChange={handleChange}
                required
                />
                <p>Please note that email is not editable after sign up.</p>
              </label>
            </div>
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
                id="confirm"
                value={passwordConf}
                name="passwordConf"
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
            id="displayName"
            value={displayName}
            name="displayName"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
          <label >Contact Number:
          <input
            type="String"
            id="contactNumber"
            value={contactNumber}
            name="contactNumber"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
        <button type="button" onClick={() => handleRoleChange("agent")}>
        Agent
      </button>
      <button type="button" onClick={() => handleRoleChange("buyer")}>
        Buyer
      </button>
        </div>
        {userRole === "agent" ? 
        <>
        <div >
          <label >Agent Id:
          <input
            type="String"
            id="agentId"
            value={agentId}
            name="agentId"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Profile Photo:
          <input
            type="String"
            id="profilePhoto"
            value={profilePhoto}
            name="profilePhoto"
            onChange={handleChange}
            />
          </label>
        </div>
        </>
        :
        <>
        <div >
          <label >Prefer Contact Method:
          <input
            type="String"
            id="preferContactMethod"
            value={preferContactMethod}
            name="preferContactMethod"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Location:
          <input
            type="String"
            id="preferLocation"
            value={preferLocation}
            name="preferLocation"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Budget:
          <input
            type="Number"
            id="preferBudget"
            value={preferBudget}
            name="preferBudget"
            onChange={handleChange}
            />
          </label>
        </div>
        <div >
          <label >Prefer Rooms:
          <input
            type="Number"
            id="preferRooms"
            value={preferRooms}
            name="preferRooms"
            onChange={handleChange}
            />
          </label>
        </div>
        </>
        }
        {isEditing ? (
          <div >
            <button type="submit" disabled={isFormInvalid()}>
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
              disabled={isFormInvalid()}
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
