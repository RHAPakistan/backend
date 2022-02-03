const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {

  //register provider
  register: expressAsyncHandler(async (req, res) => {
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
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser),
      });
    }
  }),

  //signin provider
  signin: expressAsyncHandler(async (req, res) => {
    console.log("Sign in request made");
    console.log(req.body);
    const user = await Provider.findOne({ email: req.body.email });
    
    if (user) {
      console.log("WTF?!");
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user),
        });
      }else{
        res.status(401).send({"message": "Invalid email or password"});
      }
    }else{
    res.status(401).send({ message: 'Invalid email or password' });
    }
  }),

  //get provider
  getUser: expressAsyncHandler(async (req, res) => {
    
    const user = await Provider.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),

  //delete provider
  deleteUser: expressAsyncHandler(async (req, res) => {
    const user = await Provider.findByIdAndDelete(req.params.id);
    console.log(user)
    if (user) {
      res.status(500).send({ "success": "Provider deleted succesfully" })
    } else {
      res.send({ "message": "The user doesn't exist" })
    }
  }),

  //update provider
  updateUser: expressAsyncHandler(async (req, res) => {
    const user = await Provider.findByIdAndUpdate(req.params.id, req.body)
    if (user) {
      res.send("User info updated succesfully")
    }
    else {
      res.send("User info not updated")
    }

  }),


  //create pickup
  createPickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findOne({"provider":req.body.provider});
    if (pickup){
      res.status(202).send({
        "message":"Pickup alraedy exists",
        "alreadyExists":true
      })
    }else {
      const pickup = new Pickup(req.body)
      const pickupCreated = await pickup.save()
      res.status(200).send(
        {
          "pickup": pickup,
          "message":"pickup created",
          "alreayExists":false
        }
      )
    }
  }),

  //get pickup
  getPickup: expressAsyncHandler(async (req,res)=>{
    const pickup = await Pickup.findById(req.params.id)
    if (pickup){
      res.send(pickup)
    }else{
      res.send("Pickup not found")
    }
  }),

  deletePickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findByIdAndDelete(req.params.id)
    if (pickup){
      res.send("The pickup has been deleted")
    }else{
      res.send("The pickup doesn't exist")
    }
  }),

  updatePickup: expressAsyncHandler(async (req, res) => {
    //find pickup by id and update
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body)
    if (pickup){
      res.send("The pickup has been updated")
    }else{
      res.send("The pickup doesn't dexist")
    }

  })

};