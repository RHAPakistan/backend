const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const PushToken = require('../models/pushToken');
const axios = require('axios').default;

module.exports = {

    login: expressAsyncHandler(async (req, res) => {
        console.log(req.body);
        const token = await PushToken.find({ userId: req.body.userId});
        if (token.length>0) {
          const tokenCreated = await PushToken.findOneAndUpdate({
              userId:req.body.userId},{$addToSet:{tokens:req.body.token}});
          
          res.send({
            token: tokenCreated
          });
        }
        else {
          //create new provider
          const token = new PushToken({
              userId:req.body.userId, 
              userType: req.body.userType,
              tokens: [req.body.token]});
          const createdToken = await token.save();
    
          //respond to request
          res.send({
            token: createdToken
          });
        }
    }),

    logout: expressAsyncHandler(async (req, res) => {
        console.log(req.body);
        const token = await PushToken.findOneAndUpdate({ tokens: req.body.token},{$pull:{tokens:req.body.token}});
        if (token) {
            res.status(500).send({ "success": "Token deleted succesfully" })
        }
        else {
          //create new provider
          res.send({ "message": "The token doesn't exist" })

        }
    }),

    send_notification: expressAsyncHandler(async(token,title,messageBody)=>{
      var resp = await axios(
        {
          method: 'post',
          url: 'https://exp.host/--/api/v2/push/send',
          data: {
            "to": token,
            "title":title,
            "body": messageBody
          },
        });
        console.log(resp);  
    }),

    send_notification_all: expressAsyncHandler(async(userType,title,messageBody)=>{
      volunteer_push_tokens = await PushToken.find({"userType":"volunteer"});
      const pushtokens = await PushToken.find({"userType":userType},{"_id":0,"tokens":1});
      pushtokens.map((item)=>{
        item.tokens.map((subitem)=>{
          module.exports.send_notification(subitem,title,messageBody);
        })
      })
    }),

    send_notification_to: expressAsyncHandler(async(userId,title,messageBody)=>{
      console.log("Send notifciation to ", userId, title, messageBody);
      volunteer_push_tokens = await PushToken.find({"userId":userId},{"_id":0,"tokens":1});
      volunteer_push_tokens.map((item)=>{
        item.tokens.map((subitem)=>{
          module.exports.send_notification(subitem,title, messageBody);
        })
      })
    })


};