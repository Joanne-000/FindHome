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

  const { isLoading, isError, data, error }  = useQuery({ 
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

  if (isLoading) {
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
    <div className="w-full min-h-screen flex justify-center items-start pt-12 bg-base-100">
      <div className="w-full max-w-5xl md:w-3/5 bg-base-200 shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-bold text-center mb-10">User Profile</h1>
  
        {/* Profile Info Grid */}
        <div className="grid md:grid-cols-2 gap-10 text-lg">
          <div>
            <p className="font-semibold">📧 Email:</p>
            <p className="mb-4">{email}</p>
  
            <p className="font-semibold">👤 Display Name:</p>
            <p className="mb-4">{displayname}</p>
  
            <p className="font-semibold">📞 Contact Number:</p>
            <p className="mb-4">{contactnumber}</p>
  
            <p className="font-semibold">👥 Account Type:</p>
            <p className="mb-4 capitalize">{userrole}</p>
  
            <p className="font-semibold">✅ Account Status:</p>
            <p className="mb-4">{isactive ? "Active" : "Inactive"}</p>
          </div>
  
          <div>
            {userrole === "agent" ? (
              <>
                <p className="font-semibold">🪪 License ID:</p>
                <p className="mb-4">{licenseid}</p>
  
                <p className="font-semibold">🖼️ Profile Photo:</p>
                {profilephoto ? (
                  <img
                    src={profilephoto}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border mb-4"
                  />
                ) : (
                  <p className="text-gray-500 mb-4">No photo uploaded</p>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold">📬 Preferred Contact Method:</p>
                <p className="mb-4">{prefercontactmethod}</p>
  
                <p className="font-semibold">📍 Preferred Location:</p>
                <p className="mb-4">{preferlocation}</p>
  
                <p className="font-semibold">💰 Preferred Budget:</p>
                <p className="mb-4">{preferbudget}</p>
  
                <p className="font-semibold">🛏️ Preferred Rooms:</p>
                <p className="mb-4">{preferrooms}</p>
              </>
            )}
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="mt-10 flex justify-center gap-6">
          <button
            className="btn btn-primary text-lg px-6"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-outline text-lg px-6"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
