const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })
const compression = require('compression')
const helmet = require('helmet')
const router = require('./routes')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { strategy } = require('./config/passport-setup')


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, autoReconnect: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('Auth connected to mongo!')).catch(console.log)

const app = express()
app.use(compression())
app.use(helmet())
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
passport.use(strategy) // JWT strategy starts here! 
app.use('/facebook/login', passport.authenticate('facebook', { scope: ["email"] })) // facebook middleware
app.use('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebook-login' }), (req, res) =>
    res.json({ status: 200, message: "loggedin", token: jwt.sign({ id: { isMobile: false, id: req.user.email } }, process.env.JWT_SECRET) })) //callback called after login success, or redirect to fb login if fails
app.use(router) // our router tab3an! 


app.listen(process.env.AUTH_PORT, () => console.log('AUTH up and running!'))
