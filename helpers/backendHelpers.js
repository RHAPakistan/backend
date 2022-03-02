const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Volunteer = require('../models/volunteer');
const Admin = require('../models/admin');
const Pickup = require('../models/pickup');
const { generateToken, isAuth } = require('../utils.js');

module.exports = {

    update_pickup: async(id, new_pickup) => {
        const res = await Pickup.findByIdAndUpdate(id, new_pickup);
        if(res){
            return true;
        }else{
            return false;
        }
    }
}