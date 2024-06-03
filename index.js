const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// middle ware 
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.nhw8ipw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const usersCollection = client.db('scholarShip').collection('users')
    const scholarshipsCollection = client.db('scholarShip').collection('scholarships')




    // post users 
    app.post('/users', async (req, res) => {
      const user = req.body
      const query = { email: user?.email }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    // get users 
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    // delete user 
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    // update user role 
    // app.patch('/users/:id',async(req,res) =>{
    //   const id = req.params.id
    //   const role = req.body
    //   const filter = {_id: new ObjectId(id)}
    //   const updatedDoc ={
    //     $set:{role:role}
    //   }
    //   const result = await usersCollection.updateOne(filter, updatedDoc)
    //   res.send(result)
    // })


    // scholarship data post 
    app.post('/scholarships', async (req, res) => {
      const data = req.body
      const result = await scholarshipsCollection.insertOne(data)
      res.send(result)
    })

    // get all scholarship data 
    app.get('/scholarships',async(req,res) =>{
      const result = await scholarshipsCollection.find().toArray()
      res.send(result)
    })

    // get scholarship data by id 
    app.get('/scholarships/:id' ,async(req,res) =>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await scholarshipsCollection.findOne(query)
      res.send(result)
    })

    // delete a scholarship data 
    app.delete('/scholarships/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await scholarshipsCollection.deleteOne(query)
      res.send(result)
    })

    // update a scholarship data 
    app.patch('/scholarships/:id', async(req, res) =>{
      const data = req.body 
      const id = req.params.id 
      const filter = {_id : new ObjectId(id)}
      const updatedDoc = {
        $set:{
          postDate: data.postDate,
          applicationDeadline:data.applicationDeadline,
          postedUserEmail:data.postedUserEmail,
          scholarshipName:data.scholarshipName,
          universityCity:data.universityCity,
          universityCountry:data.universityCountry,
          universityName:data.universityName,
          universityWorldRank:data.universityWorldRank,
          subjectCategory:data.subjectCategory,
          scholarshipCategory:data.scholarshipCategory,
          degree:data.degree,
          applicationFees:data.applicationFees,
          serviceCharge:data.serviceCharge,
          image:data.image
        }
      }
      const result = await scholarshipsCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })





    


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir); 



app.get('/', (req, res) => {
  res.send('server is running..............')
})
app.listen(port, () => {
  console.log(`server in running on port : ${port}`)
})