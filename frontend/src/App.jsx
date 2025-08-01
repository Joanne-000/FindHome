import "./App.css";
import debug from "debug";
import { Routes, Route } from "react-router";

import UserDetailForm from "./components/UserDetailForm";
import SignInForm from "./components/SignInForm";
import UserProfile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ListingsPage from "./components/ListingsPage";
import OneListingPage from "./components/OneListingPage";
import ListingForm from "./components/ListingForm";
import EditListing from "./components/EditListing";
import FavPage from "./components/FavPage";
import NavBar from "./components/Navbar";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import CheckOutPage from "./components/CheckOutPage";

const log = debug("list:App");

function App() {
  log("Loading Routes");
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<UserDetailForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/favourites" element={<FavPage />} />
        <Route path="/listings/new" element={<ListingForm />} />
        <Route path="/listings/:listingId/edit" element={<EditListing />} />
        <Route path="/listings/:listingId" element={<OneListingPage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
