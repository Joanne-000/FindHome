import { Routes, Route } from "react-router";
// import { useState } from 'react'

import UserDetailForm from "./components/UserDetailForm";

import './App.css'

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/signup" element={<UserDetailForm/>} />
        <Route path="/signin" element={<h1>Sign In</h1>} />
        <Route path="/listings" element={<h1>All Listings</h1>} />
        <Route path="/enquiries" element={<h1>All Enquiries</h1>} />
        <Route path="/listings/:listingsId/edit" element={<h1>Edit 1 Listing</h1>} />
        <Route path="/listings/:listingsId" element={<h1>Display 1 Listing</h1>} />
        <Route path="/:displayname/edit" element={<h1>Edit User Profile</h1>} />
        <Route path="/:displayname" element={<h1>User Profile</h1>} />
        
      </Routes>
    </>
  )
}

export default App
