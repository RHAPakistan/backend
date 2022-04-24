const  mongoose  = require("mongoose");
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
});
const pickupSchema = new mongoose.Schema({
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'provider', required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'volunteer' },
    provider_phone:{type:String, required: false},
    description:{type:String, required: false},
    pickupAddress: { type: String, required: [true, "the address is missing"] },
    deliveryAddress: { type: String },
    placementTime: { type: Date },
    acceptanceTime: { type: Date },
    pickUpTime: { type: Date },
    cancelTime: { type: Date },
    deliveryTime: { type: Date },
    amountOfFood: { type: String },
    typeOfFood: { type: String },
    broadcast: {type: Boolean},
    status: {type: Number, enum: [0,1,2,3,4,5], required: true,},
    //pickupCoordinate: [{type: Number}]
    pickupCoordinate: {
        type: pointSchema,
    }
})
pickupSchema.index( {  pickupCoordinate : "2dsphere" } )

module.exports = mongoose.model('Pickup', pickupSchema);
