const express = require('express');
const { generateToken, isAuth } = require('../utils.js');
const {
    userJoin,
    getUserSocket,
    userLeave
  } = require("../utils/users.js");

const providerRouter = express.Router();

var providerHelpers = require("../helpers/providerHelpers.js")

//ignore the apis enclosed in ======================
providerRouter.post("/abc",async (req, res)=>{
    const socket = req.app.get("socketio");
    curr_socket = getUserSocket(req.body.sock_id);
    curr_socket.emit("Food picked",{"someone":"ge2t"});
    console.log("hi");
    res.send({abcd:"you go"});
});
providerRouter.post("/abc1",async (req, res)=>{
    const socket = req.app.get("socketio");
    curr_socket = getUserSocket(req.body.sock_id);
    console.log(curr_socket);
    curr_socket.emit("Request Accepted",{"someone":"ge2t"});
    console.log("hi");
    res.send({abcd:"you go"});
});
//=============================================================

//Register API | create
providerRouter.post('/register', providerHelpers.register);

//Signin API
providerRouter.post('/signin', providerHelpers.signin);

//Profile API (get profile by ID)
providerRouter.get('/:id', isAuth,providerHelpers.getUser);

//delete
providerRouter.delete('/:id', isAuth, providerHelpers.deleteUser);

//update
providerRouter.patch('/:id', isAuth, providerHelpers.updateUser);

//create pickup
providerRouter.post("/pickup/register", isAuth, providerHelpers.createPickup)

//Get pickup
providerRouter.get('/pickup/:id', isAuth, providerHelpers.getPickup);

//delete pickup
providerRouter.delete("/pickup/:id", isAuth, providerHelpers.deletePickup)

//update pickup
providerRouter.patch("/pickup/:id", isAuth, providerHelpers.updatePickup)


//export default providerRouter;
module.exports = providerRouter;