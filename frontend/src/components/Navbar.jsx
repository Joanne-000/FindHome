import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import FindHome from "../assets/FindHome.png";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("You have signed out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar bg-base-100 shadow-sm px-4 h-20">
      <div className="navbar-start ">
        <Link to="/" className=" text-xl">
          <img src={FindHome} alt="Logo" className="h-20 w-25 mr-2" />
        </Link>
      </div>

      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal text-xl ">
          <li>
            <Link to="/listings" className="hover:bg-yellow-300">
              Listings
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/favourites" className="hover:bg-yellow-300">
                  Favourites
                </Link>
              </li>
              {user && user.userrole === "agent" ? (
                <li>
                  <Link to="/enquiries" className="hover:bg-yellow-300">
                    Enquiries
                  </Link>
                </li>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="navbar-end hidden lg:flex text-lg">
        <ul className="menu menu-horizontal text-xl ">
          {user && user.userrole === "agent" ? (
            <li>
              <Link
                to="/listings/new"
                className="hover:bg-yellow-300 text-neutral btn btn-soft btn-warning text-xl"
              >
                Add Listing
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="navbar-end hidden lg:flex text-lg">
        <ul className="menu menu-horizontal text-xl ">
          {user ? (
            <>
              <li>
                <Link to="/profile" className="hover:bg-yellow-300 text-xl">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:bg-yellow-300 text-xl"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup" className="hover:bg-yellow-300 text-xl">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:bg-yellow-300 text-xl">
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
