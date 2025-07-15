const express = require("express");
require("dotenv").config();
const pg = require("pg");
const cors = require("cors");
const logger = require("morgan");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const listingRouter = require("./routers/listingRouter");
const favouriteRouter = require("./routers/favouriteRouter");

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
app.use("/favourites", favouriteRouter);
app.use("/profile", userRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}`));

async function checkPasswordEncryption() {
  try {
    const client = await pool.connect();

    // Query to check password encryption setting
    const res = await client.query("SHOW password_encryption;");
    console.log("Password Encryption:", res.rows[0].password_encryption);

    // Always release the client when done
    client.release();
  } catch (err) {
    console.error("Error checking password encryption:", err);
  }
}

// Call the function to check password encryption
checkPasswordEncryption();
