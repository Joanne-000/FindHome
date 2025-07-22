const verifyToken = require("../middleware/verify-token");
const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authController");
const { getTop5Properties } = require("../controllers/showListings");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.get("/", getTop5Properties);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/create-checkout-session", async (req, res) => {
  console.log("Creating Stripe session...");
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: process.env.PRICE_SECRET,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/checkout?success=true`,
    cancel_url: `http://localhost:5173/checkout?canceled=true`,
  });

  res.json({ url: session.url });
  console.log("Session URL:", session.url);
  // res.redirect(303, session.url);
});
module.exports = router;
