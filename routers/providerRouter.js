const express = require('express');
const { generateToken, isAuth } = require('../utils.js');


const providerRouter = express.Router();

var providerHelpers = require("../helpers/providerHelpers.js")

//Register API | create
providerRouter.post('/register', isAuth,providerHelpers.register);

//Signin API
providerRouter.post('/signin', isAuth,providerHelpers.signin);

//Profile API (get profile by ID)
providerRouter.get('/:id', isAuth,providerHelpers.getUser);

//delete
providerRouter.delete('/:id', isAuth, providerHelpers.deleteUser);

//update
providerRouter.patch('/:id', isAuth, providerHelpers.updateUser);

//create pickup
providerRouter.post("/pickup/register", isAuth, providerHelpers.createPickup)

//Get pickup
providerRouter.get('/pickup/:id', isAuth, providerHelpers.getPickup);

//delete pickup
providerRouter.delete("/pickup/:id", isAuth, providerHelpers.deletePickup)

//update pickup
providerRouter.patch("/pickup/:id", isAuth, providerHelpers.updatePickup)

//export default providerRouter;
module.exports = providerRouter;