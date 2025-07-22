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
app.use(express.json());
app.use(logger("dev"));
app.use("/", authRouter);

app.use("/listings", listingRouter);
app.use("/favourites", favouriteRouter);
app.use("/profile", userRouter);
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
