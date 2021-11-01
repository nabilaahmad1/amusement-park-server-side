const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8lywp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("park");
        const rideCollection = database.collection("rides");
        const orderCollection = database.collection("order");

        // get API for adding new service
        app.get("/rides", async (req, res) => {
            const findRide = rideCollection.find({});
            const getRide = await findRide.toArray();
            res.send(getRide);
        })

        // get single ride 
        app.get("/rides/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const ride = await rideCollection.findOne(query);
            res.json(ride);
        })

        // get API for placing order
        app.get("/manageallorders", async (req, res) => {
            const findRide = orderCollection.find({});
            const getRide = await findRide.toArray();
            res.send(getRide);
        })

        // get email for my order 
        app.get("/manageallorders", async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { email: email };
            }
            const search = await orderCollection.find(query).toArray();
            res.json(search);
        })

        // delete order from my order
        app.delete("/manageallorders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.deleteOne(query);
            res.json(order);
        })

        // post API for placeing order
        app.post("/manageallorders", async (req, res) => {
            const rides = req.body;
            const result = await orderCollection.insertOne(rides);
            console.log(result);
            res.json(result);
        })

        // post API for adding new service
        app.post("/rides", async (req, res) => {
            const rides = req.body;
            const result = await rideCollection.insertOne(rides);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
