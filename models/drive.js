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
    currentCount: {type: Number, required: true, default: 0},
    duration: {type: String},
    description: {type: String},
    volunteers_SignedUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'volunteer' }],
    status: {type: Number, enum: [-1, 0, 1, 2], required: true, default: 1}, //0 for inactive, 1 for active, 2 for completed and -1 for cancelled
    creation_time: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Drive', driveSchema);