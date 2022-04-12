
const { admin } = require("../../firebase-config");
const express = require('express');
const PushToken = require("../../models/pushToken");
const notificationsRouter = express.Router();
var notificationHelpers = require("../../helpers/notificationHelpers.js");
const axios = require('axios').default;
//Login API
notificationsRouter.post('/login', notificationHelpers.login);

notificationsRouter.post('/logout', notificationHelpers.logout);

notificationsRouter.post('/test', async (req, res) => {

  notificationHelpers.send_notification_to("provider",
  "Ye tou hoga!", "jo horaha hai paihli dafa hai");
  res.status(200).send("Hogaya");
  // try {
    // await axios
    // .post(
    //   "https://fcm.googleapis.com/fcm/send",
    //   {

    //       notification: 
    //       [
    //         {to: 'efSiml0ZSACwGgwA4kJoMH:APA91bFdeBzMiIJ1jYRB3qlG87X86D0f4-oKWh0aV-sgXBveVcr5mGhoGmadgKUAo290g9S3Ls7At2_j0kWljxcJufDqmyhhm8KSgrmGn4JVngVAv7ZZwxyDUMBmQkgWxRvpwZUr2tQc',
    //       priority: 'normal',
    //       data: {
    //         experienceId: '@jawad571/volunteer-app',
    //         scopeKey: '@jawad571/volunteer-app',
    //         title: "\uD83D\uDCE7 You've got mail",
    //         message: 'Hello world! \uD83C\uDF10',
    //       },
    //     }],
    //     to:

    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `key=AAAAkLJl49Y:APA91bGpCBPGhJSeQwpsbeOxLNjfr1qaMGwwW5vR0o5DlW79lWbDjQ8cM-l9LY5MWJQxqtIgWvp6JBw_xkJkWC9WZMXLJrnuhvWylnfhWBjT8EObfeZc5xfqSINqpkiadF5cOXSylEl9	
    //       `
    //     }
    //   }
    // )
    // .then(response => {
    //   console.log("response" + response);
    // })
    // .catch(error => {
    //   console.log(error);
    // });

  // notificationHelpers.send_notification("ExponentPushToken[aZ9YCEO61AHBNRQVcGExco]","Hello","I am batman");
  // var resp = await axios(
  //   {
  //     method: 'post',
  //     url: 'https://exp.host/--/api/v2/push/send',
  //     data: {
  //       "to": "ExponentPushToken[aZ9YCEO61AHBNRQVcGExco]",
  //       "title":"Hello",
  //       "body": "I am batman"
  //     },
  //   });
  //   console.log(resp);  
  //   } catch (error) {
  //   console.log(error);
  // }

  
  // const notification_options = {
  //       priority: "high",
  //       timeToLive: 60 * 60 * 24
  //     };
  //   const  registrationToken = req.body.registrationToken
  //   const message = req.body.message
  //   const options =  notification_options

  //     admin.messaging().sendToDevice(registrationToken, message)
  //     .then( response => {
  //       console.log(response.results[0].error);
  //      res.status(200).send(response.results[0].error)

  //     })
  //     .catch( error => {
  //         console.log(error);
  //     });

})

module.exports = notificationsRouter;
