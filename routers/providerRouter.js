const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Provider = require('../models/provider');
const { generateToken, isAuth } = require('../utils.js');


const providerRouter = express.Router();

var providerHelpers = require("../helpers/providerHelpers.js")

//Register API | create
providerRouter.post('/register', providerHelpers.register);

//Signin API
providerRouter.post('/signin', providerHelpers.signin);

//Profile API (get profile by ID)
providerRouter.get('/:id', providerHelpers.getUser);

//delete
providerRouter.delete('/:id', providerHelpers.deleteUser);

//update
providerRouter.patch('/:id', providerHelpers.updateUser);

//create pickup
providerRouter.post("/pickup/register", providerHelpers.createPickup)

//Get pickup
providerRouter.get('/pickup/:id', providerHelpers.getPickup);

//delete pickup
providerRouter.delete("/pickup/:id", providerHelpers.deletePickup)


//update pickup
providerRouter.patch("/pickup/:id", providerHelpers.updatePickup)

//export default providerRouter;
module.exports = providerRouter;