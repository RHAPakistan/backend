const  mongoose  = require("mongoose");

const pickupSchema = new mongoose.Schema({
    provider: { type: ObjectId, ref: 'provider', required: [true] },
    admin: { type: ObjectId, ref: 'admin' },
    volunteer: { type: ObjectId, ref: 'volunteer' },
    pickupAddress: { type: String, required: [true, "the address is missing"] },
    deliveryAddress: { type: String },
    placementTime: { type: Date },
    acceptanceTime: { type: Date },
    pickUpTime: { type: Date },
    deliveryTime: { type: Date },
    amountOfFood: { type: String },
    typeOfFood: { type: String },
    status: { type: String }
})

module.exports = mongoose.model('Order', pickupSchema);