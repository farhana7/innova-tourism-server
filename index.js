const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4200;

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
    const provideCollection = database.collection("provides");
    const tripCollection = database.collection("trips");

    //Get Services/Provides API
    app.get("/provides", async (req, res) => {
      const cursor = provideCollection.find({});
      const provides = await cursor.toArray();
      res.send(provides);
    });

    //Get Single Service/Provide
    app.get("/provides/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific provide", id);
      const query = { _id: ObjectId(id) };
      const provide = await provideCollection.findOne(query);
      res.json(provide);
    });

    //POST API
    app.post("/provides", async (req, res) => {
      const provide = req.body;
      console.log("hit the post api", provide);

      // const provide = {
      //   id: 1,
      //   name: "Destination Vacation",
      //   description:
      //     "From East to West, North to South - We visit all over the World.Choose your destinaton with us. ",
      //   img: "https://wildernesswanderings.org/wp-content/uploads/2017/03/Mauritius-4.jpg",
      // };

      const result = await provideCollection.insertOne(provide);
      console.log(result);
      res.json(result);
    });

    //DELETE API
    app.delete("/provides/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await provideCollection.deleteOne(query);
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
