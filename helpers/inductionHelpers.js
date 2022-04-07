const express = require('express');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const InductionRequest = require("../models/inductionRequest");
const Volunteer = require("../models/volunteer");
const { sendEmail } = require('../utils.js');

module.exports = {
    getInductionRequests: expressAsyncHandler(async(req,res)=>{
        const inductions = await InductionRequest.find({isPending: true});
        if(inductions){
            res.status(200).send(inductions)
        }else{
            res.status(404).send("Not found");
        }
    }),

    getInductionRequest: expressAsyncHandler(async(req,res)=>{
        const inductions = await InductionRequest.findById(req.params.id);
        if(inductions){
            res.status(200).send(inductions)
        }else{
            res.status(404).send("Not found");
        }
    }),

    approveInductionRequest: expressAsyncHandler(async(req,res)=>{
        const userEmail = req.body.email;
        let user = await InductionRequest.findOne({_id: req.params.id, email: userEmail});
        if(user){
            const randomPassword = crypto.randomBytes(3).toString('hex');
            const message = "Congratulations!!! \n\nYour request for Volunteer at RHA has been approved. You will be further guided through whatsapp\n You can login through app with this email and your temporaray Password is: ("+randomPassword+"). You are requested to change the password at the earliest \n\n Thanks and regards, \nAdmin RHA";
            const sentMail  = await sendEmail(userEmail, "Volunteer Induction at RHA", message);
            if(sentMail){
                user.isPending = false;
                user.isApproved = true;
                user.approved_or_disapproved_at = new Date();
                await user.save();
                const vol = new Volunteer({
                    fullName: user.fullname,
                    email: user.email,
                    password: bcrypt.hashSync(randomPassword, 8),
                    contactNumber: user.contactNumber,
                    cnic: user.cnic,
                    dateOfBirth: user.dob,
                    address: user.address,
                    gender: user.gender,
                    role: "registered"
                });
                const createdUser = await vol.save();
                if(createdUser){
                    res.send({error: 0, message:"Volunteer Inducted sucessfully"});
                }
                else{
                    res.status(404).send({error: 1, message: 'Volunteer could not be conducted due to some server issue'});
                }
            }
            else{
                res.status(404).send({error: 1, message: 'Error: Email could not be sent. \n Invalid ID password OR sending email configuration error'});
            }
            
        }
        else{
            res.status(401).send({error: 1, message: 'Invalid email' });
        }
    }),
    
    
    disapproveInductionRequest: expressAsyncHandler(async(req,res)=>{
        const userEmail = req.body.email;
        console.log("ID email is: ",req.params.email, userEmail);
        const user = await InductionRequest.findOne({_id: req.params.id, email: userEmail});
        if(user){
            const message = "Sorry, \nYour request for Volunteer at RHA has not been approved due to the following reason(s): \n->"+req.body.rejectionReasons+" \n\nFor further details kindly contact admin";
            const sentMail = await sendEmail(userEmail, "Volunteer Induction at RHA", message);
            if(sentMail){
                user.isPending = false;
                user.isApproved = false;
                user.approved_or_disapproved_at = new Date();
                user.rejectionReasons = req.body.rejectionReasons;
                await user.save();
                res.send({error: 0, message:"Email sent sucessfully"});
            }
            else{
                res.status(404).send({error: 1, message: 'Error: Email could not be sent. \n Invalid ID password OR sending email configuration error'});
            }
        }
        else{
            res.status(401).send({error: 1, message: 'Invalid email' });
        }
    }),
};