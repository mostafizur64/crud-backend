const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware =====
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://crud:EYsdu6tuiQEZ9JLl@cluster0.bnfwhg6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const itemsCollection = client.db("crud").collection("item");

    // items related api ================/

    app.get("/item", async (req, res) => {
      const result = await itemsCollection.find().toArray();
      res.send(result);
    });
    app.post("/item", async (req, res) => {
      const data = req.body;
      const result = await itemsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.send(result);
    });

    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updateItem = req.body;
      const newItem = {
        $set: {
          name: updateItem.name,
          email: updateItem.email,
          job: updateItem.job,
          age: updateItem.age,
        },
      };
      const result = await itemsCollection.updateOne(filter, newItem, options);
      res.send(result);
    });
    app.delete("/deleteItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Project is Running");
});
app.listen(port, () => {
  console.log(`Project is Running on port ${port}`);
});
