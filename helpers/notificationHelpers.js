const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const PushToken = require('../models/pushToken');


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
              userId:req.body.userId, tokens: [req.body.token]});
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
    })
};