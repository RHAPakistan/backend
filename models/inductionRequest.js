const mongoose = require("mongoose");
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
});
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
    rejectionReasons: {type: String},
    locationCoordinate: { type: pointSchema}
})

inductionRequestSchema.index( { 
    fullname: "text",
    email: "text",
    cnic: "text",
    dob: "text",
    contactNumber: "text",
    gender: "text",
    occupation: "text",
    address: "text",
    emergencyContact: "text",
    relationEmergency: "text",
    fbLink: "text",
    isVacinated: "text",
    medicalCondition: "text",
    heardRHAwhere: "text",
    contactsInRha: "text",
    volunteeredOrganizations: "text",
    reasonForApply: "text",
    skills: "text",
    pickupTiming: "text",
    questions: "text",
    locationCoordinate: "2dsphere"
 } )
module.exports = mongoose.model("Induction_Request",inductionRequestSchema);