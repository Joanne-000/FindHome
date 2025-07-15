import UserDetailForm from "./UserDetailForm";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const EditProfile = () =>{
  console.log("EditProfile");

    const { user } = useContext(UserContext);
    console.log("user", user);

    const userId = user.id
    console.log("userId Usercontect", userId);

    return <UserDetailForm userId={userId} />;
  }

  export default EditProfile