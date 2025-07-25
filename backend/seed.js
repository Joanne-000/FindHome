const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("./index");
const { faker } = require("@faker-js/faker");

const createSeed = async () => {
  const client = await pool.connect();

  const res = await client.query("SELECT $1::text as message", [
    "Hello world!",
  ]);

  const saltRounds = 12;

  try {
    await client.query("BEGIN");

    await client.query(
      `DROP TABLE IF EXISTS agents, buyers,listings,favourites,images,interests CASCADE;`
    );

    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await client.query(
      `CREATE TABLE IF NOT EXISTS agents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `CREATE TABLE IF NOT EXISTS listings (
   id SERIAL PRIMARY KEY,
 	agent_id uuid REFERENCES agents(id) NOT NULL,  
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
   user_id uuid NOT NULL,
   listing_id INT REFERENCES listings(id) NOT NULL
  );
  `
    );

    await client.query(
      `CREATE TABLE IF NOT EXISTS images (
   id SERIAL PRIMARY KEY,
   imageurl VARCHAR NOT NULL,
   listing_id INT REFERENCES listings(id) NOT NULL
  );
  `
    );

    await client.query(
      `CREATE TABLE IF NOT EXISTS interests (
   id SERIAL PRIMARY KEY,
   buyer_id uuid REFERENCES buyers(id) NOT NULL,
 	agent_id uuid REFERENCES agents(id) NOT NULL    ,
    timestamptz TIMESTAMPTZ DEFAULT now()
  );
  `
    );

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
      faker.image.personPortrait(),
      "active",
    ];
    const agentValue2 = [
      "jessie123@hotmail.com",
      hashedPWAgent,
      "Jessie",
      "22223333",
      "agent",
      "12345678",
      faker.image.personPortrait(),
      "active",
    ];
    const agentId1 = await client.query(agentText1, agentValue1);
    const agentId2 = await client.query(agentText1, agentValue2);

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

    const propertyText1 =
      "insert into listings (agent_id, propertyname, address, price, town, nearestmrt, unitsize ,bedroom,bathroom, typeoflease, description, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id";
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

    const listingImageText1 =
      "insert into images (listing_id, imageurl) values ($1,$2) returning id";
    const imageurls1 = [
      "https://landtransportguru.net/web/wp-content/uploads/2016/07/ewl_ew5_mar16-9.jpg",
      "https://static.mothership.sg/1/2024/07/Screenshot-2024-07-04-at-10.03.03.jpeg",
    ];

    imageurls1.map(async (imageurl) => {
      const value = [propertyId1.rows[0].id, imageurl];
      await client.query(listingImageText1, value);
    });

    const imageurls2 = [
      "https://static.mothership.sg/1/2024/07/Screenshot-2024-07-04-at-10.03.03.jpeg",
      "https://www.hdb.gov.sg/-/media/HDBContent/Images/SCEG/our-towns-jurong-east-1.png",
      "https://landtransportguru.net/web/wp-content/uploads/2016/07/ewl_ew5_mar16-9.jpg",
    ];

    imageurls2.map(async (imageurl) => {
      const value = [propertyId2.rows[0].id, imageurl];
      await client.query(listingImageText1, value);
    });

    const imageurls3 = [
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Jurong_East_MRT_station_230622.jpg",
      "https://www.hdb.gov.sg/-/media/HDBContent/Images/SCEG/our-towns-jurong-east-1.png",
    ];

    imageurls3.map(async (imageurl) => {
      const value = [propertyId3.rows[0].id, imageurl];
      await client.query(listingImageText1, value);
    });
    const imageurls4 = [
      "https://static.mothership.sg/1/2024/07/Screenshot-2024-07-04-at-10.03.03.jpeg",
    ];

    imageurls4.map(async (imageurl) => {
      const value = [propertyId4.rows[0].id, imageurl];
      await client.query(listingImageText1, value);
    });

    const favouriteText1 =
      "insert into favourites (user_id, listing_id) values ($1,$2) returning id";
    const favouriteValue1 = [buyerId1.rows[0].id, propertyId1.rows[0].id];
    const favouriteValue2 = [buyerId1.rows[0].id, propertyId3.rows[0].id];
    const favouriteValue3 = [agentId2.rows[0].id, propertyId1.rows[0].id];
    const favouriteValue4 = [agentId2.rows[0].id, propertyId3.rows[0].id];
    await client.query(favouriteText1, favouriteValue1);
    await client.query(favouriteText1, favouriteValue2);
    await client.query(favouriteText1, favouriteValue3);
    await client.query(favouriteText1, favouriteValue4);

    const interestText1 =
      "insert into interests (buyer_id, agent_id) values ($1,$2) returning id";
    const interestValue1 = [buyerId1.rows[0].id, agentId1.rows[0].id];
    const interestValue2 = [buyerId2.rows[0].id, agentId1.rows[0].id];
    await client.query(interestText1, interestValue1);
    await client.query(interestText1, interestValue2);

    await client.query("COMMIT");

    const agents = await client.query("SELECT * FROM agents");
    const buyers = await client.query("SELECT * FROM buyers");
    const properties = await client.query("SELECT * FROM listings");
    const images = await client.query("SELECT * FROM images");
    const favourites = await client.query("SELECT * FROM favourites");
    const interests = await client.query("SELECT * FROM interests");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

createSeed();
