const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
require('colors');
require('dotenv').config();

const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

//* Database Connection
const uri = process.env.URI;
const client = new MongoClient(uri);

const dbConnect = async () => {
  try {
    await client.connect();
    console.log(`Database Connected`.cyan.bold);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
};
dbConnect();

app.listen(port, () => {
  console.log(`Server Up and Running`.yellow.italic);
});
