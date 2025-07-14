import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Link, useNavigate } from "react-router";
import { getUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";

const UserProfile = () => {
  const userId = useParams()
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    password:"",
    displayName: "",
    contactNumber: "",        
    userRole: "buyer",
    licenseId: "",
    profilephoto: "",
    isActive: "active",
    preferContactMethod: "",
    preferLocation: "",
    preferBudget: "",
    preferRooms:"",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUser(userId);
      setProfile({
        email: userProfile.email,
        password: userProfile.password,
        displayname: userProfile.displayName,
        contactnumber: userProfile.contactNumber,        
        userrole: userProfile.userRole,
        licenseid: userProfile.licenseId,
       profilephoto: userProfile.profilephoto,
        isactive: userProfile.isActive,
        prefercontactmethod: userProfile.preferContactMethod,
        preferlocation: userProfile.preferLocation,
        preferbudget: userProfile.preferBudget,
        preferrooms: userProfile.preferRooms,
      });
    };
    fetchUserProfile();
  }, []);

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
  } = profile;


  return (
    <>
    <div>
      <h1>
        User's profile
      </h1>
       <div >
         <p>Email: {email}</p>
          <p >Display Name: {displayname}</p>
          <p >Contact Number: {contactnumber}</p>
        </div>
        {userrole === "agent" ? 
        <div >
          <p >License Id: {licenseid}</p>
          <p >Profile Photo: {profilephoto} </p>
        </div>
        :
        <div >
          <p >Prefer Contact Method: {prefercontactmethod}</p>
          <p >Prefer Location: {preferlocation}</p>
          <p >Prefer Budget: {preferbudget}</p>
          <p >Prefer Rooms: {preferrooms} </p>
        </div>
        }
          <div >
            <button type="button">
              Edit
            </button>
            <button type="button" onClick={() => setIsModalOpen(true)}>
              Delete
            </button>
            <button  type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
    </div>
    </>
  );
};

export default UserProfile;
