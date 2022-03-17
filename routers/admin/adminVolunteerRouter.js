const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Token = require('../../models/token');
const { generateToken, sendEmail } = require('../../utils.js');
const helpers = require("../../helpers/adminVolunteerHelpers.js"); 
const volunteerRouter = express.Router();

/*
get volunteer
pass query as parameters
*/
volunteerRouter.get("/:id", helpers.get_volunteer); 

//get all volunteers
volunteerRouter.get("/", helpers.get_volunteers);

//create volunteer
volunteerRouter.post("/", helpers.register);

//update volunteer
volunteerRouter.patch("/:id", helpers.updateProfie);

//delete volunteer
volunteerRouter.delete("/:id",helpers.delete_volunteer);


module.exports = volunteerRouter;
