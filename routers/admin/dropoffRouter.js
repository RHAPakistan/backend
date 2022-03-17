const express = require('express');
const helpers = require('../../helpers/dropoffHelpers.js');
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