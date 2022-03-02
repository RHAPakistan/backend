const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Pickup = require('../models/pickup');
const Dropoff = require("../models/dropoff");
const { generateToken, isAuth } = require('../utils.js');
const dropoff = require('../models/dropoff');

module.exports = {
    getDropoffs: expressAsyncHandler(async(req,res)=>{
        dropoffs = await Dropoff.find({});
        if(dropoffs){
            res.status(200).send(dropoffs)
        }else{
            res.status(404).send("Not found");
        }
    }),

    createDropoff: expressAsyncHandler(async(req,res)=>{
        dropoff = new Dropoff(req.body);
        createdDropoff = await dropoff.save();
        if(createdDropoff){
            res.status(200).send(dropoff.toObject())
        }else{
            res.status(500).send("Server error");
        }
    }),

    getDropoff: expressAsyncHandler(async(req,res)=>{
        dropoffs = await Dropoff.findById(req.params.id);
        if(dropoffs){
            res.status(200).send(dropoffs)
        }else{
            res.status(404).send("Not found");
        }
    }),

    editDropoff: expressAsyncHandler(async(req,res)=>{
        dropoff = await Dropoff.findByIdAndUpdate(req.params.id,req.body);
        if(dropoff){
            res.status(200).send(req.body);
        }else{
            res.status(404).send("Not found");
        }
    }),
    
    deleteDropoff: expressAsyncHandler(async(req,res)=>{
        var dropoff = await Dropoff.findByIdAndDelete(req.params.id);
        if(dropoff){
            res.status(200).send({
                "message":"user deleted",
                "status":"deleted",
                "id": req.params.id})
        }else{
            res.status(400).send("already deleted");
        }
    })
};