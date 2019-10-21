
const passportJWT = require("passport-jwt")
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const { userModelSelectUserData, userModelUpdateOperations } = require('../models')

var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

var strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    let finder = jwt_payload.id.isMobile ? { mobile: jwt_payload.id.id } : { email: jwt_payload.id.id }
    const user = await userModelSelectUserData({ one: true, finder, selection: { password: 0, subject: 0 } })
    if (user) {
        next(null, user)
    } else {
        next(null, false)
    }
})


const facebook = passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    enableProof: true,
    profileFields: ['id', 'name', 'email']
},
    async function (_, _refreshToken, { _json: { first_name: first, id, email } }, done) {
        try {
            let user = { username: first, facebook: { id }, email, isVerified: true, isDeleted: false }
            await userModelUpdateOperations(
                {
                    one: true, finder: { email },
                    updates: { $set: user },
                    options: { upsert: true } // if not exist, add it
                })
            done(null, user)
        } catch ({ message }) {
            done(message, false)
        }
    }
))

passport.serializeUser((user, done) => done(null, user.username))

passport.deserializeUser(async (username, done) => {
    try {
        let user = await userModelSelectUserData({ one: true, finder: { username } })
        user ? done(null, user.name) : done(null, null)
    } catch (err) {
        done(err, null)
    }
})


module.exports = { strategy, facebook }