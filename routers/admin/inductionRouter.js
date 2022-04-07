const express = require('express');
const helpers = require('../../helpers/inductionHelpers.js');
const inductionRouter = express.Router();
const { isAuth } = require('../../utils.js');


// get induction requests
inductionRouter.get('/', helpers.getInductionRequests);

//get induction request
inductionRouter.get('/:id',helpers.getInductionRequest);

//approve induction request
inductionRouter.patch('/approve/:id', helpers.approveInductionRequest);

//disapprove induction request
inductionRouter.patch('/disapprove/:id', helpers.disapproveInductionRequest);

module.exports = inductionRouter;