const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Token = require('../../models/token');
const { generateToken, sendEmail } = require('../../utils.js');
const helpers = require("../../helpers/adminProviderHelpers.js"); 
const providerRouter = express.Router();

/*
get provider
pass query as parameters
*/
providerRouter.get("/:id", helpers.get_provider); 

//create provider
providerRouter.post("/", helpers.create_provider);

//update provider
providerRouter.patch("/:id", helpers.update_provider);

//delete provider
providerRouter.delete("/:id",helpers.delete_provider);


module.exports = providerRouter;
