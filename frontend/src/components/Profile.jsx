import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

import { Link, useNavigate } from "react-router";
import { getUser } from "../services/userService";
// import { deleteUser } from "../services/userService";
// import isEmail from "validator/lib/isEmail";
import {
  useQuery,
} from '@tanstack/react-query'

const UserProfile = () => {
  const { user } = useContext(UserContext);

  const { isPending, isError, data, error }  = useQuery({ 
    queryKey: ['profile'], 
    queryFn: async () => await getUser(user.id) ,
    placeholderData: {
      email: user.email,
      displayname: user.displayname,
      contactnumber: user.contactnumber,        
      userrole: user.userrole,
      licenseid: user.licenseid,
      profilephoto: user.profilephoto,
      isactive: user.isactive,
      prefercontactmethod: user.prefercontactmethod,
      preferlocation: user.preferlocation,
      preferbudget: user.preferbudget,
      preferrooms: user.preferrooms,}
  })

  if (isPending) {
    return <progress />
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  console.log(data)

  const navigate = useNavigate();
  
  const {
    email,
    displayname,
    contactnumber,
    userrole,
    licenseid,
    profilephoto,
    prefercontactmethod,
    preferlocation,
    preferbudget,
    preferrooms,
  } = data;

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
            <button type="button">
              Delete
            </button>
            <button  type="button">
              Cancel
            </button>
          </div>
    </div>
    </>
  );
};

export default UserProfile;
