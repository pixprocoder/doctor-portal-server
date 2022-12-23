const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://Doctors-portal:Q6VIKTngLAi5EqZg@cluster0.jfjpd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db("AppointmentServices")
      .collection("service");
    const bookingCollection = client
      .db("AppointmentServices")
      .collection("booking");

    // LOAD ALL APPOINTMENT DATA
    app.get("/service", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    /**
     * naming convention API
     * app.get('/booking') load all data
     * app.get('/booking/:id') load specific data by filter
     * app.post('/booking') add a new booking
     * app.patch('/booking/:id') update a data
     * app.delete('/booking/:id') delete one specific data
     */
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exist = await bookingCollection.findOne(query);
      if (exist) {
        return res.send({ success: false, exist });
      }
      const result = await bookingCollection.insertOne(booking);
      return res.send({ success: true, result });
    });
  } finally {
  }
}
run().catch(console.dir);

//ROOT API
app.get("/", (req, res) => {
  res.send("Hello World. how are you");
});

app.listen(port, () => {
  console.log(`doctor portal listening on port ${port}`);
});
