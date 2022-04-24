const  mongoose  = require("mongoose");
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
<<<<<<< HEAD
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });
=======
    },
    coordinates: {
      type: [Number],
    }
});
>>>>>>> cbb6d20... location added in volunteer and induction
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
<<<<<<< HEAD
    location: {
        type: pointSchema,
        required: false
    }
})
volunteerSchema.index({ location: '2dsphere' });
//dateOfBirth: { type: Date, required: true },
volunteerSchema.index( { fullName: "text", address: "text", gender: "text" } )
=======
    locationCoordinate: { type: pointSchema}
})
volunteerSchema.index( { fullName: "text", address: "text", gender: "text", locationCoordinate: "2dsphere" } )
>>>>>>> cbb6d20... location added in volunteer and induction

module.exports = mongoose.model('Volunteer',volunteerSchema);