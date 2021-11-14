import { mongoose } from "mongoose"
import { Schema } from "mongoose"

const volunteerSchema = new Schema({
    fullName: { type: String, required: [true] },
    contactNumber: { type: String, required: [true] },
    email: { type: String, required: [true] },
    password: { type: String, required: [true] },
    cnic: { type: String, required: [true] },
    dateOfBirth: { type: String, required: [true] },
    address: { type: String, required: [true] },
    gender: { type: String, required: [true] },
    role: { type: String, enum: ['guest', 'registered'], required: [true] }
})

module.exports = mongoose.model('volunteer',volunteerSchema);