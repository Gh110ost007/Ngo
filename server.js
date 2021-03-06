const express = require('express')
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const cryptoJs = require('crypto-js');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
var carousel = require("./models/carousel.js")
var info = require("./models/info.js")
const PORT = process.env.PORT || 3000;
const email = "adminNgo@gmail.com";
const password = "adminNgo";
const serverPassword = "serverAdminNgo";


mongoose.connect('mongodb://admin:adiritwic@cluster0-shard-00-00.kijr9.mongodb.net:27017,cluster0-shard-00-01.kijr9.mongodb.net:27017,cluster0-shard-00-02.kijr9.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-w5iyxz-shard-0&authSource=admin&retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected With Database')
    }).catch((error) => {
        console.log(error)
    })

app.use(cookieParser());

function checker(req, res, next) {
    try {
        var k = req.cookies.jwt
        var user = jwt.verify(k, serverPassword)
        next();

    }
    catch (err) {
        res.redirect('/admin')
    }

}
app.use(express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({ extended: false }))


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    carousel.find({}).then((data) => {
        info.find({}).then((data2) => {
            res.render("index", { data, data2 })
        }).catch(error2 => { console.log(error2) })
    }).catch(error => { console.log(error) })
})

app.get('/donate', (req, res) => {
    res.redirect("https://pmny.in/zri1DTyFPdEV")
})

app.get('/success', (req, res) => {
    res.render("thankyou")
})

app.get('/failure', (req, res) => {
    res.render("paymentfailure")
})

app.get('/carousel-update', checker, (req, res) => {
    carousel.find({}).then((data) => {
        res.render("carousel-update", { data })
    }).catch(error => { console.log(error) })

})

app.post('/carousel-update', checker, (req, res) => {
    const { imgUrl, _id, heading, description } = req.body;
    carousel.findOneAndUpdate({ _id }, { imgUrl, heading, description }).then((data) => {

        res.status(200).json({ messgae: 'Data updated' })
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/info-update', checker, (req, res) => {
    info.find({}).then((data) => {
        res.render("info-update", { data })
    }).catch(error => { console.log(error) })

})

app.post('/info-update', checker, (req, res) => {
    const { imgUrl, _id, heading, description } = req.body;
    info.findOneAndUpdate({ _id }, { imgUrl, heading, description }).then((data) => {
        res.status(200).json({ messgae: 'Data updated' })
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/admin', (req, res) => {
    res.render("admin")
})

app.post('/login', (req, res) => {
    var checkEmail = req.body.email;
    var checkPassword = req.body.password;
    if (checkPassword == password && checkEmail == email) {
        const token = jwt.sign({ message: "success" }, serverPassword)
        res.cookie("jwt", token);
        res.redirect("/adminHome")
    } else res.json({ message: "wrong information" })
})

app.get('/adminHome', checker, (req, res) => {
    res.render("adminHome")
})

app.get('/signout', (req, res) => {
    res.clearCookie("jwt")
    res.redirect('/admin')
})

app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else console.log("Server is running on port: " + PORT)
})