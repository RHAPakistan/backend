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
    const user = await Provider.findOne({ email: req.body.email });
    if (user) {
      res.status(409).send({ message: "User Already Exists" })
    }
    else {
      //encrypt password
      req.body.password = bcrypt.hashSync(req.body.password, 8)

      //create new provider
      const user = new Provider(req.body);
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
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          contactNumber: user.contactNumber,
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
    const pickup = await Pickup.findOne({"provider":req.body.provider, "status":{$lt:3}});
    console.log("the body is ",req.body);
    if (pickup){
      res.status(202).send({
        "message":"Pickup alraedy exists",
        "alreadyExists":true
      })
    }else {
      const pickup = new Pickup(req.body)
      const pickupCreated = await pickup.save()
      console.log(pickupCreated);

      //broadcast that this pickup has been initiated so the list on admin's side is updated.
      sock = req.app.get('socketio');
      sock.emit("initiateRequest",{"message":pickup})

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
        res.send({error: 0, message:"Password-reset-email has been sent to your Email address"});
      else
        res.status(404).send({error: 1, message: 'Error: Email could not be sent due to some error'});
    }
    else{
      res.status(401).send({error: 1, message: 'Invalid email' });
    }
  }),

  auth_forgot_verifyOTP: expressAsyncHandler(async (req, res)=>{
    const user = await Provider.findOne({ email: req.body.email });
    if(user){
      const token = await Token.findOne({ userId: user._id, otp: req.body.otp});
      if(token){
        res.send({error: 0, tokenId: token._id, message: 'Token Verified Sucessfully!'});
      }
      else{
        res.status(401).send({error: 1, message: 'OTP invalid or expired'});  
      }
    }
    else{
      res.status(404).send({error: 1, message: 'No user with this Email' });
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
        res.send({error: 0, message: 'Your Password has been sucessfully changed.'});
      }
      else{
        res.status(401).send({error: 1, message: 'OTP invalid or expired'});  
      }
    }
    else{
      res.status(404).send({error: 1, message: 'No user with this Email' });
    }
  })

};