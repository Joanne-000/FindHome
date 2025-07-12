const express = require("express");
require("dotenv").config();

const pg = require("pg");
const { Pool } = pg;

const connection = process.env.PGCONNECT;

const pool = new Pool({ connectionString: connection });
const client = await pool.connect();

const res = await client.query("SELECT $1::text as message", ["Hello world!"]);
console.log(res.rows[0].message);

try {
  await client.query("BEGIN");
  console.log("start");

  await client.query(
    `DROP TABLE IF EXISTS agents, users,properties,favourites,images,interests CASCADE;`
  );
  console.log("creating");

  await client.query(
    `CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,  
    password VARCHAR NOT NULL,
    displayName VARCHAR NOT NULL,
    contactNumber VARCHAR NOT NULL,
    userRole VARCHAR NOT NULL,
    agentId VARCHAR NOT NULL,
    profilePhoto VARCHAR NOT NULL,
    isActive VARCHAR NOT NULL,
    timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );

  await client.query(
    `CREATE TABLE  IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,  
   password VARCHAR NOT NULL,
   displayName VARCHAR NOT NULL,
   contactNumber VARCHAR NOT NULL,
   userRole VARCHAR NOT NULL,
   preferContactMethod VARCHAR NOT NULL,
    preferLocation VARCHAR NOT NULL,
    preferBudget Numeric(12,2) NOT NULL,
    preferRooms INT NOT NULL,
    isActive VARCHAR NOT NULL,
    timestamptz TIMESTAMPTZ DEFAULT now()
 )
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS properties (
   id SERIAL PRIMARY KEY,
 	agent_id INT REFERENCES agents(id) NOT NULL,  
   propertyName VARCHAR NOT NULL,
   address VARCHAR NOT NULL,
   price Numeric(12,2) NOT NULL,
   town VARCHAR NOT NULL,
   nearestMRT VARCHAR NOT NULL,
   unitSize INT NOT NULL,
   bedroom INT NOT NULL,
   bathroom INT NOT NULL,
   typeOfLease VARCHAR NOT NULL,
   description VARCHAR,
   timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS favourites (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id) NOT NULL,
   property_id INT REFERENCES properties(id) NOT NULL
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS images (
   id SERIAL PRIMARY KEY,
 	property_id INT REFERENCES properties(id) NOT NULL
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS interests (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id) NOT NULL,
 	agent_id INT REFERENCES agents(id) NOT NULL    ,
    timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );
  console.log("inserting 1");

  const agentText1 =
    "insert into agents (email, password, displayname, contactNumber, userRole, agentId, profilePhoto, isActive) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id";
  const agentValue1 = [
    "philip123@gmail.com",
    "123",
    "Philip Tan",
    "22223333",
    "agent",
    "12345678",
    "https://sbr.com.sg/sites/default/files/users/user3327/rsz_my-passport-photo_2.jpg",
    "active",
  ];

  const agentId = await client.query(agentText1, agentValue1);
  console.log("agentId", agentId.rows[0].id);

  console.log("inserting 2");

  const userText1 =
    "insert into users (email, password, displayName, contactNumber, userRole, preferContactMethod, preferLocation,preferBudget,preferRooms, isActive) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id";
  const userValue1 = [
    "janice222@gmail.com",
    "222",
    "Janice",
    "22222222",
    "user",
    "Whatsapp",
    "Bedok",
    600000,
    "3",
    "active",
  ];
  const userValue2 = [
    "michael666@gmail.com",
    "666",
    "Michael",
    "66666666",
    "user",
    "Whatsapp",
    "Jurong",
    750000,
    "3",
    "active",
  ];

  const userId1 = await client.query(userText1, userValue1);
  //   const userId2 = await client.query(userText1, userValue2);

  console.log("inserting 3");

  const propertyText1 =
    "insert into properties (agent_id, propertyName, address, price, town, nearestMRT, unitSize ,bedroom,bathroom, typeOfLease, description) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id";
  const propertyValue1 = [
    agentId.rows[0].id,
    "Blk 222 Bedok North",
    "#11-222 Blk 222 Bedok North, Singpore 476222",
    630000,
    "Bedok",
    "Bedok",
    93,
    3,
    2,
    "99-year lease",
    "NA",
  ];
  const propertyValue2 = [
    agentId.rows[0].id,
    "Blk 144 Jurong East",
    "#03-002 Blk 144 Jurong East Drive 3, Singpore 632114",
    530000,
    "Jurong East",
    "Jurong East",
    89,
    3,
    2,
    "99-year lease",
    "NA",
  ];
  const propertyId1 = await client.query(propertyText1, propertyValue1);
  const propertyId2 = await client.query(propertyText1, propertyValue2);

  console.log("inserting 4");

  const favouriteText1 =
    "insert into favourites (user_id, property_id) values ($1,$2) returning id";
  const favouriteValue1 = [userId1.rows[0].id, propertyId1.rows[0].id];
  const favouriteValue2 = [userId1.rows[0].id, propertyId2.rows[0].id];
  await client.query(favouriteText1, favouriteValue1);
  await client.query(favouriteText1, favouriteValue2);

  const interestText1 =
    "insert into interests (user_id, agent_id) values ($1,$2) returning id";
  const interestValue1 = [userId1.rows[0].id, agentId.rows[0].id];
  const interestValue2 = [userId1.rows[0].id, agentId.rows[0].id];
  await client.query(interestText1, interestValue1);
  await client.query(interestText1, interestValue2);

  await client.query("COMMIT");
  console.log("done");

  const agents = await client.query("SELECT * FROM agents");
  console.log("agents", agents.rows[0]);
  const users = await client.query("SELECT * FROM users");
  console.log("users", users.rows[0]);
  const properties = await client.query("SELECT * FROM properties");
  console.log("properties", properties.rows[0]);
  const favourites = await client.query("SELECT * FROM favourites");
  console.log("favourites", favourites.rows[0]);
  const interests = await client.query("SELECT * FROM interests");
  console.log("interests", interests.rows[0]);

  client.release();
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
}
