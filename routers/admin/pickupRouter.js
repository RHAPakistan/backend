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
);

//get detials
pickupRouter.get(
  '/:id',
  expressAsyncHandler(async (req,res)=>{
    const pickup = await Pickup.findById(req.params.id);
    if (pickup){
      console.log(pickup.provider.toString());
      const provider = await Provider.findOne({_id: pickup.provider.toString()});
      let volunteer = {};
      let admin = {};
      if(pickup.volunteer){
        volunteer = await Volunteer.findOne({_id: pickup.volunteer.toString()});
      }
      if(pickup.admin){
        admin = await Admin.findOne({_id: pickup.admin.toString()});
      }
      res.status(200).send({error: 0, pickupInfo:pickup, provider: provider, volunteer: volunteer, admin: admin});
    }
    else{
      res.status(404).send({error: 1, message: "No pickup found"});
    }
  })
);

module.exports = pickupRouter;
