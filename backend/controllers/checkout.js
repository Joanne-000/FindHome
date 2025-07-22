const { loadUserFromToken } = require("../middleware/utils");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const checkout = async (req, res) => {
  const currentUser = loadUserFromToken(req);

  const userId = req.params.userId;
  if (currentUser.id !== userId) {
    throw new Error("Unauthorized User");
  }

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
};

module.exports = {
  checkout,
};
