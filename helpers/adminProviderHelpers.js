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

    get_providers: expressAsyncHandler(async (req,res)=>{
      const response = await Provider.find({});
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

      search_providers: expressAsyncHandler(async (req, res)=>{
        //const providers = await Provider.find({ fullName: { $regex: `(?i)${req.body.text}` } });
        try{
          let providers = await Provider.find({$text: { $search: req.body.text }});
          if(providers){   
            if(providers.length >0){
              res.status(200).send({error: 0, providers: providers})
            }
            else{
              providers = await Provider.find();
              res.send({error: 1, message: "No such result. Returning all data", providers: providers});
            }
          }
          else{
            res.status(401).send({error: 2, message: "Providers not found"})
          }
        }
        catch (error){
          console.log("Error: ",error.codeName, error.message);
          res.send({error: 2, message: `Code: ${error.codeName}`})
        }
      })


}