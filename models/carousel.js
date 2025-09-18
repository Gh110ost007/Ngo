const mongoose = require("mongoose")
var carouselSchema =
    new mongoose.Schema({
        imgUrl: { type: String, required: true },
        heading: { type: String, required: true },
        description: { type: String, required: true },
    });

let carousel = mongoose.model("Carousel", carouselSchema)

module.exports = carousel;