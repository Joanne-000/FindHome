import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getUser } from "../services/userService";
import {
  useQuery,
} from '@tanstack/react-query'
import debug from "debug";

const log = debug("list:Profile");

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  log("user",user)
  const userId = user?.id;

  const { isPending, isError, data, error }  = useQuery({ 
    queryKey: ['profile'], 
    queryFn:  () => getUser(userId) ,  
    enabled: !!user,
    initialData: {
      email: user?.email || "",
      displayname: user?.displayname || "",
      contactnumber: user?.contactnumber || "",
      userrole: user?.userrole || "",
      licenseid: user?.licenseid || "",
      profilephoto: user?.profilephoto || "",
      isactive: user?.isactive || "",
      prefercontactmethod: user?.prefercontactmethod || "",
      preferlocation: user?.preferlocation || "",
      preferbudget: user?.preferbudget || "",
      preferrooms: user?.preferrooms || "",}
  })
  
  if (!user) {
    const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    const clearTimeOut = () => clearTimeout(timeout)
    return clearTimeOut, <p>You are not signed in. You will be directing to sign in page soon...</p>
  }

  if (isPending) {
    return <span className="loading loading-spinner text-warning loading-xl" ></span>
  }

  if (isError) {
    log("error", error.name)
    const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    const clearTimeOut = () => clearTimeout(timeout)
    return clearTimeOut, <span>{error.message}</span>;
  }

  
  const {
    email,
    displayname,
    contactnumber,
    userrole,
    isactive,
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
          <p >Account Type: {userrole}</p>
          <p >Account Statu: {isactive}</p>
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
            <button type="button" onClick={() => navigate("/profile/edit")}>
              Edit
            </button>
            <button  type="button" onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>
    </div>
    </>
  );
};

export default UserProfile;
