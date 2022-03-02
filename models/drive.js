const  mongoose  = require("mongoose");

const driveSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    date: { type: String, required: true},
    meetupTime: {type: String},
    departureTime: {type: String},
    meetupPoint: {type: String},
    driveLocation: {type: String, required: true},
    volunteerCategory: {type: String, enum: ['male', 'female', 'all']},
    maxCount: {type: Number, required: true},
    currentCount: {type: Number},
    duration: {type: String},
    description: {type: String},
    volunteers_SignedUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'volunteer' }],
    isActive: {type: Boolean}

})

module.exports = mongoose.model('Drive', driveSchema);