const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Token = require('../../models/token');
const { generateToken, sendEmail } = require('../../utils.js');
const helpers = require('../../helpers/dropoffHelpers.js');
const dropoff = require('../../models/dropoff');
const dropoffRouter = express.Router();

// get dropoffs
dropoffRouter.get('/', helpers.getDropoffs);

// //get dropoff
dropoffRouter.get('/:id',helpers.getDropoff);

// //create dropoff
dropoffRouter.post('/',helpers.createDropoff);

// //edit dropoff
dropoffRouter.patch('/:id', helpers.editDropoff);

// //cancel dropoff
dropoffRouter.delete('/:id', helpers.deleteDropoff);

module.exports = dropoffRouter;