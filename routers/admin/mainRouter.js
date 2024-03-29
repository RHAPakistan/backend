const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Token = require('../../models/token');
const { generateToken, sendEmail } = require('../../utils.js');

const mainRouter = express.Router();
var adminHelpers = require("../../helpers/adminHelpers.js");

mainRouter.post('/register', adminHelpers.register);
  
//Login API
mainRouter.post('/auth', adminHelpers.auth);
  
//to send otp to person's email
mainRouter.post('/auth/forgot', adminHelpers.auth_forgot);

//to verify that otp against that mail
mainRouter.post('/auth/forgot/verify', adminHelpers.auth_forgot_verify);
module.exports = mainRouter;
