const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();


const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_PROFILE}:${process.env.DB_PASSWORD}@cluster0.vcv4qvu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    const serviceCollection = client.db('wildstar').collection('services');
    const serviceReviews = client.db('wildstar').collection('reviews');
    app.get('/services',async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({date:-1}).toArray();
      res.send(services);
    })
   
    app.post('/reviews',async(req,res)=>{
      const reviewadd = req.body;
      const date = new Date();
      const newAdd = {...reviewadd,date};
      const result = await serviceReviews.insertOne(newAdd);
      res.send(result);
    })


    app.get('/reviews',async(req,res)=>{
      
      const query = {}
      const cursor = serviceReviews.find(query);
      const reviews = await cursor.sort({date:-1}).toArray();
      res.send(reviews);      
    })

    app.get('/review',async (req,res)=>{
      
      let query = {};
      query={
        email:req.query.email
      }
      const cursor = serviceReviews.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    })

    app.delete('/review/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await serviceReviews.deleteOne(query);
      res.send(result)
    })

    app.get('/update/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const review = await serviceReviews.findOne(query);
      res.send(review);
    })

    app.patch('/update/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const updated = {
        $set: req.body
      }
      console.log(req.body);
      const result = await serviceReviews.updateOne(query,updated);
      res.send(result);
    })

    app.get('/home-services',async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const homeServices = await cursor.limit(3).sort({date:-1}).toArray();
      res.send(homeServices);
  })
  app.get('/services/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const query ={}
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    const selectedCourses = services.find(n => n.ids === id);
    const qureyReview = {}
    const cursorReview = serviceReviews.find(qureyReview);
    const selectedReview = await cursorReview.sort({date:-1}).toArray();
    const selectAllreview = selectedReview.filter(r=> r.ids === id)
    res.send({selectedCourses, selectAllreview});  
});




  }
  finally{

  }
}
run().catch(err=> console.error(err))



app.get('/', (req, res) =>{
    res.send(' server is running');
})

app.listen(port , ()=>{
    console.log("wild star",port);
})