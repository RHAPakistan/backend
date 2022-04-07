const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tokens: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model("PushToken", pushTokenSchema);