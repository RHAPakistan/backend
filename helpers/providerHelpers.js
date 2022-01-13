const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {
   
    register: expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const user = await Provider.findOne({ email: req.body.email });
    if(user){
      res.send({message: "email already exist"})
    }    
    else{
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
  })
};