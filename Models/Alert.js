const mongoose = require("mongoose");
const alertSchema = new mongoose.Schema({
    name: String,
    email: String,
    latilude: Number,
    longitude: Number
})
module.exports = mongoose.model('Alert', alertSchema)