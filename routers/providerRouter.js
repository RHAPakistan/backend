
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Provider = require('../models/provider');
const { generateToken, isAuth } = require('../utils.js');


const providerRouter = express.Router();

var providerHelpers = require("../helpers/providerHelpers.js")

//Register API | create
providerRouter.post(
  '/register',
  providerHelpers.register
);

//Signin API
providerRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await Provider.findOne({ email: req.body.email });

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


//Profile API (get profile by ID)
providerRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await Provider.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

//delete
providerRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await Provider.findByIdAndDelete(req.params.id);
    
    console.log(user)
    if(user){
        res.status(500).send({"success":"Provider deleted succesfully"})
      }else{
      res.send({"message":"The user doesn't exist"})
      }    
  })
);

//update
providerRouter.patch(
  '/:id',
  expressAsyncHandler(async (req,res)=>{
    const user = await Provider.findByIdAndUpdate(req.params.id,req.body)
    if(user){
      res.send("User info updated succesfully")
    }
    else{
      res.send("User info not updated")
    }

  })
  
);
module.exports = providerRouter;
//export default providerRouter;
