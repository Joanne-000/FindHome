const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("morgan");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const listingRouter = require("./routers/listingRouter");
const favouriteRouter = require("./routers/favouriteRouter");

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 3000;

//frontend domain
const allowedOrigins = [
  "http://localhost:5173",
  "https://findhomeproperty.netlify.app",
];

//connect to postgres
const { pool } = require("./index");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.static("public"));

app.use(express.json());
app.use(logger("dev"));

app.use("/", authRouter);

app.use("/listings", listingRouter);
app.use("/favourites", favouriteRouter);
app.use("/profile", userRouter);
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));

module.exports = { allowedOrigins };
