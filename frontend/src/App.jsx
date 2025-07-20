

import './App.css'
import debug from "debug";
import { Routes, Route } from "react-router";
// import { useState } from 'react'


import UserDetailForm from "./components/UserDetailForm";
import SignInForm from "./components/SignInForm";
import UserProfile from "./components/Profile";
import EditProfile from './components/EditProfile';
import ListingsPage from './components/ListingsPage';
import OneListingPage from './components/OneListingPage';
import ListingForm from './components/ListingForm';
import EditListing from './components/EditListing';
import FavPage from './components/FavPage';

const log = debug("list:App");

function App() {
  
  log("Loading Routes");
  return (
    <>
    <Routes>
    <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/signup" element={<UserDetailForm/>} />
        <Route path="/signin" element={<SignInForm/>} />
        <Route path="/listings" element={<ListingsPage/>} />
        <Route path="/favourites" element={<FavPage/>} />
        <Route path="/listings/new" element={<ListingForm/>} />
        <Route path="/listings/:listingId/edit" element={<EditListing/>} />
        <Route path="/listings/:listingId" element={<OneListingPage/>} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        
      </Routes>
    </>
  )
}

export default App
