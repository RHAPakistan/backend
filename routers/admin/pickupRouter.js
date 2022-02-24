const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Volunteer = require('../../models/volunteer');
const Provider = require('../../models/provider');
const Pickup = require('../../models/pickup');
const { isAuth } = require('../../utils.js');

var pickupHelpers = require("../../helpers/pickupHelpers.js");
const pickupRouter = express.Router();

//get Pickups
pickupRouter.get('/', pickupHelpers.get_pickups);

//get detials
pickupRouter.get('/:id', pickupHelpers.get_details);

//adding a dropoff loc
pickupRouter.post('/:id/dropoff/', isAuth, pickupHelpers.add_drop_off);

//adding a volunteer
pickupRouter.post('/:id/volunteer/', isAuth, pickupHelpers.add_volunteer);

//update a pickup
pickupRouter.patch('/:id', isAuth, pickupHelpers.updatePickup);

module.exports = pickupRouter;
