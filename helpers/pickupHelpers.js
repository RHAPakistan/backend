const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const Admin = require('../models/admin');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {

    get_pickups: expressAsyncHandler(async (req, res) => {
        //if the params have status code
        const pickups = await Pickup.find(req.query);
        if (pickups) {
            res.send({ error: 0, pickups: pickups });
        }
        else {
            res.status(404).send({ error: 1, message: "No pickup found" });
        }
    }),

    get_details: expressAsyncHandler(async (req, res) => {
        const pickup = await Pickup.findById(req.params.id);
        if (pickup) {
            //console.log(pickup.provider.toString());
            const provider = await Provider.findOne({ _id: pickup.provider.toString() });
            let volunteer = {};
            let admin = {};
            if (pickup.volunteer) {
                volunteer = await Volunteer.findOne({ _id: pickup.volunteer.toString() });
            }
            if (pickup.admin) {
                admin = await Admin.findOne({ _id: pickup.admin.toString() });
            }
            res.status(200).send({ error: 0, pickupInfo: pickup, provider: provider, volunteer: volunteer, admin: admin });
        }
        else {
            res.status(404).send({ error: 1, message: "No pickup found" });
        }
    }),
    add_drop_off: expressAsyncHandler(async (req, res) => {
        await Pickup.findByIdAndUpdate(req.params.id, { deliveryAddress: req.body.dropoff });
        const pickup = await Pickup.findById(req.params.id);
        if (pickup) {
            res.status(200).send({ error: 0, message: "Dropoff assigned sucessfully!", pickup: pickup });
        }
        else {
            res.status(404).send({ error: 1, message: "No pickup found" });
        }

    }),
    add_volunteer: expressAsyncHandler(async (req, res) => {
        const volunteer = await Volunteer.findById(req.body.volunteer_id);
        await Pickup.findByIdAndUpdate(req.params.id, { volunteer: volunteer });
        const pickup = await Pickup.findById(req.params.id);
        if (pickup) {
            res.status(200).send({ error: 0, message: "Volunteer assigned sucessfully!", pickup: pickup });
        }
        else {
            res.status(404).send({ error: 1, message: "No pickup found" });
        }

    }),

    //I don't get what ibtehaj has written about this in the doc-Jawad
    cancel_pickup: expressAsyncHandler(async(req,res)=>{
        const deleted = await Pickup.findByIdAndDelete(req.params.id);
        if(deleted){
            res.status(200).send({error:0,})
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
    
}