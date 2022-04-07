const mongoose = require("mongoose");

const inductionRequestSchema = mongoose.Schema({
    fullname: {type: String},
    email: {type: String},
    cnic: {type: String},
    dob: {type: String},
    contactNumber: {type: String},
    gender: {type: String},
    occupation: {type: String},
    address: {type: String},
    emergencyContact: {type: String},
    relationEmergency: {type: String},
    fbLink: {type: String},
    isVacinated: {type: String},
    medicalCondition: {type: String},
    heardRHAwhere: {type: String},
    contactsInRha: {type: String},
    volunteeredOrganizations: {type: String},
    reasonForApply: {type: String},
    skills: {type: String},
    pickupTiming: {type: String},
    questions: {type: String},
    isPending : {type: Boolean, required: true, default: true},
    isApproved : {type: Boolean},
    creation_time: {type: Date, default: Date.now},
    approved_or_disapproved_at: {type: Date},
    rejectionReasons: {type: String}
})

module.exports = mongoose.model("Induction_Request",inductionRequestSchema);