const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

const users = ['Robin', 'Robel', 'Abir', 'Arafat', 'Nabil'] 

const client = new MongoClient(uri, { useNewUrlParser: true });


//get data from database   

app.get('/products', (req,res)=>{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({name:'laptop'}).limit(5).toArray((err, documents) => {
            if (err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
            res.send(documents);

            }
        });
        client.close();
    });
})

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({ id, name })
})

//Post
app.post('/addProduct', (req, res) => {
    //save to database
    const product = req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product,(err, result) => {
            if (err){
                console.log(err);
                res.status(500).send({message:err})
            }
            else{
            res.send(result.ops[0]);

            }
        });
        client.close();
    });
})

const port = process.env.PORT || 4200;
app.listen(port, () => console.log("Listing to port 4200"));