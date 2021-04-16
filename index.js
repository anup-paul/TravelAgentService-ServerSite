const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mhth.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 7000

app.get('/', (req, res) => {
  res.send('its working!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const featuresCollection = client.db("travelAgency").collection("features");
  const bookingCollection = client.db("travelAgency").collection("bookingDetails");
  const reviewCollection = client.db("travelAgency").collection("reviewDetails");
  console.log("Connected successfully");


  app.post('/addFeatures',(req,res)=>{
      const newFeature = req.body;
      console.log(newFeature);
      featuresCollection.insertOne(newFeature)
      .then(result=>{
          res.send(result.insertedCount>0)
      })

  })


  app.get('/features',(req, res)=>{
      featuresCollection.find({})
      .toArray((err, info)=>{
          res.send(info)
      })
  })


  app.get('/bookingFeatures/:id', (req, res) => {
    featuresCollection.find({ _id:ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item);
      })
  })


  app.post('/bookingData',(req, res)=>{
      const newBooking = req.body;
      bookingCollection.insertOne(newBooking)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })


  app.get('/bookingList',(req,res)=>{
      bookingCollection.find({})
      .toArray((err,list)=>{
          res.send(list)
      })
  })


  app.post('/addReviews',(req,res)=>{
      const newReview = req.body;
      console.log(newReview);
      reviewCollection.insertOne(newReview)
      .then(result=>{
          res.send(result.insertedCount>0);
      })
  })


  app.get('/reviews',(req, res)=>{
    reviewCollection.find({})
    .toArray((err, info)=>{
        res.send(info)
    })
})


});

app.listen(process.env.PORT || port)