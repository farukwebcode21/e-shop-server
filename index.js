const express = require('express')
const app = express()
const ObjectId = require ('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdxsv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db("e-shop");
    const productCollection = database.collection("products");
    const ordersCollection = database.collection("orders");

    // GET API
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    })

    // GET SINGLE WATCH
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product)

    })
    // ADD Orders list
    app.post('/orders', async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    })
    // GET ORDER BY USER Email
    app.get("/orders/:email", async (req, res) => {
      const result = await ordersCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    })

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    })

  }
  finally {
    // await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is Running ')
})

app.listen(port, () => {
  console.log(`Server listening port at http://localhost:${port}`)
})