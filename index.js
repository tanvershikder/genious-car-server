const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();


//middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvong.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('genious-car-service').collection('services');

        app.get('/service',async (req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/service/:id' , async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service)
            console.log("lodad");
        })


        // post newService
        app.post('/service',async (req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
        })


        //delete service

        app.delete('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally{
        // await client.close(); if i want to stop connection after need of database
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('geinious car service server is running')
})

app.listen(port,()=>{
    console.log("lisening port :",port);
})