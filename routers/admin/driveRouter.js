const express = require('express');
const helpers = require('../../helpers/driveHelpers.js');
const driveRouter = express.Router();
const { isAuth } = require('../../utils.js');
// get drives
driveRouter.get('/:status', helpers.getDrives);

// //get drive
driveRouter.get('/:id',helpers.getDrive);

//get participants of the drive
driveRouter.get('/participants/:id', helpers.get_participants);

// //create drive
driveRouter.post('/', isAuth, helpers.createDrive);

// //edit drive
driveRouter.patch('/:id', isAuth, helpers.update_drive);

// //cancel drive
driveRouter.delete('/:id', isAuth, helpers.deleteDrive);

//get unerolled volunteers
driveRouter.get('/volunteers/unenrolled/:id', helpers.get_unenrolled_participants);

//remove volunteer from drive
driveRouter.patch('/participant/remove/:id', helpers.remove_participant);

module.exports = driveRouter;