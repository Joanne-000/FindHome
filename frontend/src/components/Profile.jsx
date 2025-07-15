import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

import { Link, useNavigate } from "react-router";
import { getUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

const UserProfile = () => {
  const { user } = useContext(UserContext);

  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['profile'], queryFn: getUser(user.displayname) })


  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
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
      console.log("useeffect start")      
      console.log("username",user)

      const userProfile = await getUser(user.displayname);
      setProfile({
        email: userProfile.email,
        password: userProfile.password,
        displayname: userProfile.displayname,
        contactnumber: userProfile.contactnumber,        
        userrole: userProfile.userrole,
        licenseid: userProfile.licenseid,
       profilephoto: userProfile.profilephoto,
        isactive: userProfile.isactive,
        prefercontactmethod: userProfile.prefercontactmethod,
        preferlocation: userProfile.preferlocation,
        preferbudget: userProfile.preferbudget,
        preferrooms: userProfile.preferrooms,
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
