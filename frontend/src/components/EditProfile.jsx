import UserDetailForm from "./UserDetailForm";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import debug from "debug";

const log = debug("list:Edit Profile");

const EditProfile = () =>{
  log("EditProfile");

    const { user } = useContext(UserContext);
    log("user", user);
    if (!user) {
      return <div>Loading...</div>; // or redirect to signin
    }
    const userId = user.id
    log("userId Usercontect", userId);

    return <UserDetailForm userId={userId} />;
  }

  export default EditProfile