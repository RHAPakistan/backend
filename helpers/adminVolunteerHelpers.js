const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Pickup = require('../models/pickup');
const Drive = require('../models/drive');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {


    get_volunteers: expressAsyncHandler(async(req,res)=>{

        var filter = {}
        for(const key in req.query){
          filter[key] = req.query[key];
        }
        const volunteers = await Volunteer.find(filter);
        if(volunteers){
            res.status(200).send(volunteers);
        }else{
            res.status(404).send("not found");
        }
    }),

    get_volunteer: expressAsyncHandler(async (req,res)=>{
        const user = await Volunteer.findById(req.params.id);
        if(user){
            var volunteer = user.toObject();
            delete volunteer["password"];
            res.status(200).send(volunteer);
        }else{
            res.status(404).send("not found");
        }
    }),
    
    register: expressAsyncHandler(async (req, res) => {
        //console.log(req.body);
        const user = await Volunteer.findOne({ email: req.body.email });
        if(user){
          res.send({message: "email already exist"})
        }
        else{
          const user = new Volunteer({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            contactNumber: req.body.contactNumber,
            cnic: req.body.cnic,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            gender: req.body.gender,
            role: req.body.role,
            ongoing_pickup: false,
            location: req.body.location?req.body.location:{type:"Point", coordinates:[-1,0]}
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
    login: expressAsyncHandler(async (req, res) => {
        const user = await Volunteer.findOne({ email: req.body.email });
        //console.log(user._id);
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const activePickups = await Pickup.find({status: 1});
            const pickupHistory = await Pickup.find({volunteer_id: user._id});
            res.send({
              error: 0,
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
              activePickups: activePickups,
              pickupHistory: pickupHistory,
              token: generateToken(user),
            });
          }
          else{
            res.status(401).send({error: 1, message: 'Invalid password' });
          }
        }
        else{
          res.status(401).send({error: 1, message: 'Invalid email' });
        }
      }),
    updateProfie: expressAsyncHandler(async (req, res) => {
        const user = await Volunteer.findById(req.params.id);
        if(user){
          await Volunteer.updateOne({_id: req.params.id},
          { 
            fullName: req.body.fullName,
            contactNumber: req.body.contactNumber,
            email: req.body.email,
            //password: req.body.password,
            cnic: req.body.cnic,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            gender: req.body.gender,
          },
          { upsert: true });
          const updatedUser = await Volunteer.findById(req.params.id);
          res.send({error: 0, message: "Successfully updated", updatedUser: updatedUser});
    
        }
        else{
          res.status(404).send({message: "User not found"});
        }
      }),
    delete_volunteer: expressAsyncHandler(async (req, res) => {
        const user = await Volunteer.findById(req.params.id);
        if (user) {
          //removing this volunteer in drives
          const updateDrive = await Drive.updateMany(
            { },
            { $pull: { volunteers_SignedUp: user._id }},
          );
          const deleteUser = await user.remove();
          res.send({error: 0, message: 'Sucessfully deleted account', user: deleteUser });
        } else {
          res.status(404).send({error: 1, message: 'User Not Found' });
        }
      }),
    search_volunteers: expressAsyncHandler(async (req, res)=>{
      //const volunteers = await Volunteer.find({ fullName: { $regex: `(?i)${req.body.text}` } });
      try{
        let volunteers = await Volunteer.find({$text: { $search: req.body.text }});
        if(volunteers){   
            if(volunteers.length >0){
              res.status(200).send({error: 0, volunteers: volunteers})
            }
            else{
              volunteers = await Volunteer.find();
              res.send({error: 1, message: "No such result. Returning all data", volunteers: volunteers});
            }
        }
        else{
            res.status(401).send({error: 2, message: "Volunteers not found"})
        }
      }
      catch (error){
        console.log("Error: ",error.codeName, error.message);
        res.send({error: 2, message: `Code: ${error.codeName}`})
      }
    })
};