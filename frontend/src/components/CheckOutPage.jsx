import React, { useState, useEffect } from "react";
import premium_user from "../assets/premium_user.png"
import { checkout } from "../services/authService";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";

const Message = ({ message }) => (
<section>
    <p>{message}</p>
</section>
);

const CheckOutPage = () => {
  const navigate = useNavigate()
const [message, setMessage] = useState("");
const { user } = useContext(UserContext);

const userId = user?.id;

useEffect(() => {
  // Check to see if this is a redirect back from Checkout
  const query = new URLSearchParams(window.location.search);
console.log("query",query)
  if (query.get("success")) {
    setMessage("Order placed! You will receive an email confirmation.");
  }

  if (query.get("canceled")) {
    setMessage(
      "Order canceled -- continue to shop around and checkout when you're ready."
    );
  }
}, []);

const handleSubmit = async (evt) => {
    evt.preventDefault();
    await checkout(userId);
  };

return (
    <>
    {message ? (
    <>
        <div className="flex justify-center flex-column py-10 px-4">
            <div className="card w-full text-center p-10 max-w-md bg-base-100 text-lg shadow-xl">
            <Message message={message} />
            </div>
        </div>
        <div className="flex flex-column justify-center">
            <button className="btn" onClick={()=>navigate("/")}>Back to Home</button>
            </div>
    </>) : 
    <>
    <section className="flex justify-center py-10 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div>
                <img src={premium_user} alt="Find Home Premium User" className="object-cover h-55 w-full" />
            </div>
        <div className="card-body items-center text-center">
            <h2 className="card-title text-xl font-bold">Find Home Premium</h2>
            <p className="text-lg text-neutral">Unlock premium features and priority listings.</p>
                <div className="badge badge-warning text-white p-3 mt-2 text-xl">$1.00 / lifetime</div>
                    <form onSubmit={handleSubmit} className="w-full">
                    <button type="submit" className="btn btn-warning w-full mt-4">
                    Checkout
                    </button>
                    </form>
                </div>
        </div>
    </section>
    </>
    }
    </>
  );
}

export default CheckOutPage


