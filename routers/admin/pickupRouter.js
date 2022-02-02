const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Volunteer = require('../../models/volunteer');
const Provider = require('../../models/provider');
const Pickup = require('../../models/pickup');
const { generateToken, isAuth } = require('../../utils.js');

const pickupRouter = express.Router();

//get Pickups
pickupRouter.get(
    '/',
    expressAsyncHandler(async (req,res)=>{
      const pickups = await Pickup.find();
      if(pickups){
        res.send({error:0, pickups: pickups});
      }
      else{
        res.status(404).send({error: 1, message: "No pickup found"});
      }
    })
  )

module.exports = pickupRouter;