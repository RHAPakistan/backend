const express = require('express');
const helpers = require('../../helpers/driveHelpers.js');
const driveRouter = express.Router();

// get drives
driveRouter.get('/', helpers.getDrives);

// //get drive
driveRouter.get('/:id',helpers.getDrive);

// //create drive
driveRouter.post('/',helpers.createDrive);

// //edit drive
driveRouter.patch('/:id', helpers.editDrive);

// //cancel drive
driveRouter.delete('/:id', helpers.deleteDrive);

module.exports = driveRouter;