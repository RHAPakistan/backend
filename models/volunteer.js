const  mongoose  = require("mongoose");
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });
const volunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true, index: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true, index: true },
    gender: { type: String, required: true, index: true },
    role: { type: String, enum: ['guest', 'registered'], required: true },
    ongoing_pickup: {type:Boolean, required:true, default: false},
    location: {
        type: pointSchema,
        required: false
    }
})
volunteerSchema.index({ location: '2dsphere' });
//dateOfBirth: { type: Date, required: true },
volunteerSchema.index( { fullName: "text", address: "text", gender: "text" } )

module.exports = mongoose.model('Volunteer',volunteerSchema);