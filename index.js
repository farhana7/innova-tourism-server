const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ir5um.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    // console.log("database connected successfully");
    const database = client.db("tourism_site");
    const serviceCollection = database.collection("services");
    const tripCollection = database.collection("trips");

    //Get Services API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      // const service = {
      //   id: 1,
      //   name: "Destination Vacation",
      //   description:
      //     "From East to West, North to South - We visit all over the World.Choose your destinaton with us. ",
      //   img: "https://wildernesswanderings.org/wp-content/uploads/2017/03/Mauritius-4.jpg",
      // };

      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    //DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.json(result);
    });

    // //Add Orders / Trips  API
    // app.post("/trips", async (req, res) => {
    //   const trip = req.body;
    //   const result = await tripCollection.insertOne(order);
    //   //console.log("trip", trip);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Innova Tourism server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});
