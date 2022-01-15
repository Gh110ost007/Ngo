const mongoose = require("mongoose")
var infoSchema =
    new mongoose.Schema({
        imgUrl: { type: String, required: true },
        heading: { type: String, required: true },
        description: { type: String, required: true },
    });

let info = mongoose.model("Info", infoSchema)

module.exports = info;