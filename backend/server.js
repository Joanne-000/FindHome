const express = require("express");
require("dotenv").config();
const pg = require("pg");
const cors = require("cors");
const logger = require("morgan");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const listingRouter = require("./routers/listingRouter");
const enquiryRouter = require("./routers/enquiryRouter");

const app = express();
const port = 3000;

// Import routers from controllers

//connect to postgres
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

pool.connect().catch((err) => {
  console.error("Database connection failed:", err);
});

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use("/", authRouter);

app.use("/listings", listingRouter);
app.use("/enquiries", enquiryRouter);
app.use("/:displayname", userRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
