const express = require('express')
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const cryptoJs = require('crypto-js');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
var carousel = require("../models/carousel.js")
var info = require("../models/info.js")
const email = "adminNgo@gmail.com";
const password = "adminNgo";
const serverPassword = "serverAdminNgo";

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:adiritwic@cluster0.kijr9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoUri, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0
})
    .then(() => {
        console.log('Connected With Database')
    }).catch((error) => {
        console.log('Database connection error:', error)
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

app.use(express.static(__dirname + "/../public"))
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/../views')

app.get('/', (req, res) => {
    carousel.find({}).then((data) => {
        info.find({}).then((data2) => {
            res.render("index", { data, data2 })
        }).catch(error2 => { 
            console.log('Info query error:', error2)
            res.status(500).send('Database error')
        })
    }).catch(error => { 
        console.log('Carousel query error:', error)
        res.status(500).send('Database error')
    })
})

app.get('/mod', (req, res) => {
    res.render("mod")
})

app.get('/admin', (req, res) => {
    res.render("admin")
})

app.post('/login', (req, res) => {
    const { email: userEmail, password: userPassword } = req.body;
    if (userEmail === email && userPassword === password) {
        const token = jwt.sign({ email: userEmail }, serverPassword);
        res.cookie('jwt', token);
        res.redirect('/adminHome');
    } else {
        res.redirect('/admin');
    }
});

app.get('/adminHome', checker, (req, res) => {
    res.render("adminHome")
})

app.get('/carousel-update', checker, (req, res) => {
    carousel.find({}).then((data) => {
        res.render("carousel-update", { data })
    })
})

app.post('/carousel-update', checker, (req, res) => {
    const { title, description, image } = req.body;
    carousel.create({ title, description, image }).then(() => {
        res.redirect('/carousel-update')
    })
})

app.get('/info-update', checker, (req, res) => {
    info.find({}).then((data) => {
        res.render("info-update", { data })
    })
})

app.post('/info-update', checker, (req, res) => {
    const { title, description } = req.body;
    info.create({ title, description }).then(() => {
        res.redirect('/info-update')
    })
})

app.get('/donate', (req, res) => {
    res.render("thankyou")
})

app.get('/paymentfailure', (req, res) => {
    res.render("paymentfailure")
})

app.get('/signout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/admin')
})

module.exports = app;
