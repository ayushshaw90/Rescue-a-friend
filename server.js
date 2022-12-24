if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bcrypt = require("bcrypt")
const passport = require('passport')
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require('method-override')
const sendSMS = require('./twilio-message')
//models
const User = require('./Models/User')
const Alert = require('./Models/Alert')

mongoose.connect(process.env.MONGOURI)

// const testAlert = new User({"name": "Ayush Shaw", "email": "ayush12@ayush.com", "password": "6.411", "phonenumber": "+91 9330622185"})
// testAlert.save().then(()=>{console.log("User saved", testAlert)})

const initializePassport = require('./passportconfig')
initializePassport(
    passport,
    async (email) => {
        return await User.find({"email": email})
    },
    async (id) => {
        const users = (await User.find({"_id": id}));
        const user = (users.length>0)?users[0]:null;
        console.log("find by id")
        console.log(user)
        return user
    }
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
    // sendSMS(`Alert!!, ${req.user.name} is getting harrased. Open the webapp to know his current location. http://localhost:3000`, '+919330622185')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
app.get('/alert', checkAuthenticated, (req, res)=>{
    res.render('alert.ejs')
})
app.post('/alert', checkAuthenticated, async (req, res) => {
    try{
        const name = req.user.name;
        const email = req.user.email;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const pastalert = await Alert.count({"email": email})
        console.log(pastalert)
        if(pastalert>0){
            await Alert.deleteMany({"email": email})
        }
        const alert = new Alert({
            "name": name,
            "email": email,
            "latilude": latitude,
            "longitude": longitude
        })
        await alert.save();
        const getAllusers = await User.find({})
        getAllusers.forEach(item=>{
            sendSMS(`Alert from Save-your-friend!!, Your friend, ${req.user.name} is getting bullied.`, item.phonenumber)
        })
        res.json({
            "status": "OK"
        })
    } catch (e) {
        console.log(e.message)
        res.json({"status": "Error occured, failed to send message."})
    }
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        console.log(req.body.password)
        if((await User.find({"email": req.body.email})).length>0){
            redirect('/register')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userentry = new User({
            "name": req.body.name,
            "email": req.body.email,
            "password": hashedPassword,
            "phonenumber": req.body.phonenumber
        })
        userentry.save().then(()=>{
            console.log("saved", userentry)
            res.redirect('/login')
        })
        
        // res.redirect('/login')
    } catch (e) {
        console.log(e.message)
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut((err) => {

        if (err) {
            return next(err);
        }
        return res.redirect('/');

    })
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

app.listen(process.env.PORT || 3000)