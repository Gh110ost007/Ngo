const mongoose = require('mongoose')
var info = require("./models/info.js")
mongoose.connect('mongodb://admin:adiritwic@cluster0-shard-00-00.kijr9.mongodb.net:27017,cluster0-shard-00-01.kijr9.mongodb.net:27017,cluster0-shard-00-02.kijr9.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-w5iyxz-shard-0&authSource=admin&retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected With Database')
    }).catch((error) => {
        console.log(error)
    })
let temp = new info({ imgUrl: "Failure.PNG", heading: "Hello", description: "Helloooo" })
temp.save().then((res) => {
    console.log(res)
}).catch((err) => {
    conosle.log(err)
})