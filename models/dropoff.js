const mongoose = require("mongoose");

const dropoffSchema = mongoose.Schema({
    contact_name: {type: String},
    contact_phone: {type: String},
    creation_date: {type: Date},
    last_modified: {type: Date},
    dropoff_name: {type: String},
    dropoff_address: {type: String},
    dropoff_map: {type: String},
    people_count: {type: String},
    description: {type: String},
    total_pickups: {type: String},
    last_pickup: {type: Date},
})

module.exports = mongoose.model("Dropoff",dropoffSchema);