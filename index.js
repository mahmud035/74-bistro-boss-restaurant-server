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

//* Create Database Collection
const Menu = client.db('bistroBossDB').collection('menu');
const Review = client.db('bistroBossDB').collection('review');

// ============ API ENDPOINTS ============
//* GET
// get menu data
app.get('/menu', async (req, res) => {
  try {
    const menu = await Menu.find({}).toArray();

    if (menu.length) {
      res.send({
        success: true,
        message: 'Menu data found',
        data: menu,
      });
    } else {
      res.send({ success: false, message: `Didn't found menu data` });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* GET
// get review data
app.get('/review', async (req, res) => {
  try {
    const review = await Review.find({}).toArray();

    if (review.length) {
      res.send({
        success: true,
        message: 'Review data found',
        data: review,
      });
    } else {
      res.send({ success: false, message: `Didn't found review data` });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* POST
app.post('/menu', async (req, res) => {
  try {
    console.log('api hit');
    const menu = req.body;
    const result = await Menu.insertOne(menu);

    if (result.insertedId) {
      res.send({
        success: true,
        message: 'Menu added successfully',
      });
    } else {
      res.send({ success: false, message: `Sorry couldn't added the menu` });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* PUT / PATCH

//* DELETE

app.listen(port, () => {
  console.log(`Server Up and Running`.yellow.italic);
});
