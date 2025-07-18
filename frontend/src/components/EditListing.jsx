import ListingForm from "./ListingForm";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import debug from "debug";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const log = debug("list:Edit Profile");

const EditListing = () =>{
    log("EditProfile");
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const {listingId} = useParams();

    if (!user) {
        const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    const clearTimeOut = () => clearTimeout(timeout)
    return clearTimeOut, <div>You are not signed in. You will be redirecting to Sign In page soon...</div>; // or redirect to signin
    }

    if (!listingId) {
        const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    const clearTimeOut = () => clearTimeout(timeout)
    return clearTimeOut, <div>Listing ID not found. You will be redirecting to listings page soon...</div>; // or redirect to signin
    }

    return <ListingForm listingId={listingId} />;
  }

  export default EditListing
  
