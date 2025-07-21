import UserDetailForm from "./UserDetailForm";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import debug from "debug";

const log = debug("list:Edit Profile");

const EditProfile = () =>{
  const navigate = useNavigate();

  log("EditProfile");

    const { user } = useContext(UserContext);
    log("user", user);
    if (!user) {
      setTimeout(() => navigate("/signin"),(1000*5))
      return <div>You are not signed in. You will be redirecting to Sign In page soon...</div>; // or redirect to signin
    }
    const userId = user?.id
    log("userId Usercontect", userId);

    return <UserDetailForm userId={userId} />;
  }

  export default EditProfile