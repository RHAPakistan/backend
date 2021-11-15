const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const { generateToken, isAuth } = require('../utils.js');

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
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser),
      });
    }
  })
);

//SignIn API
volunteerRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findOne({ email: req.body.email });

    console.log(req.body);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

//profile API
volunteerRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await Volunteer.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

module.exports = volunteerRouter;
//export default volunteerRouter;