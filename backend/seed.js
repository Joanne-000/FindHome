const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");

const pg = require("pg");
const { Pool } = pg;

const connection = process.env.PGCONNECT;

const pool = new Pool({ connectionString: connection });
const client = await pool.connect();

const res = await client.query("SELECT $1::text as message", ["Hello world!"]);
console.log(res.rows[0].message);
const saltRounds = 12;

try {
  await client.query("BEGIN");
  console.log("start");

  await client.query(
    `DROP TABLE IF EXISTS agents, buyers,properties,favourites,images,interests CASCADE;`
  );
  console.log("creating");

  await client.query(
    `CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,  
    hashedpw VARCHAR NOT NULL,
    displayname VARCHAR NOT NULL,
    contactnumber VARCHAR NOT NULL,
    userrole VARCHAR NOT NULL,
    licenseid VARCHAR NOT NULL,
    profilephoto VARCHAR NOT NULL,
    isactive VARCHAR NOT NULL,
    timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );

  await client.query(
    `CREATE TABLE  IF NOT EXISTS buyers (
   id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,  
   hashedpw VARCHAR NOT NULL,
   displayname VARCHAR NOT NULL,
   contactnumber VARCHAR NOT NULL,
   userrole VARCHAR NOT NULL,
   prefercontactmethod VARCHAR NOT NULL,
    preferlocation VARCHAR NOT NULL,
    preferbudget Numeric(12,2) NOT NULL,
    preferrooms INT NOT NULL,
    isactive VARCHAR NOT NULL,
    timestamptz TIMESTAMPTZ DEFAULT now()
 )
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS properties (
   id SERIAL PRIMARY KEY,
 	agent_id INT REFERENCES agents(id) NOT NULL,  
   propertyname VARCHAR NOT NULL,
   address VARCHAR NOT NULL,
   price Numeric(12,2) NOT NULL,
   town VARCHAR NOT NULL,
   nearestmrt VARCHAR NOT NULL,
   unitsize INT NOT NULL,
   bedroom INT NOT NULL,
   bathroom INT NOT NULL,
   typeoflease VARCHAR NOT NULL,
   description VARCHAR,
   status VARCHAR NOT NULL,
   timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS favourites (
   id SERIAL PRIMARY KEY,
   buyer_id INT REFERENCES buyers(id) NOT NULL,
   property_id INT REFERENCES properties(id) NOT NULL
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS images (
   id SERIAL PRIMARY KEY,
   imageurl VARCHAR NOT NULL,
 	property_id INT REFERENCES properties(id) NOT NULL
  );
  `
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS interests (
   id SERIAL PRIMARY KEY,
   buyer_id INT REFERENCES buyers(id) NOT NULL,
 	agent_id INT REFERENCES agents(id) NOT NULL    ,
    timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
  );
  console.log("inserting 1");

  const hashedPWAgent = await bcrypt.hash("123", saltRounds);

  const agentText1 =
    "insert into agents (email, hashedpw, displayname, contactnumber, userrole, licenseid, profilephoto, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id";
  const agentValue1 = [
    "philip123@gmail.com",
    hashedPWAgent,
    "Philip Tan",
    "22223333",
    "agent",
    "12345678",
    "https://sbr.com.sg/sites/default/files/users/user3327/rsz_my-passport-photo_2.jpg",
    "active",
  ];
  const agentValue2 = [
    "jessie123@hotmail.com",
    hashedPWAgent,
    "Jessie",
    "22223333",
    "agent",
    "12345678",
    "https://sbr.com.sg/sites/default/files/users/user3327/rsz_my-passport-photo_1.jpg",
    "active",
  ];
  const agentId1 = await client.query(agentText1, agentValue1);
  const agentId2 = await client.query(agentText1, agentValue2);

  console.log("agentId", agentId1.rows[0].id);

  console.log("inserting 2");
  const hashedPWBuyer1 = await bcrypt.hash("222", saltRounds);
  const hashedPWBuyer2 = await bcrypt.hash("666", saltRounds);

  const buyerText1 =
    "insert into buyers (email, hashedpw, displayname, contactnumber, userrole,prefercontactmethod, preferlocation, preferbudget, preferrooms, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id";
  const buyerValue1 = [
    "janice222@gmail.com",
    hashedPWBuyer1,
    "Janice",
    "22222222",
    "buyer",
    "Whatsapp",
    "Bedok",
    600000,
    "3",
    "active",
  ];
  const buyerValue2 = [
    "michael666@gmail.com",
    hashedPWBuyer2,
    "Michael",
    "66666666",
    "buyer",
    "Whatsapp",
    "Jurong",
    750000,
    "3",
    "active",
  ];

  const buyerId1 = await client.query(buyerText1, buyerValue1);
  const buyerId2 = await client.query(buyerText1, buyerValue2);

  console.log("inserting 3");

  const propertyText1 =
    "insert into properties (agent_id, propertyname, address, price, town, nearestmrt, unitsize ,bedroom,bathroom, typeoflease, description, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id";
  const propertyValue1 = [
    agentId1.rows[0].id,
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
    "available",
  ];
  const propertyValue2 = [
    agentId1.rows[0].id,
    "Blk 144 Jurong East",
    "#03-002 Blk 144 Jurong East Drive 3, Singpore 632114",
    650000,
    "Jurong East",
    "Jurong East",
    89,
    3,
    2,
    "99-year lease",
    "NA",
    "available",
  ];
  const propertyValue3 = [
    agentId1.rows[0].id,
    "Blk 106 Jurong North Street 4",
    "#06-112 Blk 106 Jurong North Street 4, Singpore 633106",
    530000,
    "Jurong North",
    "Jurong East",
    89,
    3,
    2,
    "99-year lease",
    "NA",
    "available",
  ];
  const propertyValue4 = [
    agentId2.rows[0].id,
    "Blk 333 Tampines Street 96",
    "#05-111 Blk 333 Tampines Street 96, Singpore 486333",
    830000,
    "Tampines",
    "Tampines",
    93,
    3,
    2,
    "99-year lease",
    "NA",
    "available",
  ];
  const propertyId1 = await client.query(propertyText1, propertyValue1);
  const propertyId2 = await client.query(propertyText1, propertyValue2);
  const propertyId3 = await client.query(propertyText1, propertyValue3);
  const propertyId4 = await client.query(propertyText1, propertyValue4);

  console.log("inserting 4");

  const listingImageText1 =
    "insert into images (property_id, imageurl) values ($1,$2) returning id";
  const listingImageValue1 = [
    propertyId1.rows[0].id,
    "https://landtransportguru.net/web/wp-content/uploads/2016/07/ewl_ew5_mar16-9.jpg",
  ];
  const listingImageValue2 = [
    propertyId2.rows[0].id,
    "https://static.mothership.sg/1/2024/07/Screenshot-2024-07-04-at-10.03.03.jpeg",
  ];
  const listingImageValue3 = [
    propertyId3.rows[0].id,
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Jurong_East_MRT_station_230622.jpg",
  ];
  const listingImageValue4 = [
    propertyId3.rows[0].id,
    "https://www.hdb.gov.sg/-/media/HDBContent/Images/SCEG/our-towns-jurong-east-1.png",
  ];
  const listingImageValue5 = [
    propertyId4.rows[0].id,
    "https://static.mothership.sg/1/2024/07/Screenshot-2024-07-04-at-10.03.03.jpeg",
  ];
  const listingImageValue6 = [
    propertyId2.rows[0].id,
    "https://www.hdb.gov.sg/-/media/HDBContent/Images/SCEG/our-towns-jurong-east-1.png",
  ];

  await client.query(listingImageText1, listingImageValue1);
  await client.query(listingImageText1, listingImageValue2);
  await client.query(listingImageText1, listingImageValue3);
  await client.query(listingImageText1, listingImageValue4);
  await client.query(listingImageText1, listingImageValue5);
  await client.query(listingImageText1, listingImageValue6);

  console.log("inserting 5");

  const favouriteText1 =
    "insert into favourites (buyer_id, property_id) values ($1,$2) returning id";
  const favouriteValue1 = [buyerId1.rows[0].id, propertyId1.rows[0].id];
  const favouriteValue2 = [buyerId1.rows[0].id, propertyId3.rows[0].id];
  await client.query(favouriteText1, favouriteValue1);
  await client.query(favouriteText1, favouriteValue2);

  const interestText1 =
    "insert into interests (buyer_id, agent_id) values ($1,$2) returning id";
  const interestValue1 = [buyerId1.rows[0].id, agentId1.rows[0].id];
  const interestValue2 = [buyerId2.rows[0].id, agentId1.rows[0].id];
  await client.query(interestText1, interestValue1);
  await client.query(interestText1, interestValue2);

  await client.query("COMMIT");
  console.log("done");

  const agents = await client.query("SELECT * FROM agents");
  console.log("agents", agents.rows[0]);
  const buyers = await client.query("SELECT * FROM buyers");
  console.log("users", buyers.rows[0]);
  const properties = await client.query("SELECT * FROM properties");
  console.log("properties", properties.rows[0]);
  const images = await client.query("SELECT * FROM images");
  console.log("properties", images.rows[0]);
  const favourites = await client.query("SELECT * FROM favourites");
  console.log("favourites", favourites.rows[0]);
  const interests = await client.query("SELECT * FROM interests");
  console.log("interests", interests.rows[0]);

  client.release();
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
}
