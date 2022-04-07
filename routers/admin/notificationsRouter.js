const {admin} = require("../../firebase-config");
const express = require('express');

const notificationsRouter = express.Router();
var notificationHelpers = require("../../helpers/notificationHelpers.js");

//Login API
notificationsRouter.post('/login', notificationHelpers.login);

notificationsRouter.post('/logout', notificationHelpers.logout);

notificationsRouter.post('/test', (req,res)=>{
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };
    const  registrationToken = req.body.registrationToken
    const message = req.body.message
    const options =  notification_options
    
      admin.messaging().sendToDevice(registrationToken, message)
      .then( response => {

       res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

})

module.exports = notificationsRouter;
