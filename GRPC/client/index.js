const client = require('./client')

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {v4:uuidv4} = require('uuid')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get("/players",(req,res) => {
    client.getAll(null, (err, data) => {
        if(!err){
            res.status(200).json(data.players)
        } else {
            res.status(404).json({error:err.details})
        }
    })
})

app.get("/players/:id",(req,res) => {
    let id = req.params.id
    client.getOnePlayer({id:req.params.id},(err,data) => {
        if(!err){
            console.log(data)
            res.send(data)
        } else {
            res.status(404).json({error:err.details})
        }
    })
})

app.post("/players",(req,res) => {
    let newPlayer = {
        id:uuidv4(),
        name:req.body.name,
        distric:req.body.distric
    }
    client.insert(newPlayer,(err,data) => {
        if(!err){
            res.status(201).json(newPlayer)
        } else {
            res.status(404).json({error:err.details})
        }
    })
})

app.put("/players/:id",(req,res) => {
    let updatedPlayer = {
        id:req.params.id,
        name:req.body.name,
        distric:req.body.distric
    }
    client.update(updatedPlayer,(err,data) => {
        if(!err){
            res.status(201).json(updatedPlayer)
        } else{
            res.status(404).json({error:err.details})
        }
    })
})

app.delete("/players/:id",(req,res) => {
    client.remove({id:req.params.id},(err,_) => {
        if(!err){
            res.status(202).send()
        } else {
            res.status(404).json({error:err.details})
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT,() => console.log("Server Running @",PORT))