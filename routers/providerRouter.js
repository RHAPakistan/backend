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
providerRouter.post("/vol",async (req, res)=>{
    const socket = req.app.get("socketio");
    curr_socket = getUserSocket(req.body.sock_id);
    console.log(curr_socket);
    curr_socket.emit("acceptPickup",{"someone":"ge2t"});
    console.log("hi");
    res.send({abcd:"you go"});
});
providerRouter.post("/volf",async (req, res)=>{
    const socket = req.app.get("socketio");
    curr_socket = getUserSocket(req.body.sock_id);
    console.log(curr_socket);
    curr_socket.emit("finishPickup",{"someone":"ge2t"});
    console.log("hi");
    res.send({abcd:"you go"});
});
providerRouter.post("/assi",async (req, res)=>{
    const socket = req.app.get("socketio");
    // curr_socket = getUserSocket(req.body.sock_id);
    // console.log(curr_socket);
    socket.emit("assignPickup",{"message":{
        "provider": "2200cbe00d34ee5d9686f417",
       "provider_phone": "12345",
        "description":"I am batman and this is a description, who cares",
        "pickupAddress": "123 block h",
        "placementTime": "02/02/2022",
        "amountOfFood": "1kg",
        "typeOfFood": "biryani",
        "broadcast": true,
        "status": 0
    }
    });
    console.log("hi");
    res.send({abcd:"you go"});
});
//=============================================================
providerRouter.get("/getContact", async(req,res)=>{
    res.status(200).send({"message":"shuja"})
})
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

//to send otp to person's email
providerRouter.post('/auth/forgot', providerHelpers.auth_forgot);

//to verify that otp against that mail
providerRouter.post('/auth/forgot/verifyOTP', providerHelpers.auth_forgot_verifyOTP);

//to change the password if otp have matched
providerRouter.post('/auth/forgot/changePassword', providerHelpers.auth_forgot_changePassword)

//Get pickup
providerRouter.get('/pickup/:id', isAuth, providerHelpers.getPickup);

//delete pickup
providerRouter.delete("/pickup/:id", isAuth, providerHelpers.deletePickup)

//update pickup
providerRouter.patch("/pickup/:id", isAuth, providerHelpers.updatePickup)



//export default providerRouter;
module.exports = providerRouter;