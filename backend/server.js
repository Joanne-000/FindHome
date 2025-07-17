const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("morgan");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const listingRouter = require("./routers/listingRouter");
const favouriteRouter = require("./routers/favouriteRouter");

const app = express();
const port = 3000;

//connect to postgres
const { pool } = require("./index");

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use("/", authRouter);

app.use("/listings", listingRouter);
app.use("/favourites", favouriteRouter);
app.use("/profile", userRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
