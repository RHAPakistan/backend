const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const Token = require('../models/token');
const { generateToken, isAuth, sendEmail } = require('../utils.js');

module.exports = {

  //register provider
  register: expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const auser = await Provider.findOne({ email: req.body.email });
    if (auser) {
      res.status(409).send({ message: "User Already Exists" })
    }
    else {
      //create new provider
      const user = new Provider({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 8)
      });
      const createdUser = await user.save();

      //respond to request
      if(createdUser){
        res.status(200).send({
          _id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          token: generateToken(createdUser),
          message:"Request Processed Successfully"
        });
      }else{
        res.status(400).send({
          message: "Invalid Data Provided"
        })
      }
    }
  }),

  //signin provider
  signin: expressAsyncHandler(async (req, res) => {
    console.log("Sign in request made");
    console.log(req.body);
    const user = await Provider.findOne({ email: req.body.email });
    
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          contactNumber: user.contactNumber,
          message:"Request Processed Successfully",
          token: generateToken(user),
        });
      }else{
        res.status(400).send({message: "Invalid Credentials Provided"});
      }
    }else{
    res.status(400).send({ message: "Invalid Credentials Provided" });
    }
  }),

  //get provider
  getUser: expressAsyncHandler(async (req, res) => {
    
    const user = await Provider.findById(req.params.id);
    if (user) {
      res.send({
        message: "Request Processed Successfully",
        ...user
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),

  //delete provider
  deleteUser: expressAsyncHandler(async (req, res) => {
    const user = await Provider.findByIdAndDelete(req.params.id);
    console.log(user)
    if (user) {
      res.status(200).send({ message: "Request Processed Successfully" })
    } else {
      res.status(404).send({ message: "User Not Found" })
    }
  }),

  //update provider
  updateUser: expressAsyncHandler(async (req, res) => {
    const user = await Provider.findByIdAndUpdate(req.params.id, req.body)
    if (user) {
      res.send({message:"Request Processed Successfully"})
    }
    else {
      res.status(404).send({message:"User Not Found"})
    }

  }),


  //create pickup
  createPickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findOne({"provider":req.body.provider, "status":{$lt:3}});
    console.log("the body is ",req.body);
    if (pickup){
      res.status(409).send({message:"Pickup Already Exists"})
    }else {
      const pickup = new Pickup(req.body)
      const pickupCreated = await pickup.save()
      console.log(pickupCreated);

      //broadcast that this pickup has been initiated so the list on admin's side is updated.
      sock = req.app.get('socketio');
      sock.emit("initiateRequest",{"message":pickup})

      res.status(200).send(
        {
          pickup,
          message:"Request Processed Successfully",
        }
      )
    }
  }),

  //get pickup
  getPickup: expressAsyncHandler(async (req,res)=>{
    const pickup = await Pickup.findById(req.params.id)
    if (pickup){
      res.status(200).send({
        pickup,
        message: "Request Processed Successfully"
      })
    }else{
      res.status(404).send("Pickup Not Found")
    }
  }),

  deletePickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findByIdAndDelete(req.params.id)
    if (pickup){
      res.status(200).send({message:"Request Processed Successfully"})
    }else{
      res.status(404).send({message:"Pickup Not Found"})
    }
  }),

  updatePickup: expressAsyncHandler(async (req, res) => {
    //find pickup by id and update
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body)
    if (pickup){
      res.status(200).send({message:"Request Processed Successfully"})
    }else{
      res.status(404).send({message:"Pickup Not Found"})
    }

  }),

  auth_forgot: expressAsyncHandler(async (req, res) =>{
    const user = await Provider.findOne({ email: req.body.email });
    if (user) {
      const alreadyToken = await Token.findOne({userId: user._id});
      if(alreadyToken){
        await alreadyToken.remove();
      }
      var val = Math.floor(100000 + Math.random() * 900000);
      const otp = val.toString();
      const token = new Token({
        userId :user._id,
        otp: otp
      });
      await token.save();
      const text = "You have requested for password reset, kindly note the OTP given below to verify yourself in the app. \n Your OTP is: ";
      const message = text.concat(otp);
      const sentMail = await sendEmail(user.email, "Password reset for RHA", message);
      console.log("Problem with email", sentMail);
      if(sentMail)
        res.status(200).send({message:"Request Processed Successfully"});
      else
        res.status(404).send({message: 'User Not Found'});
    }
    else{
      res.status(404).send({message: 'User Not Found'});
    }
  }),

  auth_forgot_verifyOTP: expressAsyncHandler(async (req, res)=>{
    const user = await Provider.findOne({ email: req.body.email });
    if(user){
      const token = await Token.findOne({ userId: user._id, otp: req.body.otp});
      if(token){
        res.status(200).send({tokenId: token._id, message: 'Request Processed Successfully'});
      }
      else{
        res.status(401).send({message: 'Invalid OTP'});  
      }
    }
    else{
      res.status(404).send({message: 'User Not Found' });
    }
  }),

  auth_forgot_changePassword: expressAsyncHandler(async (req, res)=>{
    const user = await Provider.findOne({ email: req.body.email });
    if(user){
      const token = await Token.findOne({ userId: user._id, otp: req.body.otp});
      if(token){
        await Provider.updateOne(
          {_id: user._id},
          { password: bcrypt.hashSync(req.body.newPassword, 8)},
          { upsert: true }
        );
        await token.remove();
        res.status(200).send({message: 'Request Processed Successfully'});
      }
      else{
        res.status(401).send({message: 'Invalid OTP'});  
      }
    }
    else{
      res.status(404).send({message: 'User Not Found' });
    }
  })

};