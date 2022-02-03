const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const { generateToken } = require('../../utils.js');

const mainRouter = express.Router();

mainRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
      //console.log(req.body);
      const user = await Admin.findOne({ email: req.body.email });
      if(user){
        res.send({message: "email already exist"})
      }
      else{
        const user = new Admin({
          fullName: req.body.fullName,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          contactNumber: req.body.contactNumber,
          cnic: req.body.cnic,
          dateOfBirth: req.body.dateOfBirth,
          address: req.body.address,
          gender: req.body.gender,
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
  mainRouter.post(
    '/auth',
    expressAsyncHandler(async (req, res) => {
      const user = await Admin.findOne({ email: req.body.email });
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
        else{
          res.status(401).send({error: 1, message: 'Invalid password' });
        }
      }
      else{
        res.status(401).send({error: 1, message: 'Invalid email' });
      }
    })
  );
  

  module.exports = mainRouter;