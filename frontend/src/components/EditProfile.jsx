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
      const timeout = setTimeout(() => navigate("/signin"),(1000*5))
      const clearTimeOut = () => clearTimeout(timeout)
      return clearTimeOut, (
        <div className="flex justify-center">
          <p>You are not signed in. You will be directing to sign in page soon...</p>
        </div>
    )}
    const userId = user?.id
    log("userId Usercontect", userId);

    return <UserDetailForm userId={userId} />;
  }

  export default EditProfile