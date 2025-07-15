import './App.css'
import { Routes, Route } from "react-router";
// import { useState } from 'react'


import UserDetailForm from "./components/UserDetailForm";
import SignInForm from "./components/SignInForm";
import UserProfile from "./components/Profile";
import EditProfile from './components/EditProfile';


function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/signup" element={<UserDetailForm/>} />
        <Route path="/signin" element={<SignInForm/>} />
        <Route path="/listings" element={<h1>All Listings</h1>} />
        <Route path="/favourites" element={<h1>All favourites</h1>} />
        <Route path="/listings/:listingsId/edit" element={<h1>Edit 1 Listing</h1>} />
        <Route path="/listings/:listingsId" element={<h1>Display 1 Listing</h1>} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        
      </Routes>
    </>
  )
}

export default App
