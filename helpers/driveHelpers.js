const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Drive = require("../models/drive");

module.exports = {
    getDrives: expressAsyncHandler(async(req,res)=>{
        const drives = await Drive.find({status: req.params.status});
        if(drives){
            res.status(200).send(drives)
        }else{
            res.status(404).send("Not found");
        }
    }),

    createDrive: expressAsyncHandler(async(req,res)=>{
        const drive = new Drive(req.body);
        createdDrive = await drive.save();
        if(createdDrive){
            res.status(200).send(drive.toObject())
        }else{
            res.status(500).send("Server error");
        }
    }),

    getDrive: expressAsyncHandler(async(req,res)=>{
        const drives = await Drive.findById(req.params.id);
        if(drives){
            res.status(200).send(drives)
        }else{
            res.status(404).send("Not found");
        }
    }),

    editDrive: expressAsyncHandler(async(req,res)=>{
        const drive = await Drive.findByIdAndUpdate(req.params.id,req.body);
        if(drive){
            res.status(200).send(req.body);
        }else{
            res.status(404).send("Not found");
        }
    }),
    
    deleteDrive: expressAsyncHandler(async(req,res)=>{
        const drive = await Drive.findByIdAndDelete(req.params.id);
        if(drive){
            res.status(200).send({
                "message":"user deleted",
                "status":"deleted",
                "id": req.params.id})
        }else{
            res.status(400).send("already deleted");
        }
    })
};