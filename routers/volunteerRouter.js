const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');
const pickup = require('../models/pickup');
//const { isValidObjectId } = require('mongoose');

const volunteerRouter = express.Router();

//Register API
volunteerRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
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
  })
);

//Login API
volunteerRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findOne({ email: req.body.email });

    console.log(req.body);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          error: 0,
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({error: 1, message: 'Invalid email or password' });
  })
);

//profile API
volunteerRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findById(req.params.id);
    if (user) {
      res.send({error: 0, user : user});
    } else {
      res.status(404).send({error: 1, message: 'User Not Found' });
    }
  })
);


//edit profile
volunteerRouter.patch(
  '/editProfile/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
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
  })
);


//Delete profile API
volunteerRouter.delete(
  '/delete/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findById(req.params.id);
    if (user) {
      const deleteUser = await user.remove();
      res.send({error: 0, message: 'Sucessfully deleted your account', user: deleteUser });
    } else {
      res.status(404).send({error: 1, message: 'User Not Found' });
    }
  })
);



//TestAPI
volunteerRouter.post(
  '/addPickup',
  expressAsyncHandler(async (req, res)=> {
    const volun = await Volunteer.findById(req.body.idv);
    const pro = await Provider.findById(req.body.idp);
    const pickup = new Pickup({
      provider: pro,
      volunteer: volun,
      pickupAddress: "birthday party, PECHS",
      deliveryAddress: "RHA storage, Saddar",
      status: 1,
    });
    const createdPickup = await pickup.save();
    res.send(createdPickup);
  })
)

//get Pickups (not working)
volunteerRouter.get(
  '/getPickups',
  expressAsyncHandler(async (req,res)=>{
    console.log("pehlay idhar");
    const pickups = await Pickup.find({status: 1});
    console.log("phir idhar");
    if(pickups){
      res.send({error:0, pickups: pickups});
    }
    else{
      res.status(404).send({error: 1, message: "No pickup found"});
    }
  })
)

//update pickup
volunteerRouter.patch(
  '/updatePickup/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body)
    if (pickup){
      const updatedPickup = await Pickup.findById(req.params.id);
      res.send({error: 0, message: "Pickup successfully updated", updatedPickup: updatedPickup});
    }else{
      res.status(404).send({error: 1, message: "Pickup not found"});
    }
  })
);

//cancel pickup
volunteerRouter.patch(
  '/cancelPickup/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pickup = await Pickup.findById(req.params.id)
    if (pickup){
      console.log(pickup.volunteer.toString());
      if(pickup.volunteer.toString() === req.body.volunteer_id){
        await Pickup.updateOne({_id: req.params.id}, {$unset: {volunteer: 1 }, status:1});
        const cancelledPickup = await Pickup.findById(req.params.id);
        res.send({error: 0, message: "Pickup successfully updated", cancelledPickup: cancelledPickup});
      }
      else{
        res.status(403).send({error: 1, message: "You don't have authorization to cancel this pickup"});
      }
    }else{
      res.status(404).send({error: 1, message: "Pickup not found"});
    }
  })
);
module.exports = volunteerRouter;
//export default volunteerRouter;
