const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');
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
      //temp = req.body
      req.body.password = bcrypt.hashSync(req.body.password, 8) 
      const user = new Volunteer(
        req.body
      );

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
volunteerRouter.post(
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

//TestAPI (not working)
volunteerRouter.post(
  '/addPickup',
  expressAsyncHandler(async (req, res)=> {
    const volun = Volunteer.findById("6190f6c774b2f1f508b1e3f4");
    const pro = Provider.findById("6190eaffa9186f16a0113139");
    const pickup = new Pickup({
      provider: volun._id,
      volunteer: pro._id,
      pickupAddress: "shadi hall, korangi",
      deliveryAddress: "RHA storage, korangi"
    });
    pickup.save();
  })
)
module.exports = volunteerRouter;
//export default volunteerRouter;
