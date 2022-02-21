const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

const volunteerRouter = express.Router();
var volunteerHelpers = require("../helpers/volunteerHelpers.js");


//get pickups by volunteer id
volunteerRouter.get('/pickups/vol_id/:id', volunteerHelpers.get_pickups_by_vol_id);

//get Pickups
volunteerRouter.get('/getPickups', volunteerHelpers.get_pickups);

//profile API
volunteerRouter.get('/:id', isAuth, volunteerHelpers.get_pickup_by_id);

//Register API
volunteerRouter.post('/register', volunteerHelpers.register);

//Login API
volunteerRouter.post('/login', volunteerHelpers.login);

//edit profile
volunteerRouter.patch('/editProfile/:id', isAuth, volunteerHelpers.updateProfie);


//Delete profile API
volunteerRouter.delete('/delete/:id', isAuth, volunteerHelpers.delete_volunteer);




//TestAPI
volunteerRouter.post(
  '/addPickup',
  expressAsyncHandler(async (req, res) => {
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

//update pickup
volunteerRouter.patch('/updatePickup/:id', isAuth, volunteerHelpers.updatePickup);

//cancel pickup
volunteerRouter.patch('/cancelPickup/:id', isAuth, volunteerHelpers.cancelPickup);
module.exports = volunteerRouter;
