const  mongoose  = require("mongoose");

const providerSchema = new mongoose.Schema({
    fullName: { type: String, required: true, index: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true, index: true },
    gender: { type: String, required: true, index: true },
    ongoing_pickup: {type:Boolean, required:true}
})
providerSchema.index( { fullName: "text", address: "text", gender: "text" } )
module.exports = mongoose.model("Provider", providerSchema);
    