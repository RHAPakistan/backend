const  mongoose  = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, enum: ['guest', 'registered'], required: true },
    ongoing_pickup: {type:Boolean, required:true, default: false}
})
//dateOfBirth: { type: Date, required: true },
module.exports = mongoose.model('Volunteer',volunteerSchema);