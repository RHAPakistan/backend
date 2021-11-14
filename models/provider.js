const  mongoose  = require("mongoose");
//const { Schema } = require("mongoose");

const providerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true }
})

const Provider = mongoose.model("Provider", providerSchema);
module.exports = Provider;
