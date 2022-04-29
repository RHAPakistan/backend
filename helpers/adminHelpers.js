const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Admin = require('../models/admin');
const Pickup = require('../models/pickup');
const Token = require('../models/token');
const { generateToken, sendEmail } = require('../utils.js');

module.exports = {

  register: expressAsyncHandler(async (req, res) => {
      //console.log(req.body);
      const user = await Admin.findOne({ email: req.body.email });
      if (user) {
          res.send({ message: "email already exist" })
      }
      else {
          const user = new Admin({
              fullName: req.body.fullName,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 8),
              contactNumber: req.body.contactNumber,
              cnic: req.body.cnic,
              dateOfBirth: req.body.dateOfBirth,
              address: req.body.address,
              gender: req.body.gender,
          });
          const createdUser = await user.save();
          res.send({
              error: 0,
              _id: createdUser._id,
              name: createdUser.name,
              email: createdUser.email,
              token: generateToken(createdUser),
          });
      }
  }),

  auth: expressAsyncHandler(async (req, res) => {
      console.log(req.body);
      const user = await Admin.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
              res.send({
                  error: 0,
                  _id: user._id,
                  fullName: user.fullName,
                  email: user.email,
                  token: generateToken(user),
                  contactNumber: user.contactNumber
              });
          }
          else {
              res.status(401).send({ error: 1, message: 'Invalid password' });
          }
      }
      else {
          res.status(401).send({ error: 1, message: 'Invalid email' });
      }
  }),

  auth_forgot: expressAsyncHandler(async (req, res) =>{
    const user = await Admin.findOne({ email: req.body.email });
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
      if(sentMail)
        res.send({error: 0, message:"Password-reset-email has been sent to your Email address"});
      else
        res.status(404).send({error: 1, message: 'Error: Email could not be sent. \n Invalid ID password OR sending email configuration error'});
    }
    else{
      res.status(401).send({error: 1, message: 'Invalid email' });
    }
  }),

  auth_forgot_verifyOTP: expressAsyncHandler(async (req, res)=>{
    const user = await Admin.findOne({ email: req.body.email });
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
    const user = await Admin.findOne({ email: req.body.email });
    if(user){
      const token = await Token.findOne({ userId: user._id, otp: req.body.otp});
      if(token){
        await Admin.updateOne(
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
      res.status(404).send({error: 1, message: 'Something went wrong' });
    }
  })

}