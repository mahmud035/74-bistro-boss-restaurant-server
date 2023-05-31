const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
require('colors');
require('dotenv').config();

const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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
const Cart = client.db('bistroBossDB').collection('cart');
const User = client.db('bistroBossDB').collection('users');

// ============ API ENDPOINTS ============
//* GET
// get menus data
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
// get reviews data
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

// get specific user's order items
app.get('/cart', async (req, res) => {
  try {
    const { email } = req.query;
    const cart = await Cart.find({ email: email }).toArray();

    if (cart.length > 0) {
      res.send(cart);
    } else {
      res.send({
        success: false,
        message: `Didn't found order items`,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* POST
app.post('/menu', async (req, res) => {
  try {
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

// add single item to Cart collection
app.post('/cart', async (req, res) => {
  try {
    const item = req.body;
    const result = await Cart.insertOne(item);

    if (result.insertedId) {
      res.send({
        success: true,
        message: 'Item added to cart successfully',
      });
    } else {
      res.send({
        success: false,
        message: `Couldn't add the item to cart`,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* PUT / PATCH
// save user email and role in DB
app.put('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedUser = {
      $set: user,
    };
    const result = await User.updateOne(filter, updatedUser, options);

    if (result.modifiedCount) {
      res.status(200).send({
        success: true,
        message: 'Updated user info',
        data: result,
      });
    } else {
      res.status(400).send({
        success: false,
        message: 'Failed to update user info',
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* DELETE
app.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await Cart.deleteOne(query);

    if (result.deletedCount) {
      res.send({
        success: true,
        message: 'Food item deleted successfully',
      });
    } else {
      res.send({
        success: false,
        message: `Sorry! something went wrong`,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

app.listen(port, () => {
  console.log(`Server Up and Running`.yellow.italic);
});

/**
 ** IMP: API Naming Convention

 * app.get('/uses')
 * app.get('/users/:id')
 * app.post('/uses')
 * app.put('/users/:id')
 * app.patch('/users/:id')
 * app.delete('/users/:id')
 *
 *  */
