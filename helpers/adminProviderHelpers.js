const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {

    get_vendors: expressAsyncHandler(async (req,res)=>{
        /*
        POST request
        body: {
            "full_name": <string>
        }
        a = req.params.query
        print(a) -> Name

         */ 
        var query = {"FullName":req.params.query};
        const response = await Pickup.find(query);
        if(response){
            res.status(200).send({"array":response});
        }else{
            res.status(404).send({"error":"Not found"});
        }
    }),

    get_provider: expressAsyncHandler(async (req,res)=>{
        const response = await Provider.findById(req.params.id);
        if (response){
            res.status(200).send(response)
        }else{
            res.status(404).send({"message":"user not found"})
        }
    }),

    create_provider: expressAsyncHandler(async (req, res) => {
        console.log(req.body);
        const user = await Provider.findOne({ email: req.body.email });
        if (user) {
          res.send({ message: "email already exist" })
        }
        else {
          //encrypt password
          req.body.password = bcrypt.hashSync(req.body.password, 8)
    
          //create new provider
          const user = new Provider(req.body);
          const createdUser = await user.save();
    
          //respond to request
          var a = user.toObject();
          delete a["password"];
          a.token = generateToken(createdUser);
          res.send(a);
        }
      }),

    update_provider: expressAsyncHandler(async (req, res) => {
        const user = await Provider.findByIdAndUpdate(req.params.id, req.body)
        if (user) {
          res.send("User info updated succesfully")
        }
        else {
          res.send("User info not updated")
        }
    
      }),
    
    delete_provider: expressAsyncHandler(async (req, res) => {
        const user = await Provider.findByIdAndDelete(req.params.id);
        console.log(user)
        if (user) {
          res.status(500).send({ "success": "Provider deleted succesfully" })
        } else {
          res.send({ "message": "The user doesn't exist" })
        }
      }),


}