const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {


    get_volunteers: expressAsyncHandler(async(req,res)=>{

        const volunteers = await Volunteer.find({});
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
            role: req.body.role
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
          const deleteUser = await user.remove();
          res.send({error: 0, message: 'Sucessfully deleted your account', user: deleteUser });
        } else {
          res.status(404).send({error: 1, message: 'User Not Found' });
        }
      })
};