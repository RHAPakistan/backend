const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Token = require('../../models/token');
const { generateToken, sendEmail } = require('../../utils.js');
const helpers = require("../../helpers/adminVolunteerHelpers.js"); 
const adminVolunteerRouter = express.Router();

/*
get volunteer
pass query as parameters
*/
adminVolunteerRouter.get("/:id", helpers.get_volunteer); 

//get all volunteers
adminVolunteerRouter.get("/", helpers.get_volunteers);

//create volunteer
adminVolunteerRouter.post("/", helpers.register);

//update volunteer
adminVolunteerRouter.patch("/:id", helpers.updateProfie);

//delete volunteer
adminVolunteerRouter.delete("/:id",helpers.delete_volunteer);

//search for volunteers
adminVolunteerRouter.post('/search', helpers.search_volunteers);

module.exports = adminVolunteerRouter;
