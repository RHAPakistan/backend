const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {

  get_pickups: expressAsyncHandler(async (req, res) => {
    const pickups = await Pickup.find({ status: 1 });
    if (pickups) {
      res.send({ error: 0, pickups: pickups });
    }
    else {
      res.status(404).send({ error: 1, message: "No pickup found" });
    }
  }),

  get_pickups_by_vol_id: expressAsyncHandler(async (req,res) => {
    const pickups = await Pickup.find({$or: [{volunteer: req.params.id, status:1},{broadcast: true, status: 1}]});
    if (pickups) {
      res.send({ error: 0, pickups: pickups });
    }
    else {
      res.status(404).send({ error: 1, message: "No pickup found" });
    }
  }),

  get_pickup_by_id: expressAsyncHandler(async (req, res) => {
    console.log("??????????????????????");
    const user = await Pickup.findById(req.params.id);
    console.log("The pickupid in params is ", req.params.id);
    console.log("The user is ",user);
    if (user) {
      res.send({ error: 0, user: user });
    } else {
      res.status(404).send({ error: 1, message: 'User Not Found' });
    }
  }),

  register: expressAsyncHandler(async (req, res) => {
    //console.log(req.body);
    const user = await Volunteer.findOne({ email: req.body.email });
    if (user) {
      res.send({ message: "email already exist" })
    }
    else {
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
    console.log("Volunteer attempted login");
    console.log(req.body.email);
    console.log(req.body.password);
    const user = await Volunteer.findOne({ email: req.body.email });
    //console.log(user._id);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password, )) {
        const activePickups = await Pickup.find({ status: 1 });
        const pickupHistory = await Pickup.find({ volunteer_id: user._id });
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
      else {
        res.status(401).send({ error: 1, message: 'Invalid password' });
      }
    }
    else {
      res.status(401).send({ error: 1, message: 'Invalid email' });
    }
  }),
updateProfie: expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findById(req.params.id);
    if (user) {
      await Volunteer.updateOne({ _id: req.params.id },
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
      res.send({ error: 0, message: "Successfully updated", updatedUser: updatedUser });

    }
    else {
      res.status(404).send({ message: "User not found" });
    }
  }),
  delete_volunteer: expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findById(req.params.id);
    if (user) {
      const deleteUser = await user.remove();
      res.send({ error: 0, message: 'Sucessfully deleted your account', user: deleteUser });
    } else {
      res.status(404).send({ error: 1, message: 'User Not Found' });
    }
  }),
  updatePickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body)
    if (pickup) {
      const updatedPickup = await Pickup.findById(req.params.id);
      res.send({ error: 0, message: "Pickup successfully updated", updatedPickup: updatedPickup });
    } else {
      res.status(404).send({ error: 1, message: "Pickup not found" });
    }
  }),
  cancelPickup: expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findById(req.params.id)
    if (pickup) {
      //console.log(pickup.volunteer.toString());
      if (pickup.volunteer.toString() === req.body.volunteer_id) {
        await Pickup.updateOne({ _id: req.params.id }, { $unset: { volunteer: 1 }, status: 1, cancelTime: new Date() });
        const cancelledPickup = await Pickup.findById(req.params.id);
        res.send({ error: 0, message: "Pickup successfully cancelled", cancelledPickup: cancelledPickup });
      }
      else {
        res.status(403).send({ error: 1, message: "You don't have authorization to cancel this pickup" });
      }
    } else {
      res.status(404).send({ error: 1, message: "Pickup not found" });
    }
  })
};