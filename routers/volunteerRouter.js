const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Provider = require('../models/provider');
const Pickup = require('../models/pickup');
const { isAuth } = require('../utils.js');

const volunteerRouter = express.Router();
var volunteerHelpers = require("../helpers/volunteerHelpers.js");


//get pickups by volunteer id
volunteerRouter.get('/pickups/vol_id/:id', volunteerHelpers.get_pickups_by_vol_id);

//get Pickups
volunteerRouter.get('/getPickups', volunteerHelpers.get_pickups);

//get drives
volunteerRouter.get('/getDrives/:volunteer_id', volunteerHelpers.get_drives);

//profile API
volunteerRouter.get('/:id', isAuth, volunteerHelpers.get_pickup_by_id);

//get pickups API
volunteerRouter.get('/getPickups/:id', isAuth, volunteerHelpers.get_pickup_by_id);

//Register API
volunteerRouter.post('/register', volunteerHelpers.register);

//Request Induction
volunteerRouter.post('/placeInductionRequest', volunteerHelpers.placeInductionRequest);

//Login API
volunteerRouter.post('/login', volunteerHelpers.login);

//to send otp to person's email
volunteerRouter.post('/auth/forgot', volunteerHelpers.auth_forgot);

//to verify that otp against that mail
volunteerRouter.post('/auth/forgot/verifyOTP', volunteerHelpers.auth_forgot_verifyOTP);

//to change the password if otp have matched
volunteerRouter.post('/auth/forgot/changePassword', volunteerHelpers.auth_forgot_changePassword)

//edit profile
volunteerRouter.patch('/editProfile/:id', isAuth, volunteerHelpers.updateProfie);

//Delete profile API
volunteerRouter.delete('/delete/:id', isAuth, volunteerHelpers.delete_volunteer);

//update pickup
volunteerRouter.patch('/updatePickup/:id', isAuth, volunteerHelpers.updatePickup);

//cancel pickup
volunteerRouter.patch('/cancelPickup/:id', isAuth, volunteerHelpers.cancelPickup);

// enroll in a drive
volunteerRouter.patch('/enrollDrive/:id', isAuth, volunteerHelpers.enrollDrive)

//get volunteers by distances
volunteerRouter.post('/getByDistance', volunteerHelpers.get_by_distance);

//update location
volunteerRouter.patch('/updateLocation', volunteerHelpers.update_location);
module.exports = volunteerRouter;
